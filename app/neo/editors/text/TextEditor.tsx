import { Textarea } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useReadConfiguration } from '~/data/config-api';
import type { Editor } from '../editor';

export const TextEditor = ({ id, project, name, path }: Editor) => {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === id) {
      setMounted(true);
    }
  }, [pathname, id]);

  const { data } = useReadConfiguration({ app: project.app, pmv: project.pmv, path });
  return (
    <>
      {mounted && (
        <div data-editor-name={name} className='text-editor' style={{ display: pathname !== id ? 'none' : undefined, height: '100%' }}>
          <Textarea onChange={e => console.log(e.target.value)} style={{ height: '100%' }} value={data ?? ''} />
        </div>
      )}
    </>
  );
};
