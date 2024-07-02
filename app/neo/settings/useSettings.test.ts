import { act, renderHook } from '@testing-library/react';
import { useSettings } from './useSettings';
import { useNeoClient } from '../client/useNeoClient';

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
  const { animationSettings } = useNeoClient('all');

  it('default settings', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.animation).to.be.deep.equals({ animate: false, speed: 50, mode: 'all' });
  });

  it('enable animation', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.enableAnimation(true);
    });
    expect(result.current.animation).to.be.deep.equals({ animate: true, speed: 50, mode: 'all' });
    expect(animationSettings).toBeCalledWith({ animate: true, speed: 50, mode: 'all' });
  });

  it('animation speed', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.animationSpeed('75');
    });
    expect(result.current.animation).to.be.deep.equals({ animate: false, speed: 75, mode: 'all' });
    expect(animationSettings).toBeCalledWith({ animate: false, speed: 75, mode: 'all' });
  });

  it('mode', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.animationMode('currentProcess');
    });
    expect(result.current.animation).to.be.deep.equals({ animate: false, speed: 50, mode: 'currentProcess' });
    expect(animationSettings).toBeCalledWith({ animate: false, speed: 50, mode: 'currentProcess' });
  });
});
