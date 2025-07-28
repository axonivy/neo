import { HotkeysProvider } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { Breadcrumbs } from '../Breadcrumb';
import type { Editor, EditorType } from './editor';

const HotkeysEditor = ({ id, type, name, children }: Editor & { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  const { pmv } = useParams();
  const overviewBreadcrumbItem = useOverviewBreadcrumbItem(type);
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
      <Breadcrumbs
        items={[overviewBreadcrumbItem, { name: pmv ?? '' }, { name }]}
        style={{ borderBottom: 'var(--basic-border)', padding: '4px var(--size-3)' }}
      />
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

const useOverviewBreadcrumbItem = (type: EditorType) => {
  const { t } = useTranslation();
  const { ws } = useParams();
  switch (type) {
    case 'processes':
      return { name: t('neo.processes'), href: `${ws}/${type}` };
    case 'forms':
      return { name: t('neo.forms'), href: `${ws}/${type}` };
    case 'cms':
    case 'variables':
    case 'configurations':
      return { name: t('neo.configs'), href: `${ws}/configurations` };
    case 'dataclasses':
      return { name: t('neo.dataClasses'), href: `${ws}/${type}` };
  }
};
