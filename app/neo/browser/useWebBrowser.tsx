import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { useWorkspace } from '~/data/workspace-api';

type WebBrowserProviderState = {
  panelRef: React.RefObject<ImperativePanelHandle>;
  frameRef: React.RefObject<HTMLIFrameElement>;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

const WebBrowserProviderContext = createContext<WebBrowserProviderState | undefined>(undefined);

export const WebBrowserProvider = ({ children }: { children: React.ReactNode }) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const openState = useState(false);
  return <WebBrowserProviderContext.Provider value={{ panelRef, frameRef, openState }}>{children}</WebBrowserProviderContext.Provider>;
};

export const useWebBrowser = () => {
  const context = useContext(WebBrowserProviderContext);
  const ws = useWorkspace();
  const homeUrl = useMemo(() => (ws ? `${ws?.baseUrl}/dev-workflow-ui/faces/home.xhtml` : ''), [ws]);
  if (context === undefined) throw new Error('useWebBrowser must be used within a WebBrowserProvider');
  const { panelRef, frameRef } = context;
  const openUrl = (url: string) => {
    if (frameRef.current?.contentWindow) {
      frameRef.current.contentWindow.location = url;
    }
  };
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
