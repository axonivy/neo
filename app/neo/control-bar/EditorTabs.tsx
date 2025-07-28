import {
  Button,
  cn,
  Flex,
  IvyIcon,
  Tabs,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
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
  useHotkeys(focusTabs.hotkey, () => firstTabRef.current?.focus(), { enableOnFormTags: true, scopes: ['neo'] });

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
  firstTabRef?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const { pathname } = useLocation();
  const { closeEditors } = useEditors();

  const { closeActiveTabs } = useKnownHotkeys();
  useHotkeys(
    closeActiveTabs.hotkey,
    () => {
      if (pathname.endsWith(group)) {
        closeEditors(editors.map(e => e.id));
      }
    },
    { scopes: ['neo'] }
  );

  if (editors.length === 0) {
    return null;
  }
  const name = editors.length > 1 ? lastSegment(group) : editors[0].name;

  return (
    <Flex className='editor-tab-wrapper' alignItems='center' gap={1}>
      <EditorTrigger {...editors[0]} ref={firstTabRef}>
        <IvyIcon className='editor-tab-icon' icon={editors[0].icon} />
        <span>{name}</span>
        <span className='editor-tab-hint'>{`- ${editors[0].project.pmv}`}</span>
      </EditorTrigger>
      {editors.slice(1).map(editor => (
        <EditorSubTab key={editor.id} {...editor} />
      ))}
      <EditorTabClose ids={editors.map(e => e.id)} />
    </Flex>
  );
};

const EditorSubTab = (props: Editor) => (
  <EditorTrigger className='editor-sub-tab' {...props}>
    <IvyIcon className='editor-tab-icon' icon={props.icon} />
  </EditorTrigger>
);

type EditorTriggerProps = Editor & Pick<ComponentProps<typeof TabsTrigger>, 'ref' | 'className' | 'children'>;

const EditorTrigger = ({ id, path, name, project, className, children, ref }: EditorTriggerProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Flex className='editor-tab-root' alignItems='center'>
          <TabsTrigger ref={ref} value={id} className={cn('editor-tab', className)} aria-label={name}>
            {children}
          </TabsTrigger>
        </Flex>
      </TooltipTrigger>
      <TooltipContent align='start'>
        <div>{project.pmv}</div>
        <div>{path}</div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
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
