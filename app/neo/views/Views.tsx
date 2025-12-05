import { Button, Flex, IvyIcon, TabsContent, TabsList, TabsTrigger, type ImperativePanelHandle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RuntimeLog } from './runtime-log/RuntimeLog';

type View = {
  id: string;
  icon: IvyIcons;
  content: React.ReactNode;
};

const views = [
  {
    id: 'Log',
    icon: IvyIcons.Note,
    content: <RuntimeLog />
  }
] as const satisfies Array<View>;

export type ViewIds = (typeof views)[number]['id'];

export const useViews = () => {
  const [view, setView] = useState<ViewIds | ''>(views[0].id);
  const [viewsCollapsed, setViewsCollapsed] = useState(true);
  const viewsRef = useRef<ImperativePanelHandle>(null);

  const toggleView = () => {
    if (viewsRef.current?.isCollapsed()) {
      viewsRef.current?.expand();
      if (view === '') {
        setView(views[0].id);
      }
    } else {
      viewsRef.current?.collapse();
      setView('');
    }
  };

  return { viewsRef, view, setView, viewsCollapsed, setViewsCollapsed, toggleView };
};

export const ViewTabs = ({ viewsRef, toggleView, viewsCollapsed }: ReturnType<typeof useViews>) => {
  const { t } = useTranslation();
  const viewLabels: Record<ViewIds, string> = {
    Log: t('label.runtimeLog')
  };

  return (
    <Flex
      className='views-tabs'
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      style={{ paddingInline: 'var(--size-4)' }}
    >
      <TabsList>
        {views.map(({ id, icon }) => (
          <TabsTrigger key={id} value={id} style={{ whiteSpace: 'nowrap' }} onClick={() => viewsRef.current?.expand(30)}>
            <IvyIcon icon={icon} />
            {viewLabels[id]}
          </TabsTrigger>
        ))}
      </TabsList>
      <Button aria-label={t('label.toggleView')} onClick={toggleView} icon={IvyIcons.Chevron} rotate={viewsCollapsed ? 270 : 90} />
    </Flex>
  );
};

export const ViewContent = () => {
  return (
    <>
      {views.map(({ id, content }) => (
        <TabsContent key={id} value={id} style={{ padding: 'var(--size-2)', height: 'calc(100% - 2 * var(--size-2))' }}>
          {content}
        </TabsContent>
      ))}
    </>
  );
};
