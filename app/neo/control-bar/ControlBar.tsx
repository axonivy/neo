import { Button, Flex, useHotkeys } from '@axonivy/ui-components';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { useKnownHotkeys } from '~/utils/hotkeys';
import IvyLogoSVG from '../axonivy.svg?react';

export const ControlBar = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const { openHome } = useKnownHotkeys();
  useHotkeys(openHome.hotkey, () => navigate('/'));
  const { t } = useTranslation();

  return (
    <Flex style={{ height: '40px', borderBottom: 'var(--basic-border)', background: 'var(--N50)' }} className='control-bar'>
      <Flex alignItems='center' gap={4} style={{ paddingInline: 'var(--size-3)', borderInlineEnd: 'var(--basic-border)' }}>
        <Link to='/' prefetch='intent' style={{ all: 'unset' }} aria-label={t('neo.home')} title={t('neo.home')}>
          <Button size='large' style={{ aspectRatio: 1, padding: 0 }} title={openHome.label} aria-label={openHome.label}>
            <IvyLogoSVG />
          </Button>
        </Link>
      </Flex>
      {children}
    </Flex>
  );
};
