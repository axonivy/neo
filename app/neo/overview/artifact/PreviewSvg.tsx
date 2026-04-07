import { useTheme } from '@axonivy/ui-components';
import type { EditorType } from '~/neo/editors/editor';
import { noUnknownType } from '~/utils/no-unknown';

const previewAssetUrl = (fileName: string) => `${import.meta.env.BASE_URL}assets/preview/${fileName}`;

const previews = {
  dataClass: {
    dark: previewAssetUrl('data-classes-dark.svg'),
    light: previewAssetUrl('data-classes-light.svg')
  },
  config: { dark: previewAssetUrl('configs-dark.svg'), light: previewAssetUrl('configs-light.svg') },
  form: { dark: previewAssetUrl('forms-dark.svg'), light: previewAssetUrl('forms-light.svg') },
  process: { dark: previewAssetUrl('processes-dark.svg'), light: previewAssetUrl('processes-light.svg') },
  casemap: { dark: previewAssetUrl('casemap-dark.svg'), light: previewAssetUrl('casemap-light.svg') },
  workspace: { dark: previewAssetUrl('workspace-dark.svg'), light: previewAssetUrl('workspace-light.svg') }
} as const;

type PreviewType = keyof typeof previews;

export const editorTypeToPreview = (type: EditorType): PreviewType => {
  switch (type) {
    case 'dataclasses':
      return 'dataClass';
    case 'variables':
    case 'roles':
    case 'users':
    case 'persistence':
    case 'restclients':
    case 'webservices':
    case 'databases':
    case 'cms':
      return 'config';
    case 'casemaps':
      return 'casemap';
    case 'forms':
      return 'form';
    case 'processes':
      return 'process';
    default:
      noUnknownType(type);
      return 'workspace';
  }
};

export const PreviewSvg = ({ type }: { type: PreviewType }) => {
  const { realTheme } = useTheme();
  return <img src={previews[type][realTheme]} alt='Preview' />;
};
