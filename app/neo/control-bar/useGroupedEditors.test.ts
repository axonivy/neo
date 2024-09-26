import { renderHook } from '@testing-library/react';
import { Mock } from 'vitest';
import { Editor, useEditors } from '../editors/useEditors';
import { useGroupedEditors } from './useGroupedEditors';

vi.mock('../editors/useEditors', async importOriginal => {
  const editorsFn = vi.fn();
  return {
    ...(await importOriginal<typeof import('@remix-run/react')>()),
    useEditors: editorsFn
  };
});

const editorsFn = useEditors as unknown as Mock;

const proc: Partial<Editor> = { type: 'processes', path: 'processes/jump' };
const data: Partial<Editor> = { type: 'dataclasses', path: 'dataclasses/form/test/project/Address' };
const form: Partial<Editor> = { type: 'forms', path: 'src_hd/workflow/humantask/form/form' };
const formProc: Partial<Editor> = { type: 'processes', path: 'src_hd/workflow/humantask/form/formProcess' };
const formData: Partial<Editor> = { type: 'dataclasses', path: 'src_hd/workflow/humantask/form/formData' };
const form2: Partial<Editor> = { type: 'forms', path: 'src_hd/form/test/project/test/test' };
const form2Proc: Partial<Editor> = { type: 'processes', path: 'src_hd/form/test/project/test/testProcess' };
const form2Data: Partial<Editor> = { type: 'dataclasses', path: 'src_hd/form/test/project/test/testData' };

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
  expect(view.result.current[proc.path!]).toEqual([proc]);
  expect(view.result.current[data.path!]).toEqual([data]);
  expect(view.result.current[form.path!]).toEqual([form, formProc, formData]);
  expect(view.result.current[form2.path!]).toEqual([form2Proc, form2Data]);
});
