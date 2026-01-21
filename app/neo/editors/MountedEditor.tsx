import { Flex, HotkeysProvider, useHotkeysContext } from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { Breadcrumbs } from '~/neo/navigation/Breadcrumb';
import type { Editor, EditorType } from './editor';

const HotkeysEditor = ({ id, type, name, children }: Editor & { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const overviewBreadcrumbItem = useOverviewBreadcrumbItem(type);
  const { enableScope, disableScope } = useHotkeysContext();
  if (!mounted && pathname === id) {
    setMounted(true);
  }
  if (active && pathname !== id) {
    setActive(false);
    disableScope('global');
  }
  if (!active && pathname === id) {
    setActive(true);
    enableScope('global');
  }

  if (!mounted) {
    return null;
  }
  return (
    <Flex
      data-editor-name={name}
      data-editor-type={type}
      className='editor'
      direction='column'
      style={{ height: '100%', display: pathname !== id ? 'none' : undefined }}
    >
      <Breadcrumbs
        items={[...overviewBreadcrumbItem, { name }]}
        style={{ borderBottom: 'var(--basic-border)', padding: '4px var(--size-3)' }}
      />
      {children}
    </Flex>
  );
};

export const MountedEditor = (props: Editor & { children: React.ReactNode }) => (
  <HotkeysProvider initiallyActiveScopes={['none']}>
    <HotkeysEditor {...props} />
  </HotkeysProvider>
);

const useOverviewBreadcrumbItem = (type: EditorType) => {
  const { ws, pmv } = useParams();
  const name = useTypeName(type);
  const href = `${ws}/${typeToPath(type)}`;
  const pmvItem = pmv ? { name: pmv, href: `${href}?p=${pmv}` } : { name: '' };
  return [{ name, href }, pmvItem];
};

const useTypeName = (type: EditorType) => {
  const { t } = useTranslation();
  switch (type) {
    case 'processes':
      return t('neo.processes');
    case 'forms':
      return t('neo.forms');
    case 'cms':
    case 'variables':
    case 'roles':
    case 'databases':
    case 'configurations':
      return t('neo.configs');
    case 'dataclasses':
      return t('neo.dataClasses');
  }
};

const typeToPath = (type: EditorType) => {
  if (type === 'cms' || type === 'variables') {
    return 'configurations';
  }
  return type;
};
