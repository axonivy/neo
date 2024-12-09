import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import type { Editor } from './editor';

export const MountedEditor = ({ id, type, name, children }: Editor & { children: React.ReactNode }) => {
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
