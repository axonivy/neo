import type { MetaFunction } from '@remix-run/node';
import { editorMetaFunctionProvider } from '~/metaFunctionProvider';
import { useRestoreEditor } from '~/neo/editors/useRestoreEditor';

export const meta: MetaFunction = editorMetaFunctionProvider('Axon Ivy Process Editor');

export default function Index() {
  useRestoreEditor('processes');
  return <></>;
}
