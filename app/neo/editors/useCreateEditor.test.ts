import { IvyIcons } from '@axonivy/ui-icons';
import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router';
import type { Mock } from 'vitest';
import type { Form } from '~/data/form-api';
import type { DataClassBean } from '~/data/generated/openapi-dev';
import type { Process } from '~/data/process-api';
import type { Editor } from './editor';
import { useCreateEditor } from './useCreateEditor';

vi.mock('react-router', async importOriginal => {
  const paramsFn = vi.fn();
  return {
    ...(await importOriginal<typeof import('react-router')>()),
    useParams: paramsFn
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
  test('business process', () => {
    const result: Editor = {
      id: '/test-ws/processes/designer/glsp-test-project/processes/info',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'info',
      project: { app: 'designer', pmv: 'glsp-test-project' },
      path: 'processes/info'
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

  test('sub process', () => {
    const result: Editor = {
      id: '/test-ws/processes/designer/glsp-test-project/processes/subproc',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'subproc',
      project: { app: 'designer', pmv: 'glsp-test-project' },
      path: 'processes/subproc'
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

  test('hd process', () => {
    const result: Editor = {
      id: '/test-ws/processes/designer/glsp-test-project/src_hd/glsp/test/project/hd/hdProcess',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'hdProcess',
      project: { app: 'designer', pmv: 'glsp-test-project' },
      path: 'src_hd/glsp/test/project/hd/hdProcess'
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
  test('form', () => {
    const result: Editor = {
      id: '/test-ws/forms/designer/workflow-demos/src_hd/workflow/demo/form/form',
      type: 'forms',
      icon: IvyIcons.File,
      name: 'form',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'src_hd/workflow/demo/form/form'
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

describe('createDataClassEditor', () => {
  test('dataclass', () => {
    const result: Editor = {
      id: '/test-ws/dataclasses/designer/workflow-demos/workflow/demo/data/data',
      type: 'dataclasses',
      icon: IvyIcons.Database,
      name: 'data',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'workflow/demo/data/data'
    };
    const dataClass: DataClassBean = {
      dataClassIdentifier: { project: { app: 'designer', pmv: 'workflow-demos' }, name: 'workflow.demo.data' },
      name: 'data.d.json',
      simpleName: 'data',
      path: 'workflow/demo/data/data.d.json',
      isEntityClass: false,
      isBusinessCaseData: false
    };
    const view = renderHook(() => useCreateEditor());
    expect(view.result.current.createDataClassEditor(dataClass)).to.be.deep.equals(result);
  });
});

describe('createVariableEditor', () => {
  test('dataclass', () => {
    const result: Editor = {
      id: '/test-ws/configurations/designer/workflow-demos/config/variables',
      type: 'configurations',
      icon: IvyIcons.Tool,
      name: 'variables',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'config/variables'
    };
    const view = renderHook(() => useCreateEditor());
    const config = { project: { app: 'designer', pmv: 'workflow-demos' }, path: 'config/variables' };
    expect(view.result.current.createConfigurationEditor(config)).to.be.deep.equals(result);
  });
});

describe('createEditorFromPath', () => {
  test('form', () => {
    const result: Editor = {
      id: '/test-ws/forms/designer/workflow-demos/src_hd/workflow/demo/form/form',
      type: 'forms',
      icon: IvyIcons.File,
      name: 'form',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'src_hd/workflow/demo/form/form'
    };
    const view = renderHook(() => useCreateEditor());
    expect(
      view.result.current.createEditorFromPath({ app: 'designer', pmv: 'workflow-demos' }, 'src_hd/workflow/demo/form/form.f.json', 'forms')
    ).to.be.deep.equals(result);
  });

  test('business process', () => {
    const result: Editor = {
      id: '/test-ws/processes/designer/workflow-demos/processes/path/test/proc',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'proc',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'processes/path/test/proc'
    };
    const view = renderHook(() => useCreateEditor());
    expect(
      view.result.current.createEditorFromPath({ app: 'designer', pmv: 'workflow-demos' }, 'processes/path/test/proc.p.json', 'processes')
    ).to.be.deep.equals(result);
  });

  test('hd process', () => {
    const result: Editor = {
      id: '/test-ws/processes/designer/workflow-demos/src_hd/workflow/demo/form/form',
      type: 'processes',
      icon: IvyIcons.Process,
      name: 'form',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'src_hd/workflow/demo/form/form'
    };
    const view = renderHook(() => useCreateEditor());
    expect(
      view.result.current.createEditorFromPath(
        { app: 'designer', pmv: 'workflow-demos' },
        'src_hd/workflow/demo/form/form.p.json',
        'processes'
      )
    ).to.be.deep.equals(result);
  });

  test('variables', () => {
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
      view.result.current.createEditorFromPath({ app: 'designer', pmv: 'workflow-demos' }, 'variables', 'configurations')
    ).to.be.deep.equals(result);
  });

  test('data class', () => {
    const result: Editor = {
      id: '/test-ws/dataclasses/designer/workflow-demos/dataclasses/form/Data',
      type: 'dataclasses',
      icon: IvyIcons.Database,
      name: 'Data',
      project: { app: 'designer', pmv: 'workflow-demos' },
      path: 'dataclasses/form/Data'
    };
    const view = renderHook(() => useCreateEditor());
    expect(
      view.result.current.createEditorFromPath({ app: 'designer', pmv: 'workflow-demos' }, 'dataclasses/form/Data.d.json', 'dataclasses')
    ).to.be.deep.equals(result);
  });
});
