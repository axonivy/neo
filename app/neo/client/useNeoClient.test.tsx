import { act, renderHook } from '@testing-library/react';
import { NeoClientProvider, useNeoClient } from './useNeoClient';
import { useLocation, useNavigate } from '@remix-run/react';
import { Mock } from 'vitest';
import { Process } from '~/data/process-api';
import { NeoClient, Callback } from '~/data/neo-protocol';
import { createProcessEditor, useEditors } from '../editors/useEditors';
import { AnimationFollowMode } from '../settings/useSettings';

vi.mock('@remix-run/react', async importOriginal => {
  const navigateFn = vi.fn();
  const locationFn = vi.fn();
  return {
    ...(await importOriginal<typeof import('@remix-run/react')>()),
    useLocation: locationFn,
    useNavigate: () => navigateFn
  };
});

const locationFn = useLocation as unknown as Mock;

beforeEach(() => {
  locationFn.mockImplementation(() => '');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useNeoClient', () => {
  const process: Process = {
    kind: 'NORMAL',
    name: 'info',
    namespace: '',
    path: 'info',
    processGroup: 'Main Processes',
    processIdentifier: { project: { app: 'designer', pmv: 'glsp-test-project' }, pid: '1842D6FBB6A107AB' },
    requestPath: 'info.p',
    type: 'glsp.test.project.Data'
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
    kind: 3,
    type: 'glsp.test.project.hd.hdData'
  };

  const renderNeoClientHook = (mode: AnimationFollowMode) => {
    const mockClient: NeoClient = {
      onOpenEditor: new Callback<Process, boolean>(),
      animationSettings: vi.fn()
    };

    return renderHook(() => useNeoClient(mode), {
      wrapper: ({ children }) => <NeoClientProvider client={mockClient}>{children}</NeoClientProvider>
    });
  };

  it('all', async () => {
    const { result } = renderNeoClientHook('all');
    const shouldAnimate = await act(() => result.current.onOpenEditor.call(process));
    expect(shouldAnimate).to.be.true;
    expect(useNavigate()).toHaveBeenLastCalledWith('/designer/processes/designer/glsp-test-project/info');
  });

  it('current process', async () => {
    const { result, rerender } = renderNeoClientHook('currentProcess');
    let shouldAnimate = await act(() => result.current.onOpenEditor.call(process));
    expect(shouldAnimate).to.be.false;
    expect(useNavigate()).toBeCalledTimes(0);

    locationFn.mockImplementation(() => ({ pathname: '/designer/processes/designer/glsp-test-project/info' }));
    rerender();
    shouldAnimate = await act(() => result.current.onOpenEditor.call(process));
    expect(shouldAnimate).to.be.true;
    expect(useNavigate()).toBeCalledTimes(0);
  });

  it('open processes - closed', async () => {
    locationFn.mockImplementation(() => ({}));
    const { result } = renderNeoClientHook('openProcesses');
    let shouldAnimate = await act(() => result.current.onOpenEditor.call(process));
    expect(shouldAnimate).to.be.false;
    expect(useNavigate()).toBeCalledTimes(0);

    const {
      result: {
        current: { openEditor }
      }
    } = renderHook(() => useEditors());
    act(() => openEditor(createProcessEditor({ ws: 'designer', ...process })));

    shouldAnimate = await act(() => result.current.onOpenEditor.call(process));
    expect(shouldAnimate).to.be.true;
    expect(useNavigate()).toBeCalledTimes(2);
  });

  it('no dialog processes', async () => {
    const { result } = renderNeoClientHook('noDialogProcesses');
    let shouldAnimate = await act(() => result.current.onOpenEditor.call(hdProcess));
    expect(shouldAnimate).to.be.false;
    expect(useNavigate()).toBeCalledTimes(0);

    shouldAnimate = await act(() => result.current.onOpenEditor.call(process));
    expect(shouldAnimate).to.be.true;
    expect(useNavigate()).toBeCalledTimes(1);
  });
});
