import { Button, Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';

export const WebBrowser = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  return (
    <Flex direction='column' gap={1} style={{ height: '100%' }}>
      <Flex
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        gap={1}
        style={{ height: '30px', paddingInline: 'var(--size-2)' }}
      >
        <Flex alignItems='center' gap={1}>
          <IvyIcon icon={IvyIcons.WsStart} />
          Web Browser
        </Flex>
        <Flex alignItems='center' gap={1}>
          <Button icon={IvyIcons.ArrowRight} rotate={180} title='Back' onClick={() => frameRef.current?.contentWindow?.history.back()} />
          <Button icon={IvyIcons.ArrowRight} title='Forward' onClick={() => frameRef.current?.contentWindow?.history.forward()} />
          <Button icon={IvyIcons.Redo} title='Redo' onClick={() => frameRef.current?.contentWindow?.location.reload()} />
          <Button
            icon={IvyIcons.Home}
            title='Home'
            onClick={() => {
              if (frameRef.current?.contentWindow) {
                frameRef.current.contentWindow.location = '/dev-workflow-ui/faces/home.xhtml';
              }
            }}
          />
          <Button
            icon={IvyIcons.ExitEnd}
            title='Open in new tab'
            onClick={() => window.open(frameRef.current?.contentWindow?.location.href)}
          />
        </Flex>
      </Flex>
      <iframe
        ref={frameRef}
        src='/dev-workflow-ui/faces/home.xhtml'
        title='Dev Browser'
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </Flex>
  );
};
