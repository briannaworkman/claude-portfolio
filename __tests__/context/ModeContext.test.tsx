import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ModeProvider, useMode } from '@/context/ModeContext';

describe('ModeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to web mode', () => {
    const { result } = renderHook(() => useMode(), { wrapper: ModeProvider });
    expect(result.current.mode).toBe('web');
  });

  it('toggles from web to terminal', () => {
    const { result } = renderHook(() => useMode(), { wrapper: ModeProvider });
    act(() => result.current.toggle());
    expect(result.current.mode).toBe('terminal');
  });

  it('toggles from terminal back to web', () => {
    const { result } = renderHook(() => useMode(), { wrapper: ModeProvider });
    act(() => result.current.toggle());
    act(() => result.current.toggle());
    expect(result.current.mode).toBe('web');
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useMode(), { wrapper: ModeProvider });
    act(() => result.current.toggle());
    expect(localStorage.getItem('portfolio-mode')).toBe('terminal');
  });
});
