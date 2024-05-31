import { Button, Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useLocation, useNavigate } from '@remix-run/react';
import IvyLogoSVG from './axonivy.svg?react';
import { Editor, useEditors } from './useEditors';

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
      {active && <Button icon={IvyIcons.Close} onClick={() => closeEditor(id)} />}
    </Flex>
  );
};
export const ControlBar = () => {
  const navigate = useNavigate();
  const { editors } = useEditors();
  return (
    <Flex style={{ height: '40px', borderBottom: 'var(--basic-border)', background: 'var(--N50)' }}>
      <Flex alignItems='center' gap={4} style={{ paddingInline: 'var(--size-4)', borderInlineEnd: 'var(--basic-border)' }}>
        <Button size='large' style={{ aspectRatio: 1, padding: 0 }} onClick={() => navigate('/')}>
          <IvyLogoSVG />
        </Button>
        <Button icon={IvyIcons.Market} size='large' />
      </Flex>
      <Flex alignItems='center'>
        {Array.from(editors.values()).map(editor => (
          <EditorTab key={editor.id} {...editor} />
        ))}
      </Flex>
    </Flex>
  );
};
