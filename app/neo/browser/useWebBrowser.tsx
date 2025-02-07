import type { ImperativePanelHandle } from '@axonivy/ui-components';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useWorkspace } from '~/data/workspace-api';

type WebBrowserProviderState = {
  panelRef: React.RefObject<ImperativePanelHandle>;
  frameRef: React.RefObject<HTMLIFrameElement>;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  openUrl: (url: string) => void;
};

const browserSizes = [25, 40, 55, 70] as const;

const WebBrowserProviderContext = createContext<WebBrowserProviderState | undefined>(undefined);

export const WebBrowserProvider = ({ children }: { children: React.ReactNode }) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const openState = useState(false);
  const openUrl = (url: string) => {
    if (frameRef.current?.contentWindow) {
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
  const homeUrl = useMemo(() => (ws ? `${ws?.baseUrl}/dev-workflow-ui/faces/home.xhtml` : ''), [ws]);
  if (context === undefined) throw new Error('useWebBrowser must be used within a WebBrowserProvider');
  const { panelRef, frameRef, openUrl } = context;
  const [open, setOpen] = context.openState;
  useEffect(() => {
    setOpen(panelRef.current?.isExpanded() ?? false);
  }, [panelRef, setOpen]);
  const browser = {
    openState: open,
    panelRef,
    toggle: () => {
      if (panelRef.current?.isCollapsed()) {
        panelRef.current?.expand(40);
        setOpen(true);
      } else {
        panelRef.current?.collapse();
        setOpen(false);
      }
    },
    open: (url?: string) => {
      panelRef.current?.expand(40);
      setOpen(true);
      if (url) {
        openUrl(url);
      }
    },
    cycleSize: () => {
      if (panelRef.current) {
        const currentSize = panelRef.current.getSize();
        const nextBrowserSize = browserSizes.find(size => size > currentSize);
        if (nextBrowserSize === undefined) {
          panelRef.current.collapse();
          setOpen(false);
        } else if (nextBrowserSize) {
          panelRef.current.resize(nextBrowserSize);
          setOpen(true);
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
