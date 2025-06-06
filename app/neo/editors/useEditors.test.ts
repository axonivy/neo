import { IvyIcons } from '@axonivy/ui-icons';
import { act, renderHook } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import type { Mock } from 'vitest';
import type { Editor } from './editor';
import { useEditors } from './useEditors';

vi.mock('react-router', async importOriginal => {
  const navigateFn = vi.fn();
  const paramsFn = vi.fn();
  return { ...(await importOriginal<typeof import('react-router')>()), useParams: paramsFn, useNavigate: () => navigateFn };
});

const paramsFn = useParams as unknown as Mock;

beforeEach(() => {
  paramsFn.mockImplementation(() => ({ ws: 'test-ws' }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

const formEditor: Editor = {
  id: '1',
  type: 'forms',
  icon: IvyIcons.File,
  name: 'form',
  project: { app: 'designer', pmv: 'workflow-demos' },
  path: 'workflow/demo/form/form'
};

const processEditor: Editor = {
  id: '2',
  type: 'processes',
  icon: IvyIcons.Process,
  name: 'formProcess',
  project: { app: 'designer', pmv: 'workflow-demos' },
  path: 'workflow/demo/form/formProcess'
};

test('add editors', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.addEditor(processEditor);
    // add twice, will only add once
    result.current.addEditor(processEditor);
  });
  expect(result.current.editors).to.be.deep.equals([processEditor]);
  expect(useNavigate()).toBeCalledTimes(0);
});

test('remove editors', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.addEditor(formEditor);
    result.current.addEditor(processEditor);
  });
  expect(result.current.editors).to.be.deep.equals([formEditor, processEditor]);
  act(() => {
    result.current.removeEditor('2');
  });
  expect(result.current.editors).to.be.deep.equals([formEditor]);
  expect(useNavigate()).toBeCalledTimes(0);
});

test('close all', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.addEditor(formEditor);
    result.current.addEditor(processEditor);
  });
  expect(result.current.editors).to.be.deep.equals([formEditor, processEditor]);
  act(() => {
    result.current.closeAllEditors();
  });
  expect(result.current.editors).to.be.deep.equals([]);
});

test('close back to parent', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  const editor: Editor = {
    icon: IvyIcons.Process,
    id: '/test-ws/processes/designer/workflow-demos/workflow/demo/form/formProcess',
    name: 'formProcess',
    path: 'workflow/demo/form/formProcess',
    project: { app: 'designer', pmv: 'workflow-demos' },
    type: 'processes'
  };
  act(() => result.current.openEditor(editor));
  expect(result.current.editors).to.be.deep.equals([editor]);
  act(() => result.current.closeEditors([editor.id]));
  expect(useNavigate()).toHaveBeenLastCalledWith('/test-ws/processes', { replace: true });
});

test('navigate', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.openEditor({ ...processEditor, id: '1' });
    result.current.openEditor({ ...processEditor, id: '2' });
    result.current.openEditor({ ...processEditor, id: '3' });
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

test('open all dialog editors', () => {
  const { result } = renderHook(() => useEditors());
  expect(result.current.editors).to.be.deep.equals([]);
  act(() => {
    result.current.openEditor(formEditor);
  });
  expect(useNavigate()).toHaveBeenLastCalledWith('1');
  expect(result.current.editors).toHaveLength(3);
  expect(result.current.editors[0]).toEqual(formEditor);
  expect(result.current.editors[1]).toEqual({
    icon: 'process',
    id: '/test-ws/processes/designer/workflow-demos/workflow/demo/form/formProcess',
    name: 'formProcess',
    path: 'workflow/demo/form/formProcess',
    project: { app: 'designer', pmv: 'workflow-demos' },
    type: 'processes'
  });
  expect(result.current.editors[2]).toEqual({
    icon: 'database',
    id: '/test-ws/dataclasses/designer/workflow-demos/workflow/demo/form/formData',
    name: 'formData',
    path: 'workflow/demo/form/formData',
    project: { app: 'designer', pmv: 'workflow-demos' },
    type: 'dataclasses'
  });
});

test('persisted', () => {
  const { result } = renderHook(() => useEditors());
  act(() => {
    result.current.closeAllEditors();
  });
  expect(JSON.parse(window.localStorage.getItem('neo-open-editors') ?? '').state).to.be.deep.equals({ workspaces: {} });
  act(() => {
    result.current.addEditor(processEditor);
  });
  expect(JSON.parse(window.localStorage.getItem('neo-open-editors') ?? '').state).to.be.deep.equals({
    workspaces: { 'test-ws': [processEditor] }
  });
});
