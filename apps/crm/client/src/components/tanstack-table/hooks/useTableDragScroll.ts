import { useCallback, useEffect, useRef } from 'react';

export function useTableDragScroll<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const posRef = useRef({ left: 0, x: 0 });
  const handleMouseUpRef = useRef<() => void | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const dx = e.clientX - posRef.current.x;
    container.scrollLeft = posRef.current.left - dx;
  }, []);

  const handleMouseUp = useCallback(() => {
    const container = containerRef.current;
    if (!container || !handleMouseUpRef.current) return;

    document.body.style.cursor = 'unset';
    container.style.removeProperty('user-select');

    container.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUpRef.current);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      posRef.current = {
        left: container.scrollLeft,
        x: e.clientX,
      };

      document.body.style.cursor = 'grabbing';
      container.style.userSelect = 'none';

      container.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    handleMouseUpRef.current = handleMouseUp;
    return () => {
      // NOTE: Clean up if component unmounts mid-drag
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  return { containerRef, handleMouseDown };
}
