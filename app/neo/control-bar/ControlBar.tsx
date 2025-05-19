import { Button, Flex, useHotkeys } from '@axonivy/ui-components';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { useKnownHotkeys } from '~/utils/hotkeys';

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
            <AxonIvyLogo />
          </Button>
        </Link>
      </Flex>
      {children}
    </Flex>
  );
};

const AxonIvyLogo = () => (
  <svg width='25' height='26' viewBox='0 0 25 26' xmlns='http://www.w3.org/2000/svg' fill='var(--body)'>
    <path d='M13.2034 5.76367L11.1655 5.76369L6.5791 19.5557H7.58433C8.34799 19.5557 8.34816 19.5552 8.58347 18.8126C8.81877 18.07 11.4834 9.7791 11.4834 9.7791C11.7432 8.94014 12.0866 7.24418 12.0866 7.24418H12.2823C12.2823 7.24418 12.6257 8.94015 12.8855 9.7791C12.8855 9.7791 15.5501 18.07 15.7854 18.8126C16.0207 19.5552 16.0209 19.5557 16.7846 19.5557H17.7898L13.2034 5.76367Z' />
  </svg>
);
