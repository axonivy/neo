import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  IvyIcon,
  Separator,
  useHotkeys,
  vars
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useKnownHotkeys } from '~/utils/hotkeys';
import type { Editor } from '../editors/editor';
import { useEditors, useRecentlyOpenedEditors } from '../editors/useEditors';
import { ArtifactCard } from './artifact/ArtifactCard';
import { editorTypeToPreview, PreviewSvg } from './artifact/PreviewSvg';
import { OverviewTitle } from './OverviewTitle';

type OverviewRecentlyOpenedProps = {
  filter?: (editor: Editor) => boolean;
};

export const OverviewRecentlyOpened = ({ filter }: OverviewRecentlyOpenedProps) => {
  const { t } = useTranslation();
  const { editors, cleanupRecentlyOpened } = useRecentlyOpenedEditors();
  if (editors.length === 0) {
    return null;
  }
  return (
    <>
      <OverviewTitle title={t('neo.recentlyOpened')}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={IvyIcons.Dots} size='large' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onSelect={cleanupRecentlyOpened}>
              <IvyIcon icon={IvyIcons.Trash} />
              {t('common.label.clearList')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </OverviewTitle>
      <div>
        <Flex gap={4} style={{ overflowX: 'auto' }}>
          {editors.filter(filter ?? (() => true)).map(editor => (
            <RecentlyOpenedCard key={editor.id} editor={editor} />
          ))}
        </Flex>
      </div>
      <Separator style={{ marginBlock: vars.size.s2, flex: '0 0 1px' }} />
    </>
  );
};

const RecentlyOpenedCard = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const { openEditor } = useEditors();
  const { removeRecentlyOpened } = useRecentlyOpenedEditors();
  const hotkeys = useKnownHotkeys();
  const artifactCardRef = useHotkeys<HTMLDivElement>([hotkeys.deleteElement.hotkey], () => removeRecentlyOpened(editor.id), {
    keydown: false,
    keyup: true
  });
  return (
    <ArtifactCard
      ref={artifactCardRef}
      className='recently-opened-card'
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type={editorTypeToPreview(editor.type)} />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      badges={[]}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={IvyIcons.Dots} className='card-menu-trigger' />
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start'>
          <DropdownMenuItem onSelect={() => removeRecentlyOpened(editor.id)}>
            <IvyIcon icon={IvyIcons.Trash} />
            <span>{t('common.label.removeFromList')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ArtifactCard>
  );
};
