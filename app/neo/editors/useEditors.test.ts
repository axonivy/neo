import { IvyIcons } from '@axonivy/ui-icons';
import { useNavigate, useParams } from '@remix-run/react';
import { act, renderHook } from '@testing-library/react';
import { Mock } from 'vitest';
import { Editor, useEditors } from './useEditors';

vi.mock('@remix-run/react', async importOriginal => {
  const navigateFn = vi.fn();
  const paramsFn = vi.fn();
  return {
    ...(await importOriginal<typeof import('@remix-run/react')>()),
    useParams: paramsFn,
    useNavigate: () => navigateFn
  };
});

const paramsFn = useParams as unknown as Mock;

beforeEach(() => {
  paramsFn.mockImplementation(() => ({ ws: 'test-ws' }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

const editor: Editor = {
  id: '1',
  type: 'forms',
  icon: IvyIcons.File,
  name: 'form',
  project: { app: 'designer', pmv: 'workflow-demos' },
  path: 'workflow/demo/form/form'
};

test('add editors', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.addEditor(editor);
    // add twice, will only add once
    result.current.addEditor(editor);
  });
  expect(result.current.editors).to.be.deep.equals([editor]);
  expect(useNavigate()).toBeCalledTimes(0);
});

test('remove editors', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.addEditor(editor);
    result.current.addEditor({ ...editor, id: '2' });
  });
  expect(result.current.editors).to.be.deep.equals([editor, { ...editor, id: '2' }]);
  act(() => {
    result.current.removeEditor('2');
  });
  expect(result.current.editors).to.be.deep.equals([editor]);
  expect(useNavigate()).toBeCalledTimes(0);
});

test('close all', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.openEditor(editor);
    result.current.openEditor({ ...editor, id: '2' });
  });
  expect(result.current.editors).to.be.deep.equals([editor, { ...editor, id: '2' }]);
  act(() => {
    result.current.closeAllEditors();
  });
  expect(result.current.editors).to.be.deep.equals([]);
});

test('navigate', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.openEditor(editor);
    result.current.openEditor({ ...editor, id: '2' });
    result.current.openEditor({ ...editor, id: '3' });
  });
  expect(useNavigate()).toHaveBeenLastCalledWith('3');

  act(() => result.current.closeEditors(['2']));
  expect(useNavigate()).toHaveBeenLastCalledWith('1', { replace: true });

  act(() => result.current.closeEditors(['1']));
  expect(useNavigate()).toHaveBeenLastCalledWith('3', { replace: true });

  act(() => result.current.closeAllEditors());
  expect(useNavigate()).toHaveBeenLastCalledWith('/test-ws', { replace: true });
  expect(useNavigate()).toBeCalledTimes(6);
});

test('persisted', () => {
  const { result } = renderHook(() => useEditors());
  expect(JSON.parse(window.localStorage.getItem('neo-open-editors')!).state).to.be.deep.equals({ workspaces: {} });
  act(() => {
    result.current.addEditor(editor);
  });
  expect(JSON.parse(window.localStorage.getItem('neo-open-editors')!).state).to.be.deep.equals({ workspaces: { 'test-ws': [editor] } });
});
