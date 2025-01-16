import { act, renderHook } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router';
import { Callback, type NeoClient } from '~/data/neo-protocol';
import type { Process } from '~/data/process-api';
import { useCreateEditor } from '../editors/useCreateEditor';
import { useEditors } from '../editors/useEditors';
import type { AnimationFollowMode } from '../settings/useSettings';
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

const renderNeoClientHook = (mode: AnimationFollowMode) => {
  const mockClient: NeoClient = {
    onOpenEditor: new Callback<Process, boolean>(),
    animationSettings: vi.fn(),
    stop: vi.fn()
  };

  return renderHook(() => useNeoClient(mode), {
    wrapper: props => <NeoClientProviderContext.Provider value={{ client: mockClient }} {...props} />
  });
};

test('all', async () => {
  const { result } = renderNeoClientHook('all');
  window.location.pathname = process.pathname;
  const shouldAnimate = await act(() => result.current?.onOpenEditor.call(process));
  expect(shouldAnimate).toBeTruthy();
  expect(useNavigate()).toHaveBeenLastCalledWith(process.pathname);
});

test('current process', async () => {
  const { result, rerender } = renderNeoClientHook('currentProcess');
  let shouldAnimate = await act(() => result.current?.onOpenEditor.call(process));
  expect(shouldAnimate).toBeFalsy();
  expect(useNavigate()).toBeCalledTimes(0);

  if (vi.isMockFunction(useLocation)) useLocation.mockImplementation(() => ({ pathname: process.pathname }));
  rerender();
  shouldAnimate = await act(() => result.current?.onOpenEditor.call(process));
  expect(shouldAnimate).toBeTruthy();
  expect(useNavigate()).toBeCalledTimes(0);
});

test('open processes - closed', async () => {
  if (vi.isMockFunction(useLocation)) useLocation.mockImplementation(() => ({}));
  window.location.pathname = process.pathname;
  const { result } = renderNeoClientHook('openProcesses');
  let shouldAnimate = await act(() => result.current?.onOpenEditor.call(process));
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

  shouldAnimate = await act(() => result.current?.onOpenEditor.call(process));
  expect(shouldAnimate).toBeTruthy();
  expect(useNavigate()).toBeCalledTimes(2);
});

test('no dialog processes', async () => {
  const { result } = renderNeoClientHook('noDialogProcesses');
  window.location.pathname = process.pathname;
  let shouldAnimate = await act(() => result.current?.onOpenEditor.call(hdProcess));
  expect(shouldAnimate).toBeFalsy();
  expect(useNavigate()).toBeCalledTimes(0);

  shouldAnimate = await act(() => result.current?.onOpenEditor.call(process));
  expect(shouldAnimate).toBeTruthy();
  expect(useNavigate()).toBeCalledTimes(1);
});
