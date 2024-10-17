import { Button, Flex, IvyIcon, Tabs, TabsList, TabsTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useLocation, useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { lastSegment } from '~/utils/path';
import type { Editor } from '../editors/editor';
import { useEditors } from '../editors/useEditors';
import './EditorTabs.css';
import { useGroupedEditors } from './useGroupedEditors';

export const EditorTabs = () => {
  const scroller = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState('');
  const { pathname } = useLocation();
  useEffect(() => setTab(pathname), [pathname]);
  const groupedEditors = useGroupedEditors();
  const navigate = useNavigate();
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
        {Object.entries(groupedEditors).map(([group, editors]) => (
          <EditorsTab key={group} group={group} editors={editors} />
        ))}
      </TabsList>
    </Tabs>
  );
};

const EditorsTab = ({ group, editors }: { group: string; editors: Array<Editor> }) => {
  if (editors.length === 0) {
    return null;
  }
  const name = editors.length > 1 ? lastSegment(group) : editors[0].name;
  return (
    <Flex className='editor-tab-wrapper' alignItems='center' gap={1}>
      <TabsTrigger value={editors[0].id} title={editors[0].path} className='editor-tab' aria-label={name}>
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
  return (
    <Flex alignItems='center' className='editor-tab-close'>
      <Button
        icon={IvyIcons.Close}
        onClick={event => {
          event.stopPropagation();
          closeEditors(ids);
        }}
        onKeyDown={e => e.stopPropagation()}
        aria-label='Close tab'
      />
    </Flex>
  );
};
