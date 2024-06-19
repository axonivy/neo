import { createContext, useContext, useRef } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';

type WebBrowserProviderState = {
  panelRef: React.RefObject<ImperativePanelHandle>;
  frameRef: React.RefObject<HTMLIFrameElement>;
};

const WebBrowserProviderContext = createContext<WebBrowserProviderState | undefined>(undefined);

export const WebBrowserProvider = ({ children }: { children: React.ReactNode }) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  return <WebBrowserProviderContext.Provider value={{ panelRef, frameRef }}>{children}</WebBrowserProviderContext.Provider>;
};

export const useWebBrowser = () => {
  const context = useContext(WebBrowserProviderContext);
  if (context === undefined) throw new Error('useWebBrowser must be used within a WebBrowserProvider');
  const { panelRef, frameRef } = context;
  const open = (url: string) => {
    if (frameRef.current?.contentWindow) {
      frameRef.current.contentWindow.location = url;
    }
  };
  const browser = {
    panelRef,
    toggle: () => {
      if (panelRef.current?.isCollapsed()) {
        panelRef.current?.expand(40);
      } else {
        panelRef.current?.collapse();
      }
    },
    open: (url?: string) => {
      panelRef.current?.expand(40);
      if (url) {
        open(url);
      }
    }
  };
  const nav = {
    frameRef,
    back: () => frameRef.current?.contentWindow?.history.back(),
    forward: () => frameRef.current?.contentWindow?.history.forward(),
    reload: () => frameRef.current?.contentWindow?.location.reload(),
    home: () => open('/dev-workflow-ui/faces/home.xhtml'),
    open,
    openExternal: () => window.open(frameRef.current?.contentWindow?.location.href)
  };
  return { browser, nav };
};
