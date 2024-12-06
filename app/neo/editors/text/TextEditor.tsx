import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useReadConfiguration, useWriteConfiguration } from '~/data/config-api';
import { useThemeMode } from '~/theme/useUpdateTheme';
import type { Editor } from '../editor';

export const TextEditor = ({ id, project, name, path }: Editor) => {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === id) {
      setMounted(true);
    }
  }, [pathname, id]);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { data } = useReadConfiguration({ app: project.app, pmv: project.pmv, path });
  const { writeConfig } = useWriteConfiguration();
  const debounce = (action: (content: string) => void, timeout: number) => {
    let timer: NodeJS.Timeout;
    return (content: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        action(content);
      }, timeout);
    };
  };
  const debouncedWrite = debounce((content: string) => writeConfig({ ...data!, content }), 1000);
  const theme = useThemeMode();
  const setupMonaco = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const codeEditor = (frameRef.current?.contentWindow as any).codeEditor;
    if (data && codeEditor) {
      codeEditor.updateOptions({ readOnly: project.isIar || path.endsWith('pom.xml') });
      const model = codeEditor._modelData.model;
      model.setValue(data.content);
      model.setLanguage(path.slice(path.lastIndexOf('.') + 1));
      model.onDidChangeContent(() => debouncedWrite(model.getValue()));
    }
  };

  return (
    <>
      {mounted && data && (
        <div data-editor-name={name} className='text-editor' style={{ display: pathname !== id ? 'none' : undefined, height: '100%' }}>
          <iframe
            id='framed-monaco-editor'
            onLoad={setupMonaco}
            ref={frameRef}
            style={{ width: '100%', height: '100%', border: 0 }}
            title='Monaco Editor'
            src={`/monaco-yaml-ivy/index.html?demo=off&theme=${theme}`}
          ></iframe>
        </div>
      )}
    </>
  );
};
