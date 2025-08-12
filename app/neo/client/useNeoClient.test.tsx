import { act, renderHook } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router';
import type { Form } from '~/data/form-api';
import { Callback, type NeoClient } from '~/data/neo-protocol';
import type { Process } from '~/data/process-api';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { useSettings, type AnimationFollowMode } from '~/neo/navigation/settings/useSettings';
import { NeoClientProviderContext, useNeoClient } from './useNeoClient';

vi.mock('react-router', async importOriginal => {
  const navigateFn = vi.fn();
  return {
    ...(await importOriginal<typeof import('react-router')>()),
    useLocation: vi.fn<typeof useLocation>(),
    useNavigate: () => navigateFn
  };
});

beforeEach(() => {
  if (vi.isMockFunction(useLocation)) useLocation.mockImplementation(() => ({ pathname: '', hash: '', key: '', search: '', state: '' }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderNeoClientHook = () => {
  const mockClient: NeoClient = {
    onOpenProcessEditor: new Callback<Process, boolean>(),
    onOpenFormEditor: new Callback<Form, boolean>(),
    animationSettings: vi.fn(),
    stop: vi.fn()
  };

  return renderHook(() => useNeoClient(), {
    wrapper: props => <NeoClientProviderContext.Provider value={{ client: mockClient }} {...props} />
  });
};

describe('process animation', () => {
  const process: Process & { pathname: string } = {
    kind: 'NORMAL',
    name: 'info',
    namespace: '',
    path: 'info',
    processGroup: 'Main Processes',
    processIdentifier: { project: { app: 'designer', pmv: 'glsp-test-project' }, pid: '1842D6FBB6A107AB' },
    requestPath: 'info.p',
    type: 'glsp.test.project.Data',
    pathname: '/designer/processes/designer/glsp-test-project/processes/info'
  };

  const hdProcess: Process = {
    name: 'hdProcess',
    namespace: 'glsp/test/project/hd',
    processIdentifier: {
      project: {
        app: 'designer',
        pmv: 'glsp-test-project'
      },
      pid: '183E4A455276AFC5'
    },
    requestPath: 'glsp/test/project/hd/hdProcess.p',
    processGroup: 'User Dialog Processes',
    kind: 'HTML_DIALOG',
    type: 'glsp.test.project.hd.hdData'
  };

  const renderAnimation = (mode: AnimationFollowMode) => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.animationMode(mode);
    });
    return renderNeoClientHook();
  };

  test('all', async () => {
    const { result } = renderAnimation('all');
    window.location.pathname = process.pathname;
    const shouldAnimate = await act(() => result.current?.onOpenProcessEditor.call(process));
    expect(shouldAnimate).toBeTruthy();
    expect(useNavigate()).toHaveBeenLastCalledWith(process.pathname);
  });

  test('current process', async () => {
    const { result, rerender } = renderAnimation('currentProcess');
    let shouldAnimate = await act(() => result.current?.onOpenProcessEditor.call(process));
    expect(shouldAnimate).toBeFalsy();
    expect(useNavigate()).toBeCalledTimes(0);

    if (vi.isMockFunction(useLocation)) useLocation.mockImplementation(() => ({ pathname: process.pathname }));
    rerender();
    shouldAnimate = await act(() => result.current?.onOpenProcessEditor.call(process));
    expect(shouldAnimate).toBeTruthy();
    expect(useNavigate()).toBeCalledTimes(0);
  });

  test('open processes - closed', async () => {
    if (vi.isMockFunction(useLocation)) useLocation.mockImplementation(() => ({}));
    window.location.pathname = process.pathname;
    const { result } = renderAnimation('openProcesses');
    let shouldAnimate = await act(() => result.current?.onOpenProcessEditor.call(process));
    expect(shouldAnimate).toBeFalsy();
    expect(useNavigate()).toBeCalledTimes(0);

    const {
      result: {
        current: { openEditor }
      }
    } = renderHook(() => useEditors());
    const {
      result: {
        current: { createProcessEditor }
      }
    } = renderHook(() => useCreateEditor());
    act(() => openEditor(createProcessEditor(process)));

    shouldAnimate = await act(() => result.current?.onOpenProcessEditor.call(process));
    expect(shouldAnimate).toBeTruthy();
    expect(useNavigate()).toBeCalledTimes(2);
  });

  test('no dialog processes', async () => {
    const { result } = renderAnimation('noDialogProcesses');
    window.location.pathname = process.pathname;
    let shouldAnimate = await act(() => result.current?.onOpenProcessEditor.call(hdProcess));
    expect(shouldAnimate).toBeFalsy();
    expect(useNavigate()).toBeCalledTimes(0);

    shouldAnimate = await act(() => result.current?.onOpenProcessEditor.call(process));
    expect(shouldAnimate).toBeTruthy();
    expect(useNavigate()).toBeCalledTimes(1);
  });
});

describe('form', () => {
  const jsf: Form = {
    identifier: {
      project: {
        app: 'Developer-neo-test-project',
        pmv: 'neo-test-project',
        isIar: false
      },
      id: 'neo.test.project.EnterProductJsf'
    },
    name: 'EnterProductJsf',
    namespace: 'neo.test.project',
    path: 'neo/test/project/EnterProductJsf/EnterProductJsf',
    type: 'JSF'
  };

  test('open jsf', async () => {
    const { result } = renderNeoClientHook();
    const editorOpened = await act(() => result.current?.onOpenFormEditor.call(jsf));
    expect(editorOpened).toBeFalsy();
    expect(useNavigate()).toBeCalledTimes(0);
  });

  const form: Form = {
    identifier: {
      project: {
        app: 'Developer-neo-test-project',
        pmv: 'neo-test-project',
        isIar: false
      },
      id: 'neo.test.project.EnterProduct'
    },
    name: 'EnterProduct',
    namespace: 'neo.test.project',
    path: 'neo/test/project/EnterProduct/EnterProduct',
    type: 'Form'
  };

  test('open form', async () => {
    const { result } = renderNeoClientHook();
    const editorOpened = await act(() => result.current?.onOpenFormEditor.call(form));
    expect(editorOpened).toBeTruthy();
    expect(useNavigate()).toBeCalledTimes(1);
  });
});
