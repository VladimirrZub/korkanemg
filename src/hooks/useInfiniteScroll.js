import { useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

export const useInfiniteScroll = (initialItems, itemsPerPage = 3) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);
  const [loadMoreRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  const visibleItems = initialItems.slice(0, visibleCount);
  const hasMore = visibleCount < initialItems.length;

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
   
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + itemsPerPage, initialItems.length));
      setLoading(false);
    }, 500);
  }, [loading, hasMore, itemsPerPage, initialItems.length]);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  return {
    visibleItems,
    loadMoreRef,
    loading,
    hasMore,
    loadedCount: visibleCount,
    totalCount: initialItems.length
  };
};