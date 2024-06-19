import { Button, Flex, IvyIcon, Popover, PopoverContent, PopoverTrigger, Separator } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Link, useLocation, useNavigate } from '@remix-run/react';
import IvyLogoSVG from './axonivy.svg?react';
import { Editor, useEditors } from './useEditors';
import { useRef, useState } from 'react';

const EditorTab = ({ icon, name, id }: Editor) => {
  const { closeEditor } = useEditors();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = id === pathname;
  return (
    <Flex
      alignItems='center'
      gap={1}
      style={{
        paddingInline: 'var(--size-4)',
        height: '100%',
        borderInlineEnd: 'var(--basic-border)',
        background: active ? 'var(--background)' : undefined,
        cursor: 'pointer'
      }}
      onClick={() => navigate(id)}
    >
      <IvyIcon style={{ fontSize: '16px' }} icon={icon} />
      {name}
      {active && (
        <Button
          icon={IvyIcons.Close}
          onClick={event => {
            event.stopPropagation();
            closeEditor(id);
          }}
        />
      )}
    </Flex>
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
  const { editors } = useEditors();
  const scroller = useRef<HTMLDivElement>(null);
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
      <Flex
        ref={scroller}
        alignItems='center'
        style={{ overflowX: 'hidden' }}
        onWheel={event => {
          if (scroller.current) {
            scroller.current.scrollLeft += event.deltaY;
          }
        }}
      >
        {editors.map(editor => (
          <EditorTab key={editor.id} {...editor} />
        ))}
      </Flex>
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
