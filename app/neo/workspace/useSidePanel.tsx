import type { ImperativePanelHandle } from '@axonivy/ui-components';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useWorkspace } from '~/data/workspace-api';

type SidePanelProviderState = {
  panelRef: React.RefObject<ImperativePanelHandle | null>;
  browserFrameRef: React.RefObject<HTMLIFrameElement | null>;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  openUrl: (url?: string) => void;
};

const sidePanelSizes = [25, 40, 55, 70] as const;

const SidePanelProviderContext = createContext<SidePanelProviderState | undefined>(undefined);

export const SidePanelProvider = ({ children }: { children: React.ReactNode }) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const browserFrameRef = useRef<HTMLIFrameElement>(null);
  const openState = useState(false);
  const openUrl = (url?: string) => {
    if (browserFrameRef.current?.contentWindow && url) {
      browserFrameRef.current.contentWindow.location = url;
    }
  };
  return (
    <SidePanelProviderContext.Provider value={{ panelRef, browserFrameRef, openState, openUrl }}>
      {children}
    </SidePanelProviderContext.Provider>
  );
};

export const useSidePanel = () => {
  const [tab, setTab] = useState('Browser');
  const context = useContext(SidePanelProviderContext);
  const ws = useWorkspace();
  const homeUrl = useMemo(() => (ws ? `${ws?.baseUrl}/dev-workflow-ui/faces/home.xhtml` : undefined), [ws]);
  if (context === undefined) throw new Error('useSidePanel must be used within a SidePanelProviderContext');
  const { panelRef, browserFrameRef, openUrl } = context;
  const [open, setOpen] = context.openState;
  const sidePanel = {
    tab,
    setTab,
    openState: open,
    setOpenState: setOpen,
    panelRef,
    toggle: () => {
      if (panelRef.current?.isCollapsed()) {
        panelRef.current?.expand(40);
      } else {
        panelRef.current?.collapse();
      }
    },
    openUrl: (url?: string) => {
      panelRef.current?.expand(40);
      setTab('Browser');
      if (url) {
        openUrl(url);
      }
    },
    cycleSize: () => {
      if (panelRef.current) {
        const currentSize = panelRef.current.getSize();
        const nextPanelSize = sidePanelSizes.find(size => size > currentSize);
        if (nextPanelSize === undefined) {
          panelRef.current.collapse();
        } else if (nextPanelSize) {
          panelRef.current.resize(nextPanelSize);
        }
      }
    }
  };
  const nav = {
    browserFrameRef,
    back: () => browserFrameRef.current?.contentWindow?.history.back(),
    forward: () => browserFrameRef.current?.contentWindow?.history.forward(),
    reload: () => browserFrameRef.current?.contentWindow?.location.reload(),
    home: () => openUrl(homeUrl),
    openExternal: () => window.open(browserFrameRef.current?.contentWindow?.location.href)
  };
  return { sidePanel, nav, homeUrl };
};
