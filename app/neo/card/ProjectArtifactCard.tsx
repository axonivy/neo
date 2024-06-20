import { Button, Flex, IvyIcon, Popover, PopoverContent, PopoverTrigger } from '@axonivy/ui-components';
import { EditorType, editorIcon, editorId, useEditors } from '../useEditors';
import { IvyIcons } from '@axonivy/ui-icons';
import ProcessPreviewSVG from './process-preview.svg?react';
import FormPreviewSVG from './form-preview.svg?react';
import { LinksFunction } from '@remix-run/node';
import cardStyles from './card.css?url';
import { ProjectIdentifier } from '~/data/project-api';

export const cardLinks: LinksFunction = () => [{ rel: 'stylesheet', href: cardStyles }];

type Card = { name: string; project: ProjectIdentifier; path: string; editorType: EditorType; actions?: { delete?: () => void } };

const cardPreview = (editorType: EditorType) => {
  if (editorType === 'forms') {
    return <FormPreviewSVG className='card-preview' />;
  }
  return <ProcessPreviewSVG className='card-preview' />;
};

export const ProjectArtifactCard = ({ name, project, path, editorType, actions }: Card) => {
  const { openEditor, removeEditor } = useEditors();
  const id = editorId(editorType, project, path);
  const open = () => openEditor({ id, type: editorType, icon: editorIcon(editorType), name, project, path });
  return (
    <Flex
      role='group'
      tabIndex={0}
      direction='column'
      justifyContent='space-between'
      gap={2}
      style={{ background: 'var(--N75)', padding: 'var(--size-2)', borderRadius: 10, height: 150, flex: '0 1 200px', cursor: 'pointer' }}
      onClick={open}
      onKeyDown={e => e.key === 'Enter' && open()}
    >
      <div style={{ background: 'var(--background)', borderRadius: 8, flex: '1 0 auto' }}>{cardPreview(editorType)}</div>
      <Flex alignItems='center' justifyContent='space-between' gap={1}>
        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 'calc(200px - var(--size-1) - 12px)' }}>{name}</span>
        {actions ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button icon={IvyIcons.Dots} onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} />
            </PopoverTrigger>
            <PopoverContent side='bottom' align='start' style={{ border: 'var(--basic-border)' }}>
              <Flex direction='column' alignItems='center' gap={2}>
                {actions.delete && (
                  <Button
                    icon={IvyIcons.Trash}
                    style={{ color: 'var(--error-color)' }}
                    onClick={e => {
                      e.stopPropagation();
                      removeEditor(id);
                      actions.delete!();
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Flex>
            </PopoverContent>
          </Popover>
        ) : (
          <IvyIcon icon={IvyIcons.ArrowRight} />
        )}
      </Flex>
    </Flex>
  );
};
