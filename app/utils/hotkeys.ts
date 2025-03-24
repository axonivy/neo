import { hotkeyText } from '@axonivy/ui-components';
import { useEffect, useMemo, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';

type KnownHotkey = { hotkey: string; label: string; keyCode?: string };

export const useKnownHotkeys = (overviewAddTitle?: string) => {
  const { t } = useTranslation();
  const openHome = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+H';
    const keyCode = 'KeyH';
    return { hotkey, label: t('hotkey.home', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const openWorkspaces = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+W';
    const keyCode = 'KeyW';
    return { hotkey, label: t('hotkey.workspaces', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const openProcesses = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+P';
    const keyCode = 'KeyP';
    return { hotkey, label: t('hotkey.processes', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const openForms = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+F';
    const keyCode = 'KeyF';
    return { hotkey, label: t('hotkey.forms', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const openDataClasses = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+D';
    const keyCode = 'KeyD';
    return { hotkey, label: t('hotkey.dataClasses', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const openConfigs = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+alt+C';
    const keyCode = 'KeyC';
    return { hotkey, label: t('hotkey.configurations', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const closeAllTabs = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+alt+Q';
    const keyCode = 'KeyQ';
    return { hotkey, label: t('hotkey.closeAllTabs', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const closeActiveTabs = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+alt+W';
    const keyCode = 'KeyW';
    return { hotkey, label: t('hotkey.closeTab', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const openSimulation = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+S';
    const keyCode = 'KeyS';
    return { hotkey, label: t('hotkey.openSim', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const resizeSimulation = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+R';
    const keyCode = 'KeyR';
    return { hotkey, label: t('hotkey.resizeSim', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const toggleAnimation = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+N';
    const keyCode = 'KeyN';
    return { hotkey, label: t('hotkey.toggleAnimation', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const resetEngine = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+E';
    const keyCode = 'KeyE';
    return { hotkey, label: t('hotkey.resetBpm', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const animationSpeed = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+F';
    const keyCode = 'KeyF';
    return { hotkey, label: t('hotkey.animationSpeed', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const animationMode = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+M';
    const keyCode = 'KeyM';
    return { hotkey, label: t('hotkey.animationMode', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const changeTheme = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+T';
    const keyCode = 'KeyT';
    return { hotkey, label: t('hotkey.themeSwitch', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const addElement = useMemo<KnownHotkey>(() => {
    const hotkey = 'A';
    return { hotkey, label: `${overviewAddTitle} (${hotkeyText(hotkey)})` };
  }, [overviewAddTitle]);

  const deleteElement = useMemo<KnownHotkey>(() => {
    const hotkey = 'Delete';
    return { hotkey, label: t('hotkey.deleteElement', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const importFromFile = useMemo<KnownHotkey>(() => {
    const hotkey = 'I';
    return { hotkey, label: t('hotkey.importFile', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const importFromMarket = useMemo<KnownHotkey>(() => {
    const hotkey = 'M';
    return { hotkey, label: t('hotkey.importMarket', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const deployWorkspace = useMemo<KnownHotkey>(() => {
    const hotkey = 'D';
    return { hotkey, label: t('hotkey.deploy', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const exportWorkspace = useMemo<KnownHotkey>(() => {
    const hotkey = 'E';
    return { hotkey, label: t('hotkey.exportWorkspace', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusTabs = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+alt+1';
    const keyCode = 'Digit1';
    return { hotkey, label: t('hotkey.focusTabs', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

  const focusNav = useMemo<KnownHotkey>(() => {
    const hotkey = 'shift+alt+2';
    const keyCode = 'Digit2';
    return { hotkey, label: t('hotkey.focusNavigation', { hotkey: hotkeyText(hotkey) }), keyCode };
  }, [t]);

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
