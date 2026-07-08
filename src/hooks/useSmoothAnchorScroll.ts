import { useEffect } from 'react';
import { scrollToHash } from '../lib/smoothScroll';

export function useSmoothAnchorScroll(): void {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;

      const href = anchor.getAttribute('href');
      if (href == null) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
        return;
      }

      event.preventDefault();
      scrollToHash(url.hash || '#');
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
