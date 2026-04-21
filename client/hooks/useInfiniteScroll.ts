import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { InfiniteData } from '@tanstack/react-query';

interface UseInfiniteScrollOptions<T> {
  data: InfiniteData<T> | undefined;
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  messageCount: number;
  resetKey: string | undefined;
}

export function useInfiniteScroll<T>({
  data,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  messageCount,
  resetKey,
}: UseInfiniteScrollOptions<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const prevMessageCountRef = useRef<number>(0);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const isLoadingOlderRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(isFetchingNextPage);
  const hasNextPageRef = useRef(hasNextPage);

  isFetchingRef.current = isFetchingNextPage;
  hasNextPageRef.current = hasNextPage;

  useEffect(() => {
    if (!isLoading && messageCount > 0 && !initialScrollDone) {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
        setInitialScrollDone(true);
        prevMessageCountRef.current = messageCount;
      }
    }
  }, [isLoading, messageCount, initialScrollDone]);

  useEffect(() => {
    if (!initialScrollDone || isLoadingOlderRef.current) return;
    if (messageCount <= prevMessageCountRef.current) {
      prevMessageCountRef.current = messageCount;
      return;
    }
    prevMessageCountRef.current = messageCount;
    const container = scrollContainerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messageCount, initialScrollDone]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || prevScrollHeightRef.current === 0) return;

    const newScrollHeight = container.scrollHeight;
    const diff = newScrollHeight - prevScrollHeightRef.current;
    if (diff > 0) {
      container.scrollTop = diff;
    }
    prevScrollHeightRef.current = 0;
  }, [data?.pages.length]);

  useEffect(() => {
    if (isLoadingOlderRef.current && data?.pages.length) {
      prevMessageCountRef.current = messageCount;
      isLoadingOlderRef.current = false;
    }
  }, [data?.pages.length]);

  useEffect(() => {
    setInitialScrollDone(false);
    prevScrollHeightRef.current = 0;
    isLoadingOlderRef.current = false;
    prevMessageCountRef.current = 0;
  }, [resetKey]);

  useEffect(() => {
    if (!initialScrollDone || !hasNextPage) {
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current && hasNextPageRef.current) {
          isLoadingOlderRef.current = true;
          prevScrollHeightRef.current = scrollContainerRef.current?.scrollHeight || 0;
          fetchNextPage();
        }
      },
      { threshold: 0, rootMargin: '500px 0px 0px 0px' },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [initialScrollDone, hasNextPage, fetchNextPage]);

  return { scrollContainerRef, sentinelRef };
}
