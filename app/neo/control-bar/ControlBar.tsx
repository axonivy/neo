import { Button, Flex } from '@axonivy/ui-components';
import { Link } from '@remix-run/react';
import type { ReactNode } from 'react';
import IvyLogoSVG from '../axonivy.svg?react';

export const ControlBar = ({ children }: { children?: ReactNode }) => (
  <Flex style={{ height: '40px', borderBottom: 'var(--basic-border)', background: 'var(--N50)' }} className='control-bar'>
    <Flex alignItems='center' gap={4} style={{ paddingInline: 'var(--size-3)', borderInlineEnd: 'var(--basic-border)' }}>
      <Link to='/' prefetch='intent' style={{ all: 'unset' }}>
        <Button size='large' style={{ aspectRatio: 1, padding: 0 }}>
          <IvyLogoSVG />
        </Button>
      </Link>
    </Flex>
    {children}
  </Flex>
);
