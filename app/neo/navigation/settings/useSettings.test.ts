import { act, renderHook } from '@testing-library/react';
import type { NeoClient } from '~/data/neo-protocol';
import { useNeoClient } from '~/neo/client/useNeoClient';
import { useSettings, useSyncSettings } from './useSettings';

vi.mock('~/neo/client/useNeoClient', () => {
  const animationSettingsFn = vi.fn();
  return {
    useNeoClient: () => ({ animationSettings: animationSettingsFn })
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderSettingsHook = (client?: NeoClient) => {
  return renderHook(() => {
    useSyncSettings(client);
    return useSettings();
  });
};

describe('useSettings', () => {
  const client = useNeoClient();

  test('default settings', () => {
    const { result } = renderSettingsHook(client);
    expect(result.current.animation).to.be.deep.equals({ animate: true, speed: 50, mode: 'all' });
  });

  test('disable animation', () => {
    const { result } = renderSettingsHook(client);
    act(() => {
      result.current.enableAnimation(false);
    });
    expect(result.current.animation).to.be.deep.equals({ animate: false, speed: 50, mode: 'all' });
    expect(client?.animationSettings).toBeCalledWith({ animate: false, speed: 50, mode: 'all' });
  });

  test('animation speed', () => {
    const { result } = renderSettingsHook(client);
    act(() => {
      result.current.animationSpeed('75');
    });
    expect(result.current.animation).to.be.deep.equals({ animate: true, speed: 75, mode: 'all' });
    expect(client?.animationSettings).toBeCalledWith({ animate: true, speed: 75, mode: 'all' });
  });

  test('mode', () => {
    const { result } = renderSettingsHook(client);
    act(() => {
      result.current.animationMode('currentProcess');
    });
    expect(result.current.animation).to.be.deep.equals({ animate: true, speed: 50, mode: 'currentProcess' });
    expect(client?.animationSettings).toBeCalledWith({ animate: true, speed: 50, mode: 'currentProcess' });
  });
});
