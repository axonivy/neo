import { useMemo } from 'react';
import { Editor, useEditors } from '../editors/useEditors';

export const useGroupedEditors = () => {
  const { editors } = useEditors();
  return useMemo(() => groupEditors(editors), [editors]);
};

const groupEditors = (editors: Array<Editor>): Record<string, Array<Editor>> => {
  return editors.reduce<Record<string, Array<Editor>>>(
    (prev, curr) => {
      const groupKey = groupEditorPath(curr.path);
      const group = prev[groupKey] || [];
      group.push(curr);
      group.sort(editorSort);
      return { ...prev, [groupKey]: group };
    },
    {} as Record<string, Array<Editor>>
  );
};

const editorSort = (a: Editor, b: Editor) => {
  if (a.type === b.type) return 0;
  if (a.type === 'forms' || b.type === 'dataclasses') return -1;
  if (a.type === 'dataclasses' || b.type === 'forms') return 1;
  return 0;
};

const groupEditorPath = (path: string) => {
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
