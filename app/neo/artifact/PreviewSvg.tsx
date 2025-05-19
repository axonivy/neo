import { useTheme } from '@axonivy/ui-components';
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

export const PreviewSvg = ({ type }: { type: keyof typeof previews }) => {
  const { realTheme } = useTheme();
  return <img src={previews[type][realTheme]} alt='Preview' />;
};
