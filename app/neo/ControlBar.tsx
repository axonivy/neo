import {
  Button,
  Flex,
  IvyIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Link, useLocation, useNavigate } from '@remix-run/react';
import IvyLogoSVG from './axonivy.svg?react';
import { Editor, useEditors } from './useEditors';
import { Fragment, useEffect, useRef, useState } from 'react';

const EditorTab = ({ icon, name, id }: Editor) => {
  const active = useLocation().pathname === id;
  return (
    <TabsTrigger
      key={id}
      value={id}
      style={{
        borderBottom: 'none',
        borderInlineEnd: active ? undefined : 'var(--basic-border)',
        fontWeight: 'normal',
        fontSize: '12px',
        background: active ? 'var(--background)' : undefined,
        height: '100%',
        padding: '0 var(--size-3)'
      }}
    >
      <IvyIcon style={{ fontSize: '16px' }} icon={icon} />
      {name}
    </TabsTrigger>
  );
};

const EditorTabs = () => {
  const { editors, closeEditor } = useEditors();
  const scroller = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const openEditor = editors.find(editor => editor.id === pathname);
    setTab(openEditor?.id ?? '');
  }, [editors, pathname]);
  return (
    <Tabs
      ref={scroller}
      value={tab}
      onValueChange={value => navigate(value)}
      style={{ overflowX: 'hidden' }}
      onWheel={event => {
        if (scroller.current) {
          scroller.current.scrollLeft += event.deltaY + event.deltaX;
        }
      }}
    >
      <TabsList style={{ height: '100%' }}>
        {editors.map(editor => (
          <Fragment key={editor.id}>
            <EditorTab {...editor} />
            {editor.id === pathname && (
              <Flex
                alignItems='center'
                style={{
                  height: '100%',
                  background: 'var(--background)',
                  borderInlineEnd: 'var(--basic-border)',
                  paddingInlineEnd: 'var(--size-2)'
                }}
              >
                <Button
                  icon={IvyIcons.Close}
                  onClick={event => {
                    event.stopPropagation();
                    closeEditor(editor.id);
                  }}
                  onKeyDown={e => e.stopPropagation()}
                  aria-label='Close tab'
                />
              </Flex>
            )}
          </Fragment>
        ))}
      </TabsList>
    </Tabs>
  );
};

const EditorsControl = () => {
  const [subMenu, setSubMenu] = useState(false);
  const { editors, closeAllEditors } = useEditors();
  if (editors.length === 0) {
    return null;
  }
  return (
    <Popover open={subMenu} onOpenChange={setSubMenu}>
      <PopoverTrigger asChild>
        <Button icon={IvyIcons.Dots} size='large' />
      </PopoverTrigger>
      <PopoverContent sideOffset={6} collisionPadding={10} side='bottom' align='end' style={{ border: 'var(--basic-border)' }}>
        <Flex direction='column'>
          <Button
            icon={IvyIcons.Close}
            onClick={() => {
              closeAllEditors();
              setSubMenu(false);
            }}
          >
            Close all
          </Button>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};

export const ControlBar = ({ toggleBrowser }: { toggleBrowser: () => void }) => {
  return (
    <Flex style={{ height: '40px', borderBottom: 'var(--basic-border)', background: 'var(--N50)' }}>
      <Flex alignItems='center' gap={4} style={{ paddingInline: 'var(--size-3)', borderInlineEnd: 'var(--basic-border)' }}>
        <Link to='/' prefetch='intent' style={{ all: 'unset' }}>
          <Button size='large' style={{ aspectRatio: 1, padding: 0 }}>
            <IvyLogoSVG />
          </Button>
        </Link>
        <Button icon={IvyIcons.Market} size='large' />
      </Flex>
      <EditorTabs />
      <Flex alignItems='center' gap={1} style={{ paddingInline: 'var(--size-2)', marginInlineStart: 'auto', flex: '0 0 auto' }}>
        <EditorsControl />
        <Separator orientation='vertical' style={{ margin: 'var(--size-2)' }} />
        <Button icon={IvyIcons.Play} size='large' variant='primary' onClick={toggleBrowser}>
          Run process
        </Button>
      </Flex>
    </Flex>
  );
};
