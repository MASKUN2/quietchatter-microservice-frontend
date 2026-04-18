import { useRef, useCallback } from 'react';

interface UseIntersectionObserverProps {
  loading: boolean;
  hasNextPage: boolean;
  onIntersect: () => void;
}

export const useIntersectionObserver = ({
  loading,
  hasNextPage,
  onIntersect,
}: UseIntersectionObserverProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          onIntersect();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasNextPage, onIntersect]
  );

  return lastElementRef;
};
