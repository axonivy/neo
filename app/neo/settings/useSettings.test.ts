import { act, renderHook } from '@testing-library/react';
import { useNeoClient } from '../client/useNeoClient';
import { useSettings } from './useSettings';

vi.mock('~/neo/client/useNeoClient', () => {
  const animationSettingsFn = vi.fn();
  return {
    useNeoClient: () => ({ animationSettings: animationSettingsFn })
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useSettings', () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { animationSettings } = useNeoClient('all')!;

  test('default settings', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.animation).to.be.deep.equals({ animate: true, speed: 50, mode: 'all' });
  });

  test('disable animation', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.enableAnimation(false);
    });
    expect(result.current.animation).to.be.deep.equals({ animate: false, speed: 50, mode: 'all' });
    expect(animationSettings).toBeCalledWith({ animate: false, speed: 50, mode: 'all' });
  });

  test('animation speed', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.animationSpeed('75');
    });
    expect(result.current.animation).to.be.deep.equals({ animate: true, speed: 75, mode: 'all' });
    expect(animationSettings).toBeCalledWith({ animate: true, speed: 75, mode: 'all' });
  });

  test('mode', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.animationMode('currentProcess');
    });
    expect(result.current.animation).to.be.deep.equals({ animate: true, speed: 50, mode: 'currentProcess' });
    expect(animationSettings).toBeCalledWith({ animate: true, speed: 50, mode: 'currentProcess' });
  });
});
