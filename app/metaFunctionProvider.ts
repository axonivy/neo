import type { MetaFunction } from 'react-router';
import { NEO_DESIGNER } from './constants';

export const editorMetaFunctionProvider = (content: string) => {
  const meta: MetaFunction = ({ location, params }) => {
    const fileName = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
    return [{ title: `${fileName} - ${params.pmv} - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content }];
  };
  return meta;
};

type OverviewTypes = 'Processes' | 'Forms' | 'Configurations' | 'Data Classes';

export const overviewMetaFunctionProvider = (type: OverviewTypes) => {
  const meta: MetaFunction = ({ params }) => {
    return [{ title: `${type} - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content: `Axon Ivy ${type} Overview` }];
  };
  return meta;
};
