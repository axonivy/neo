import { Button, Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useLocation, useNavigate } from '@remix-run/react';
import IvyLogoSVG from './axonivy.svg?react';
import { Editor, useEditors } from './useEditors';
import { useRef } from 'react';

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
export const ControlBar = ({ toggleBrowser }: { toggleBrowser: () => void }) => {
  const navigate = useNavigate();
  const { editors } = useEditors();
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <Flex style={{ height: '40px', borderBottom: 'var(--basic-border)', background: 'var(--N50)' }}>
      <Flex alignItems='center' gap={4} style={{ paddingInline: 'var(--size-4)', borderInlineEnd: 'var(--basic-border)' }}>
        <Button size='large' style={{ aspectRatio: 1, padding: 0 }} onClick={() => navigate('/')}>
          <IvyLogoSVG />
        </Button>
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
      <Flex alignItems='center' gap={1} style={{ paddingInline: 'var(--size-4)', marginInlineStart: 'auto', flex: '0 0 auto' }}>
        <Button icon={IvyIcons.Play} size='large' variant='primary' onClick={toggleBrowser}>
          Run process
        </Button>
      </Flex>
    </Flex>
  );
};
