import { renderHook } from '@testing-library/react';
import type { Mock } from 'vitest';
import type { Editor } from '~/neo/editors/editor';
import { useEditors } from '~/neo/editors/useEditors';
import { useGroupedEditors } from './useGroupedEditors';

vi.mock('~/neo/editors/useEditors', async importOriginal => {
  const editorsFn = vi.fn();
  return {
    ...(await importOriginal<typeof import('react-router')>()),
    useEditors: editorsFn
  };
});

const editorsFn = useEditors as unknown as Mock;

const projectId = '/designer/configurations/designer/neo-test-project/';
const otherProjectId = '/designer/configurations/designer/form-test-project/';

const proc: Partial<Editor> = { type: 'processes', id: `${projectId}processes/jump` };
const data: Partial<Editor> = { type: 'dataclasses', id: `${projectId}dataclasses/form/test/project/Address` };
const form: Partial<Editor> = { type: 'forms', id: `${projectId}src_hd/workflow/humantask/form/form` };
const formProc: Partial<Editor> = { type: 'processes', id: `${projectId}src_hd/workflow/humantask/form/formProcess` };
const formData: Partial<Editor> = { type: 'dataclasses', id: `${projectId}src_hd/workflow/humantask/form/formData` };
const form2Proc: Partial<Editor> = { type: 'processes', id: `${projectId}src_hd/form/test/project/test/testProcess` };
const form2Data: Partial<Editor> = { type: 'dataclasses', id: `${projectId}src_hd/form/test/project/test/testData` };

test('empty', () => {
  editorsFn.mockImplementation(() => ({ editors: [] }) as unknown as ReturnType<typeof useEditors>);
  const view = renderHook(() => useGroupedEditors());
  expect(view.result.current).toEqual({});
});

test('group hd editors', () => {
  editorsFn.mockImplementation(
    () => ({ editors: [proc, form2Data, formProc, form, formData, data, form2Proc] }) as unknown as ReturnType<typeof useEditors>
  );
  const view = renderHook(() => useGroupedEditors());
  expect(Object.keys(view.result.current)).toHaveLength(4);
  expect(view.result.current['designer/neo-test-project/processes/jump']).toEqual([proc]);
  expect(view.result.current['designer/neo-test-project/dataclasses/form/test/project/Address']).toEqual([data]);
  expect(view.result.current['designer/neo-test-project/src_hd/workflow/humantask/form/form']).toEqual([form, formProc, formData]);
  expect(view.result.current['designer/neo-test-project/src_hd/form/test/project/test/test']).toEqual([form2Proc, form2Data]);
});

const config: Partial<Editor> = { type: 'configurations', id: `${projectId}variables` };
const config2: Partial<Editor> = { type: 'configurations', id: `${otherProjectId}variables` };

test('do not group config editors', () => {
  editorsFn.mockImplementation(() => ({ editors: [config, config2] }) as unknown as ReturnType<typeof useEditors>);
  const view = renderHook(() => useGroupedEditors());
  expect(Object.keys(view.result.current)).toHaveLength(2);
});

const form3: Partial<Editor> = { type: 'forms', id: `${otherProjectId}src_hd/workflow/humantask/form/form` };

test('do not group hd editors from different projects', () => {
  editorsFn.mockImplementation(() => ({ editors: [form, form3] }) as unknown as ReturnType<typeof useEditors>);
  const view = renderHook(() => useGroupedEditors());
  expect(Object.keys(view.result.current)).toHaveLength(2);
});
