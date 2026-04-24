import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

const mockMatchMedia = (matches: boolean) => {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  return vi.fn().mockReturnValue({
    matches,
    addEventListener: (event: string, cb: (e: MediaQueryListEvent) => void) => listeners.push(cb),
    removeEventListener: vi.fn(),
    _listeners: listeners,
  });
};

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { ...window, innerWidth: 1024 });
  });

  it('retourne false pour un écran desktop (>= 768px)', () => {
    window.innerWidth = 1024;
    window.matchMedia = mockMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('retourne true pour un écran mobile (< 768px)', () => {
    window.innerWidth = 375;
    window.matchMedia = mockMatchMedia(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
