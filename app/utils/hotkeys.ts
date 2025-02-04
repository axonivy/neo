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
    const hotkey = 'shift+alt+A';
    const keyCode = 'KeyA';
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

  const toggleAnimation = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+A';
    const keyCode = 'KeyA';
    return { hotkey, label: `Toggle Animation (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const animationSpeed = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+R';
    const keyCode = 'KeyR';
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
    return { hotkey, label: `Delete selected Element (${hotkeyText(hotkey)})` };
  }, []);

  const importFromFile = useMemo<KnownHotkey>(() => {
    const hotkey = 'I';
    return { hotkey, label: `Import from File (${hotkeyText(hotkey)})` };
  }, []);

  const importFromMarket = useMemo<KnownHotkey>(() => {
    const hotkey = 'M';
    return { hotkey, label: `Import from Market (${hotkeyText(hotkey)})` };
  }, []);

  const focusTabs = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+1';
    const keyCode = 'Digit1';
    return { hotkey, label: `Focus Tabs (${hotkeyText(hotkey)})`, keyCode };
  }, []);

  const focusNav = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+2';
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
    toggleAnimation,
    animationSpeed,
    animationMode,
    changeTheme,
    addElement,
    deleteElement,
    importFromFile,
    importFromMarket,
    focusNav,
    focusTabs
  };
};

export const useHotkeyDispatcher = (iframe: RefObject<HTMLIFrameElement | null>) => {
  const hotkeys = useKnownHotkeys();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const hotkeyObj of Object.values(hotkeys)) {
        if (hotkeyObj.keyCode === undefined) continue;
        const keys = hotkeyObj.hotkey.toLowerCase().split('+');
        const shiftPressed = keys.includes('shift');
        const altPressed = keys.includes('alt');
        const ctrlPressed = keys.includes('mod');
        const keyCode = hotkeyObj.keyCode;

        if (event.key.toLowerCase() === keys[keys.length - 1] && event.shiftKey === shiftPressed && event.altKey === altPressed) {
          const customEvent = new KeyboardEvent('keydown', {
            key: event.key,
            code: keyCode,
            keyCode: event.keyCode,
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
