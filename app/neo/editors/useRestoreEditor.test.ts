import { IvyIcons } from '@axonivy/ui-icons';
import { NavigationType, useNavigationType, useParams } from '@remix-run/react';
import { renderHook } from '@testing-library/react';
import type { Mock } from 'vitest';
import { useEditors } from './useEditors';
import { useRestoreEditor } from './useRestoreEditor';

vi.mock('@remix-run/react', async importOriginal => {
  const navigateFn = vi.fn();
  const paramsFn = vi.fn();
  const navigationTypeFn = vi.fn();
  return {
    ...(await importOriginal<typeof import('@remix-run/react')>()),
    useParams: paramsFn,
    useNavigationType: navigationTypeFn,
    useNavigate: () => navigateFn
  };
});

beforeEach(() => {
  paramsFn.mockImplementation(() => ({ ws: 'test-ws' }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

const navigationTypeFn = useNavigationType as unknown as Mock;
const paramsFn = useParams as unknown as Mock;

test('navigation type push', () => {
  navigationTypeFn.mockImplementation(() => NavigationType.Push);
  paramsFn.mockImplementation(() => ({}));
  renderHook(() => useRestoreEditor('processes'));
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).toHaveLength(0);
});

test('navigation type replace', () => {
  navigationTypeFn.mockImplementation(() => NavigationType.Replace);
  paramsFn.mockImplementation(() => ({}));
  renderHook(() => useRestoreEditor('processes'));
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).toHaveLength(0);
});

test('navigation type pop', () => {
  navigationTypeFn.mockImplementation(() => NavigationType.Pop);
  paramsFn.mockImplementation(() => ({}));
  renderHook(() => useRestoreEditor('processes'));
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).toHaveLength(0);
});

test('corret params', () => {
  navigationTypeFn.mockImplementation(() => NavigationType.Pop);
  paramsFn.mockImplementation(() => ({ ws: 'test-ws', app: 'test', pmv: 'workflow', '*': 'path/test/proc.p.json' }));
  renderHook(() => useRestoreEditor('processes'));
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([
    {
      id: '/test-ws/processes/test/workflow/path/test/proc',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'proc',
      project: { app: 'test', pmv: 'workflow' },
      path: 'path/test/proc'
    }
  ]);
});
