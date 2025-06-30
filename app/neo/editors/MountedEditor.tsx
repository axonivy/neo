import { HotkeysProvider } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import type { Editor } from './editor';

const HotkeysEditor = ({ id, type, name, children }: Editor & { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === id) {
      setMounted(true);
    }
  }, [pathname, id]);
  if (!mounted) {
    return null;
  }
  return (
    <div
      data-editor-name={name}
      data-editor-type={type}
      className='editor'
      style={{ height: '100%', display: pathname !== id ? 'none' : undefined }}
    >
      {children}
    </div>
  );
};

export const MountedEditor = (props: Editor & { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  if (pathname !== props.id) {
    return (
      <HotkeysProvider initiallyActiveScopes={['none']}>
        <HotkeysEditor {...props} />
      </HotkeysProvider>
    );
  }

  return <HotkeysEditor {...props} />;
};
