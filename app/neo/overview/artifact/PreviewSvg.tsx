import { useTheme } from '@axonivy/ui-components';
import type { EditorType } from '~/neo/editors/editor';
import configDarkSvg from '/assets/preview/configs-dark.svg?url';
import configLightSvg from '/assets/preview/configs-light.svg?url';
import dataClassDarkSvg from '/assets/preview/data-classes-dark.svg?url';
import dataClassLightSvg from '/assets/preview/data-classes-light.svg?url';
import formDarkSvg from '/assets/preview/forms-dark.svg?url';
import formLightSvg from '/assets/preview/forms-light.svg?url';
import processDarkSvg from '/assets/preview/processes-dark.svg?url';
import processLightSvg from '/assets/preview/processes-light.svg?url';
import workspaceDarkSvg from '/assets/preview/workspace-dark.svg?url';
import workspaceLightSvg from '/assets/preview/workspace-light.svg?url';

const previews = {
  dataClass: { dark: dataClassDarkSvg, light: dataClassLightSvg },
  config: { dark: configDarkSvg, light: configLightSvg },
  form: { dark: formDarkSvg, light: formLightSvg },
  process: { dark: processDarkSvg, light: processLightSvg },
  workspace: { dark: workspaceDarkSvg, light: workspaceLightSvg }
} as const;

type PreviewType = keyof typeof previews;

export const editorTypeToPreview = (type: EditorType): PreviewType => {
  switch (type) {
    case 'dataclasses':
      return 'dataClass';
    case 'configurations':
    case 'variables':
    case 'cms':
      return 'config';
    case 'forms':
      return 'form';
    case 'processes':
      return 'process';
  }
};

export const PreviewSvg = ({ type }: { type: PreviewType }) => {
  const { realTheme } = useTheme();
  return <img src={previews[type][realTheme]} alt='Preview' />;
};
