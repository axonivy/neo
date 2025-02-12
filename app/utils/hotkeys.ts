import { hotkeyText } from '@axonivy/ui-components';
import { useEffect, useMemo, type RefObject } from 'react';

type KnownHotkey = { hotkey: string; label: string; keyCode?: string };

export const useKnownHotkeys = (overviewAddTitle?: string) => {
  const openHome = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+H';
    const keyCode = 'KeyH';
    return { hotkey, label: `Home (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const openWorkspaces = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+W';
    const keyCode = 'KeyW';
    return { hotkey, label: `Workspaces (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const openProcesses = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+P';
    const keyCode = 'KeyP';
    return { hotkey, label: `Processes (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const openForms = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+F';
    const keyCode = 'KeyF';
    return { hotkey, label: `Forms (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const openDataClasses = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+D';
    const keyCode = 'KeyD';
    return { hotkey, label: `Data Classes (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const openConfigs = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+C';
    const keyCode = 'KeyC';
    return { hotkey, label: `Configurations (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const closeAllTabs = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+alt+Q';
    const keyCode = 'KeyQ';
    return { hotkey, label: `Close All Tabs (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const closeActiveTabs = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+alt+W';
    const keyCode = 'KeyW';
    return { hotkey, label: `Close Tab (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const openSimulation = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+S';
    const keyCode = 'KeyS';
    return { hotkey, label: `Open Simulation (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const resizeSimulation = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+R';
    const keyCode = 'KeyR';
    return { hotkey, label: `Resize Simulation (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const toggleAnimation = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+N';
    const keyCode = 'KeyN';
    return { hotkey, label: `Toggle Animation (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const resetEngine = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+E';
    const keyCode = 'KeyE';
    return { hotkey, label: `Reset BPM Engine (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const animationSpeed = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+F';
    const keyCode = 'KeyF';
    return { hotkey, label: `Animation Speed (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const animationMode = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+M';
    const keyCode = 'KeyM';
    return { hotkey, label: `Animation Mode (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const changeTheme = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+T';
    const keyCode = 'KeyT';
    return { hotkey, label: `Theme Switch (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const addElement = useMemo<KnownHotkey>(() => {
    const hotkey = 'A';
    return { hotkey, label: `${overviewAddTitle} (${hotkeyText(hotkey)})` };
  }, [overviewAddTitle]);

  const deleteElement = useMemo<KnownHotkey>(() => {
    const hotkey = 'Delete';
    return { hotkey, label: `Delete Element (${hotkeyText(hotkey)})` };
  }, []);

  const importFromFile = useMemo<KnownHotkey>(() => {
    const hotkey = 'I';
    return { hotkey, label: `Import from File (${hotkeyText(hotkey)})` };
  }, []);

  const importFromMarket = useMemo<KnownHotkey>(() => {
    const hotkey = 'M';
    return { hotkey, label: `Import from Market (${hotkeyText(hotkey)})` };
  }, []);

  const deployWorkspace = useMemo<KnownHotkey>(() => {
    const hotkey = 'D';
    return { hotkey, label: `Deploy Workspace (${hotkeyText(hotkey)})` };
  }, []);

  const exportWorkspace = useMemo<KnownHotkey>(() => {
    const hotkey = 'E';
    return { hotkey, label: `Export Workspace (${hotkeyText(hotkey)})` };
  }, []);

  const focusTabs = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+alt+1';
    const keyCode = 'Digit1';
    return { hotkey, label: `Focus Tabs (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const focusNav = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+alt+2';
    const keyCode = 'Digit2';
    return { hotkey, label: `Focus Navigation (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  return {
    openHome,
    openWorkspaces,
    openProcesses,
    openDataClasses,
    openForms,
    openConfigs,
    closeAllTabs,
    closeActiveTabs,
    openSimulation,
    resizeSimulation,
    toggleAnimation,
    resetEngine,
    animationSpeed,
    animationMode,
    changeTheme,
    addElement,
    deleteElement,
    importFromFile,
    importFromMarket,
    exportWorkspace,
    deployWorkspace,
    focusNav,
    focusTabs
  };
};

export const useHotkeyDispatcher = (iframe: RefObject<HTMLIFrameElement | null>) => {
  const hotkeys = useKnownHotkeys();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      for (const hotkeyObj of Object.values(hotkeys)) {
        if (hotkeyObj.keyCode === undefined) continue;
        const keys = hotkeyObj.hotkey.toLowerCase().split('+');
        const shiftPressed = keys.includes('shift');
        const altPressed = keys.includes('alt');
        const ctrlPressed = keys.includes('mod');
        const keyCode = hotkeyObj.keyCode;

        if (
          event.code === keyCode &&
          event.shiftKey === shiftPressed &&
          event.altKey === altPressed &&
          (event.ctrlKey === ctrlPressed || event.metaKey === ctrlPressed)
        ) {
          const customEvent = new KeyboardEvent('keydown', {
            key: event.key,
            code: keyCode,
            bubbles: true,
            cancelable: true,
            shiftKey: shiftPressed,
            altKey: altPressed,
            ctrlKey: ctrlPressed,
            metaKey: ctrlPressed
          });

          iframe.current?.contentWindow?.parent.document.dispatchEvent(customEvent);
          break;
        }
      }
    };

    const frameWindow = iframe.current?.contentWindow;
    frameWindow?.addEventListener('keydown', handleKeyDown);

    return () => {
      frameWindow?.removeEventListener('keydown', handleKeyDown);
    };
  }, [iframe, hotkeys]);
};
