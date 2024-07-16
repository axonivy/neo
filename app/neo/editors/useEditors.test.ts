import { IvyIcons } from '@axonivy/ui-icons';
import { NavigationType, useNavigate, useNavigationType, useParams } from '@remix-run/react';
import { act, renderHook } from '@testing-library/react';
import { Mock } from 'vitest';
import { Form } from '~/data/form-api';
import { Process } from '~/data/process-api';
import { Editor, useCreateEditor, useEditors, useRestoreEditor } from './useEditors';

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

const paramsFn = useParams as unknown as Mock;

beforeEach(() => {
  paramsFn.mockImplementation(() => ({ ws: 'test-ws' }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('createProcessEditor', () => {
  it('business process', () => {
    const result: Editor = {
      id: '/test-ws/processes/designer/glsp-test-project/info',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'info',
      project: { app: 'designer', pmv: 'glsp-test-project' },
      path: 'info'
    };
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
    const view = renderHook(() => useCreateEditor());
    expect(view.result.current.createProcessEditor(process)).to.be.deep.equals(result);
  });

  it('sub process', () => {
    const result: Editor = {
      id: '/test-ws/processes/designer/glsp-test-project/subproc',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'subproc',
      project: { app: 'designer', pmv: 'glsp-test-project' },
      path: 'subproc'
    };
    const process: Process = {
      name: 'subproc',
      namespace: '',
      processIdentifier: { project: { app: 'designer', pmv: 'glsp-test-project' }, pid: '183E4A4179C3C69B' },
      path: 'subproc',
      requestPath: 'subproc.p',
      processGroup: 'Main Processes',
      kind: 'CALLABLE_SUB',
      type: 'glsp.test.project.subprocData'
    };
    const view = renderHook(() => useCreateEditor());
    expect(view.result.current.createProcessEditor(process)).to.be.deep.equals(result);
  });

  it('hd process', () => {
    const result: Editor = {
      id: '/test-ws/src_hd/designer/glsp-test-project/glsp/test/project/hd/hdProcess',
      type: 'src_hd',
      icon: IvyIcons.Process,
      name: 'hdProcess',
      project: { app: 'designer', pmv: 'glsp-test-project' },
      path: 'glsp/test/project/hd/hdProcess'
    };
    const process: Process = {
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
    const view = renderHook(() => useCreateEditor());
    expect(view.result.current.createProcessEditor(process)).to.be.deep.equals(result);
  });
});

describe('createFormEditor', () => {
  it('form', () => {
    const result: Editor = {
      id: '/test-ws/forms/designer/workflow-demos/workflow/demo/form/form',
      type: 'forms',
      icon: IvyIcons.File,
      name: 'form',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'workflow/demo/form/form'
    };
    const form: Form = {
      identifier: { project: { app: 'designer', pmv: 'workflow-demos' }, id: 'workflow.demo.form' },
      name: 'form',
      path: 'workflow/demo/form/form.f.json'
    };
    const view = renderHook(() => useCreateEditor());
    expect(view.result.current.createFormEditor(form)).to.be.deep.equals(result);
  });
});

describe('createEditorFromPath', () => {
  it('form', () => {
    const result: Editor = {
      id: '/test-ws/forms/designer/workflow-demos/workflow/demo/form/form',
      type: 'forms',
      icon: IvyIcons.File,
      name: 'form',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'workflow/demo/form/form'
    };
    const view = renderHook(() => useCreateEditor());
    expect(
      view.result.current.createEditorFromPath('forms', { app: 'designer', pmv: 'workflow-demos' }, 'workflow/demo/form/form.f.json')
    ).to.be.deep.equals(result);
  });

  it('business process', () => {
    const result: Editor = {
      id: '/test-ws/processes/designer/workflow-demos/path/test/proc',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'proc',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'path/test/proc'
    };
    const view = renderHook(() => useCreateEditor());
    expect(
      view.result.current.createEditorFromPath('processes', { app: 'designer', pmv: 'workflow-demos' }, 'path/test/proc.p.json')
    ).to.be.deep.equals(result);
  });

  it('hd process', () => {
    const result: Editor = {
      id: '/test-ws/src_hd/designer/workflow-demos/workflow/demo/form/form',
      type: 'src_hd',
      icon: IvyIcons.Process,
      name: 'form',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'workflow/demo/form/form'
    };
    const view = renderHook(() => useCreateEditor());
    expect(
      view.result.current.createEditorFromPath('src_hd', { app: 'designer', pmv: 'workflow-demos' }, 'workflow/demo/form/form.p.json')
    ).to.be.deep.equals(result);
  });

  it('variables', () => {
    const result: Editor = {
      id: '/test-ws/configurations/designer/workflow-demos/variables',
      type: 'configurations',
      icon: IvyIcons.Tool,
      name: 'variables',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'variables'
    };
    const view = renderHook(() => useCreateEditor());
    expect(
      view.result.current.createEditorFromPath('configurations', { app: 'designer', pmv: 'workflow-demos' }, 'variables')
    ).to.be.deep.equals(result);
  });
});

describe('useEditors', () => {
  const editor: Editor = {
    id: '1',
    type: 'forms',
    icon: IvyIcons.File,
    name: 'form',
    project: { app: 'designer', pmv: 'workflow-demos' },
    path: 'workflow/demo/form/form'
  };

  it('add editors', () => {
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).to.be.deep.equals([]);
    act(() => {
      result.current.addEditor(editor);
      // add twice, will only add once
      result.current.addEditor(editor);
    });
    act(() => {});
    expect(result.current.editors).to.be.deep.equals([editor]);
    expect(useNavigate()).toBeCalledTimes(0);
  });

  it('remove editors', () => {
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

  it('close all', () => {
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

  it('navigate', () => {
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).to.be.deep.equals([]);
    act(() => {
      result.current.openEditor(editor);
      result.current.openEditor({ ...editor, id: '2' });
    });
    expect(useNavigate()).toHaveBeenLastCalledWith('2');

    act(() => {
      result.current.closeEditor('2');
    });
    expect(useNavigate()).toHaveBeenLastCalledWith('1', { replace: true });

    act(() => {
      result.current.closeAllEditors();
    });
    expect(useNavigate()).toHaveBeenLastCalledWith('/test-ws', { replace: true });
    expect(useNavigate()).toBeCalledTimes(4);
  });

  it('persisted', () => {
    const { result } = renderHook(() => useEditors());
    expect(JSON.parse(window.localStorage.getItem('neo-open-editors')!).state).to.be.deep.equals({ workspaces: {} });
    act(() => {
      result.current.addEditor(editor);
    });
    expect(JSON.parse(window.localStorage.getItem('neo-open-editors')!).state).to.be.deep.equals({ workspaces: { 'test-ws': [editor] } });
  });
});

describe('useRestoreEditor', () => {
  const navigationTypeFn = useNavigationType as unknown as Mock;
  const paramsFn = useParams as unknown as Mock;

  it('navigation type push', () => {
    navigationTypeFn.mockImplementation(() => NavigationType.Push);
    paramsFn.mockImplementation(() => ({}));
    renderHook(() => useRestoreEditor('processes'));
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).toHaveLength(0);
  });

  it('navigation type replace', () => {
    navigationTypeFn.mockImplementation(() => NavigationType.Replace);
    paramsFn.mockImplementation(() => ({}));
    renderHook(() => useRestoreEditor('processes'));
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).toHaveLength(0);
  });

  it('navigation type pop', () => {
    navigationTypeFn.mockImplementation(() => NavigationType.Pop);
    paramsFn.mockImplementation(() => ({}));
    renderHook(() => useRestoreEditor('processes'));
    const { result } = renderHook(() => useEditors());
    expect(result.current.editors).toHaveLength(0);
  });

  it('corret params', () => {
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
});
