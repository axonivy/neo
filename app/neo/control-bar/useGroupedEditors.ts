import { groupBy } from '@axonivy/ui-components';
import { useMemo } from 'react';
import type { Editor } from '~/neo/editors/editor';
import { useEditors } from '~/neo/editors/useEditors';
import { removeStartSegmets } from '~/utils/path';

export const useGroupedEditors = () => {
  const { editors } = useEditors();
  return useMemo(() => groupEditors(editors), [editors]);
};

const groupEditors = (editors: Array<Editor>): Record<string, Array<Editor>> => {
  const groups = groupBy(editors, groupEditorPath);
  Object.values(groups).forEach(group => group.sort(editorSort));
  return groups;
};

const editorSort = (a: Editor, b: Editor) => {
  if (a.type === b.type) return 0;
  if (a.type === 'forms' || b.type === 'dataclasses') return -1;
  if (a.type === 'dataclasses' || b.type === 'forms') return 1;
  return 0;
};

const groupEditorPath = ({ id }: Editor) => {
  const path = removeStartSegmets(id, 2);
  if (!path.includes('src_hd')) {
    return path;
  }
  if (path.endsWith('Data')) {
    return path.substring(0, path.lastIndexOf('Data'));
  }
  if (path.endsWith('Process')) {
    return path.substring(0, path.lastIndexOf('Process'));
  }
  return path;
};
