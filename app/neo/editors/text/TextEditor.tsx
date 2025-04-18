import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReadConfiguration, useWriteConfiguration } from '~/data/config-api';
import { useThemeMode } from '~/theme/useUpdateTheme';
import type { Editor } from '../editor';

function debouncedAction<T>(action: (input: T) => void, timeout: number) {
  let timer: NodeJS.Timeout;
  return (input: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      action(input);
    }, timeout);
  };
}

export const TextEditor = ({ project, path }: Editor) => {
  const { t } = useTranslation();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { data } = useReadConfiguration({ app: project.app, pmv: project.pmv, path });
  const { writeConfig } = useWriteConfiguration();
  const theme = useThemeMode();
  if (!data) {
    return null;
  }
  const debouncedWrite = debouncedAction((content: string) => writeConfig({ ...data, content }), 1000);
  const setupMonaco = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const codeEditor = (frameRef.current?.contentWindow as any).codeEditor;
    if (data && codeEditor) {
      codeEditor.updateOptions({ readOnly: project.isIar });
      const model = codeEditor._modelData.model;
      model.setValue(data.content);
      model.setLanguage(path.slice(path.lastIndexOf('.') + 1));
      model.onDidChangeContent(() => debouncedWrite(model.getValue()));
    }
  };
  return (
    <iframe
      id='framed-monaco-editor'
      onLoad={setupMonaco}
      ref={frameRef}
      style={{ width: '100%', height: '100%', border: 0 }}
      title={t('neo.monaco')}
      src={`/monaco-yaml-ivy/index.html?demo=off&theme=${theme}`}
    ></iframe>
  );
};
