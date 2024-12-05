import { Textarea } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useReadConfiguration, useWriteConfiguration } from '~/data/config-api';
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
  const { writeConfig } = useWriteConfiguration();
  return (
    <>
      {mounted && data && (
        <div data-editor-name={name} className='text-editor' style={{ display: pathname !== id ? 'none' : undefined, height: '100%' }}>
          <Textarea
            readOnly={project.isIar ?? false}
            onChange={e => writeConfig({ id: data.id, content: e.target.value })}
            style={{ height: '100%' }}
            value={data.content}
          />
        </div>
      )}
    </>
  );
};
