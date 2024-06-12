import { Flex, IvyIcon } from '@axonivy/ui-components';
import { EditorType, editorId, useEditors } from '../useEditors';
import { IvyIcons } from '@axonivy/ui-icons';
import ProcessPreviewSVG from './process-preview.svg?react';
import FormPreviewSVG from './form-preview.svg?react';
import { LinksFunction } from '@remix-run/node';
import cardStyles from './card.css?url';

export const cardLinks: LinksFunction = () => [{ rel: 'stylesheet', href: cardStyles }];

type Card = { name: string; app: string; pmv: string; path: string; editorType: EditorType };

const icon = (editorType: EditorType) => {
  if (editorType === 'forms') {
    return IvyIcons.File;
  }
  return IvyIcons.Process;
};

const cardPreview = (editorType: EditorType) => {
  if (editorType === 'forms') {
    return <FormPreviewSVG className='card-preview' />;
  }
  return <ProcessPreviewSVG className='card-preview' />;
};

export const ProjectArtifactCard = ({ name, app, pmv, path, editorType }: Card) => {
  const { openEditor } = useEditors();
  const id = editorId(editorType, app, pmv, path);
  return (
    <Flex
      direction='column'
      justifyContent='space-between'
      gap={2}
      style={{ background: 'var(--N75)', padding: 'var(--size-2)', borderRadius: 10, height: 150, flex: '0 1 200px' }}
      onClick={() => openEditor({ id, type: editorType, icon: icon(editorType), name, app, pmv, path })}
    >
      <div style={{ background: 'var(--background)', borderRadius: 8, flex: '1 0 auto' }}>{cardPreview(editorType)}</div>
      <Flex alignItems='center' justifyContent='space-between' gap={1}>
        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 'calc(200px - var(--size-1) - 12px)' }}>{name}</span>
        <IvyIcon icon={IvyIcons.ArrowRight} />
      </Flex>
    </Flex>
  );
};
