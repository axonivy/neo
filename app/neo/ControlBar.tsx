import { Button, Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useNavigate } from '@remix-run/react';

const EditorTab = ({ icon, name, active }: { icon: IvyIcons; name: string; active?: boolean }) => (
  <Flex
    alignItems='center'
    gap={1}
    style={{
      paddingInline: 'var(--size-4)',
      height: '100%',
      borderInlineEnd: 'var(--basic-border)',
      background: active ? 'var(--background)' : undefined
    }}
  >
    <IvyIcon style={{ fontSize: '16px' }} icon={icon} />
    {name}
    {active && <Button icon={IvyIcons.Close} />}
  </Flex>
);

export const ControlBar = () => {
  const navigate = useNavigate();
  const openEditors = [
    { icon: IvyIcons.Process, name: 'ProductOrderRequest', active: true },
    { icon: IvyIcons.Database, name: 'Data' }
  ];
  return (
    <Flex style={{ height: '40px', borderBottom: 'var(--basic-border)', background: 'var(--N50)' }}>
      <Flex alignItems='center' gap={4} style={{ paddingInline: 'var(--size-4)', borderInlineEnd: 'var(--basic-border)' }}>
        <Button size='large' style={{ aspectRatio: 1, padding: 0 }} onClick={() => navigate('/')}>
          <svg width='25' height='26' viewBox='0 0 25 26' fill='var(--body)'>
            <path d='M13.2034 5.76367L11.1655 5.76369L6.5791 19.5557H7.58433C8.34799 19.5557 8.34816 19.5552 8.58347 18.8126C8.81877 18.07 11.4834 9.7791 11.4834 9.7791C11.7432 8.94014 12.0866 7.24418 12.0866 7.24418H12.2823C12.2823 7.24418 12.6257 8.94015 12.8855 9.7791C12.8855 9.7791 15.5501 18.07 15.7854 18.8126C16.0207 19.5552 16.0209 19.5557 16.7846 19.5557H17.7898L13.2034 5.76367Z' />
          </svg>
        </Button>
        <Button icon={IvyIcons.Market} size='large' />
      </Flex>
      <Flex alignItems='center'>
        {openEditors.map(editor => (
          <EditorTab key={editor.name} {...editor} />
        ))}
      </Flex>
    </Flex>
  );
};
