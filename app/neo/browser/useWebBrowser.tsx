import { usePanelRef } from '@axonivy/ui-components';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useWorkspace } from '~/data/workspace-api';

type WebBrowserProviderState = {
  panelRef: ReturnType<typeof usePanelRef>;
  frameRef: React.RefObject<HTMLIFrameElement | null>;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  openUrl: (url?: string) => void;
};

const browserSizes = [25, 40, 55, 70] as const;

const WebBrowserProviderContext = createContext<WebBrowserProviderState | undefined>(undefined);

export const WebBrowserProvider = ({ children }: { children: React.ReactNode }) => {
  const panelRef = usePanelRef();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const openState = useState(false);
  const openUrl = (url?: string) => {
    if (frameRef.current?.contentWindow && url) {
      frameRef.current.contentWindow.location = url;
    }
  };
  return (
    <WebBrowserProviderContext.Provider value={{ panelRef, frameRef, openState, openUrl }}>{children}</WebBrowserProviderContext.Provider>
  );
};

export const useWebBrowser = () => {
  const context = useContext(WebBrowserProviderContext);
  const ws = useWorkspace();
  const homeUrl = useMemo(() => (ws ? `${ws?.baseUrl}/dev-workflow-ui/faces/home.xhtml` : undefined), [ws]);
  if (context === undefined) throw new Error('useWebBrowser must be used within a WebBrowserProvider');
  const { panelRef, frameRef, openUrl, openState } = context;
  const [isOpen, setOpenState] = openState;
  const browser = {
    panelRef,
    setOpenState,
    isOpen: () => isOpen,
    toggle: () => {
      if (panelRef.current?.isCollapsed()) {
        panelRef.current?.resize('40%');
      } else {
        panelRef.current?.collapse();
      }
    },
    open: (url?: string) => {
      panelRef.current?.resize('40%');
      if (url) {
        openUrl(url);
      }
    },
    cycleSize: () => {
      if (panelRef.current) {
        const currentSize = panelRef.current.getSize().asPercentage;
        const nextBrowserSize = browserSizes.find(size => size > currentSize);
        if (nextBrowserSize === undefined) {
          panelRef.current.collapse();
        } else {
          panelRef.current.resize(`${nextBrowserSize}%`);
        }
      }
    }
  };
  const nav = {
    frameRef,
    back: () => frameRef.current?.contentWindow?.history.back(),
    forward: () => frameRef.current?.contentWindow?.history.forward(),
    reload: () => frameRef.current?.contentWindow?.location.reload(),
    home: () => openUrl(homeUrl),
    openExternal: () => window.open(frameRef.current?.contentWindow?.location.href)
  };
  return { browser, nav, homeUrl };
};
