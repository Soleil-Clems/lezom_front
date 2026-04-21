import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

class MockIntersectionObserver {
  static cb: any;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  constructor(cb: any) {
    MockIntersectionObserver.cb = cb;
  }
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver as any);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('retourne scrollContainerRef et sentinelRef', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        data: undefined,
        isLoading: false,
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        messageCount: 0,
        resetKey: 'a',
      }),
    );
    expect(result.current.scrollContainerRef).toBeDefined();
    expect(result.current.sentinelRef).toBeDefined();
  });

  it('scroll en bas au chargement initial', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 500, configurable: true });

    const { result, rerender } = renderHook(
      ({ count }: { count: number }) =>
        useInfiniteScroll({
          data: { pages: [{}], pageParams: [0] } as any,
          isLoading: false,
          fetchNextPage: vi.fn(),
          hasNextPage: false,
          isFetchingNextPage: false,
          messageCount: count,
          resetKey: 'k',
        }),
      { initialProps: { count: 0 } },
    );

    result.current.scrollContainerRef.current = container;

    rerender({ count: 5 });
    expect(container.scrollTop).toBe(1000);
  });

  it('déclenche fetchNextPage quand la sentinel entre dans la vue', () => {
    const fetchNextPage = vi.fn();
    const container = document.createElement('div');
    Object.defineProperty(container, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 500, configurable: true });
    const sentinel = document.createElement('div');

    const { result, rerender } = renderHook(
      ({ count, hasNextPage }: { count: number; hasNextPage: boolean }) =>
        useInfiniteScroll({
          data: { pages: [{}], pageParams: [0] } as any,
          isLoading: false,
          fetchNextPage,
          hasNextPage,
          isFetchingNextPage: false,
          messageCount: count,
          resetKey: 'k',
        }),
      { initialProps: { count: 0, hasNextPage: false } },
    );

    result.current.scrollContainerRef.current = container;
    result.current.sentinelRef.current = sentinel;

    rerender({ count: 5, hasNextPage: true });

    act(() => {
      MockIntersectionObserver.cb([{ isIntersecting: true }]);
    });
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it('ne déclenche pas fetchNextPage si pas intersecting', () => {
    const fetchNextPage = vi.fn();
    renderHook(() =>
      useInfiniteScroll({
        data: { pages: [{}], pageParams: [0] } as any,
        isLoading: false,
        fetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
        messageCount: 5,
        resetKey: 'k',
      }),
    );
    act(() => {
      MockIntersectionObserver.cb?.([{ isIntersecting: false }]);
    });
    expect(fetchNextPage).not.toHaveBeenCalled();
  });
});
