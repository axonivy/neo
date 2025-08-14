import { IvyIcons } from '@axonivy/ui-icons';
import { act, renderHook } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import type { Mock } from 'vitest';
import type { Editor } from './editor';
import { useEditors, useRecentlyOpenedEditors } from './useEditors';

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

vi.mock('react-router', async importOriginal => {
  const navigateFn = vi.fn();
  return { ...(await importOriginal<typeof import('react-router')>()), useParams: vi.fn(), useNavigate: () => navigateFn };
});

beforeAll(() => {
  (useParams as unknown as Mock).mockImplementation(() => ({ ws: 'test-ws' }));
});

describe('openEditors', () => {
  afterEach(() => {
    (useNavigate() as unknown as Mock).mockReset();
  });

  test('add editors', () => {
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).toEqual([]);
    act(() => {
      result.current.addEditor(processEditor);
      // add twice, will only add once
      result.current.addEditor(processEditor);
    });
    expect(result.current.editors).toEqual([processEditor]);
    expect(useNavigate()).toBeCalledTimes(0);
  });

  test('remove editors', () => {
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).toEqual([]);
    act(() => {
      result.current.addEditor(formEditor);
      result.current.addEditor(processEditor);
    });
    expect(result.current.editors).toEqual([formEditor, processEditor]);
    act(() => {
      result.current.removeEditor('2');
    });
    expect(result.current.editors).toEqual([formEditor]);
    expect(useNavigate()).toBeCalledTimes(0);
  });

  test('close all', () => {
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).toEqual([]);
    act(() => {
      result.current.addEditor(formEditor);
      result.current.addEditor(processEditor);
    });
    expect(result.current.editors).toEqual([formEditor, processEditor]);
    act(() => {
      result.current.closeAllEditors();
    });
    expect(result.current.editors).toEqual([]);
  });

  test('close back to parent', () => {
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).toEqual([]);
    const editor: Editor = {
      icon: IvyIcons.Process,
      id: '/test-ws/processes/designer/workflow-demos/workflow/demo/form/formProcess',
      name: 'formProcess',
      path: 'workflow/demo/form/formProcess',
      project: { app: 'designer', pmv: 'workflow-demos' },
      type: 'processes'
    };
    act(() => result.current.openEditor(editor));
    expect(result.current.editors).toEqual([editor]);
    act(() => result.current.closeEditors([editor.id]));
    expect(useNavigate()).toHaveBeenLastCalledWith('/test-ws/processes', { replace: true });
  });

  test('navigate', () => {
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).toEqual([]);
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
    expect(result.current.editors).toEqual([]);
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
});

describe('recentlyOpenedEditors', () => {
  test('open editor', () => {
    const {
      result: {
        current: { addEditor }
      }
    } = renderHook(() => useEditors());
    const { result } = renderHook(() => useRecentlyOpenedEditors());
    act(() => addEditor(formEditor));
    act(() => addEditor(formEditor));
    expect(result.current.editors).toEqual([formEditor]);

    act(() => addEditor(processEditor));
    expect(result.current.editors).toEqual([processEditor, formEditor]);
  });

  test('remove editor', () => {
    const {
      result: {
        current: { addEditor }
      }
    } = renderHook(() => useEditors());
    const { result } = renderHook(() => useRecentlyOpenedEditors());
    act(() => addEditor(formEditor));
    act(() => addEditor(processEditor));
    expect(result.current.editors).toEqual([processEditor, formEditor]);

    act(() => result.current.removeRecentlyOpened(formEditor.id));
    expect(result.current.editors).toEqual([processEditor]);

    act(() => result.current.removeRecentlyOpened(processEditor.id));
    expect(result.current.editors).toEqual([]);
  });

  test('cleanup recently opened', () => {
    const {
      result: {
        current: { addEditor }
      }
    } = renderHook(() => useEditors());
    const { result } = renderHook(() => useRecentlyOpenedEditors());
    act(() => addEditor(formEditor));
    act(() => addEditor(processEditor));
    expect(result.current.editors).toEqual([processEditor, formEditor]);

    act(() => result.current.cleanupRecentlyOpened());
    expect(result.current.editors).toEqual([]);
  });
});

test('persisted', () => {
  const { result } = renderHook(() => useEditors());
  act(() => {
    result.current.closeAllEditors();
  });
  expect(JSON.parse(window.localStorage.getItem('neo-open-editors') ?? '').state).toEqual({
    openEditors: { 'test-ws': [] },
    recentlyOpenedEditors: {}
  });
  act(() => {
    result.current.addEditor(processEditor);
  });
  expect(JSON.parse(window.localStorage.getItem('neo-open-editors') ?? '').state).toEqual({
    openEditors: { 'test-ws': [processEditor] },
    recentlyOpenedEditors: { 'test-ws': [processEditor] }
  });
});
