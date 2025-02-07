import { Button, Flex, IvyIcon, Tabs, TabsList, TabsTrigger, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useKnownHotkeys } from '~/utils/hotkeys';
import { lastSegment } from '~/utils/path';
import type { Editor } from '../editors/editor';
import { useEditors } from '../editors/useEditors';
import './EditorTabs.css';
import { useGroupedEditors } from './useGroupedEditors';

export const EditorTabs = () => {
  const scroller = useRef<HTMLDivElement>(null);
  const firstTabRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState('');
  const { pathname } = useLocation();

  useEffect(() => setTab(pathname), [pathname]);
  const groupedEditors = useGroupedEditors();
  const navigate = useNavigate();
  const { focusTabs } = useKnownHotkeys();
  useHotkeys(focusTabs.hotkey, () => firstTabRef.current?.focus(), { enableOnFormTags: true });

  return (
    <Tabs
      ref={scroller}
      value={tab}
      onValueChange={value => navigate(value)}
      className='editor-tabs'
      onWheel={event => {
        if (scroller.current) {
          scroller.current.scrollLeft += event.deltaY + event.deltaX;
        }
      }}
    >
      <TabsList>
        {Object.entries(groupedEditors).map(([group, editors], index) => (
          <EditorsTab key={group} group={group} editors={editors} firstTabRef={index === 0 ? firstTabRef : undefined} />
        ))}
      </TabsList>
    </Tabs>
  );
};

const EditorsTab = ({
  group,
  editors,
  firstTabRef
}: {
  group: string;
  editors: Array<Editor>;
  firstTabRef?: React.RefObject<HTMLButtonElement>;
}) => {
  const { pathname } = useLocation();
  const { closeEditors } = useEditors();

  const { closeActiveTabs } = useKnownHotkeys();
  useHotkeys(closeActiveTabs.hotkey, () => {
    if (pathname.endsWith(group)) {
      closeEditors(editors.map(e => e.id));
    }
  });

  if (editors.length === 0) {
    return null;
  }
  const name = editors.length > 1 ? lastSegment(group) : editors[0].name;

  return (
    <Flex className='editor-tab-wrapper' alignItems='center' gap={1}>
      <TabsTrigger value={editors[0].id} title={editors[0].path} className='editor-tab' aria-label={name} ref={firstTabRef}>
        <IvyIcon className='editor-tab-icon' icon={editors[0].icon} />
        {name}
      </TabsTrigger>
      {editors.slice(1).map(({ id, path, icon, name }) => (
        <EditorSubTab key={id} icon={icon} path={path} id={id} name={name} />
      ))}
      <EditorTabClose ids={editors.map(e => e.id)} />
    </Flex>
  );
};

const EditorSubTab = ({ icon, path, id, name }: Pick<Editor, 'icon' | 'path' | 'id' | 'name'>) => (
  <TabsTrigger value={id} title={path} className='editor-tab editor-sub-tab' aria-label={name}>
    <IvyIcon className='editor-tab-icon' icon={icon} />
  </TabsTrigger>
);

const EditorTabClose = ({ ids }: { ids: Array<string> }) => {
  const { closeEditors } = useEditors();
  const { closeActiveTabs } = useKnownHotkeys();
  return (
    <Flex alignItems='center' className='editor-tab-close'>
      <Button
        icon={IvyIcons.Close}
        onClick={event => {
          event.stopPropagation();
          closeEditors(ids);
        }}
        onKeyDown={e => e.stopPropagation()}
        aria-label={closeActiveTabs.label}
        title={closeActiveTabs.label}
      />
    </Flex>
  );
};
