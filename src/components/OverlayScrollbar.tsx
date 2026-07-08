import { useEffect, useRef } from 'react';

export function OverlayScrollbar() {
  const barRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('overlay-scroll-root');

    const bar = barRef.current;
    const thumb = thumbRef.current;
    if (!bar || !thumb) {
      return () => root.classList.remove('overlay-scroll-root');
    }

    const barEl: HTMLDivElement = bar;
    const thumbEl: HTMLDivElement = thumb;

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let dragging = false;

    function metrics() {
      return {
        scrollTop: window.scrollY,
        scrollHeight: root.scrollHeight,
        clientHeight: window.innerHeight,
      };
    }

    function update() {
      if (dragging) return;

      const { scrollTop, scrollHeight, clientHeight } = metrics();
      if (scrollHeight <= clientHeight + 1) {
        barEl.classList.add('hidden');
        barEl.setAttribute('aria-hidden', 'true');
        barEl.classList.remove('is-active');
        return;
      }

      const trackH = clientHeight;
      const thumbH = Math.max(32, (clientHeight / scrollHeight) * trackH);
      const maxScroll = scrollHeight - clientHeight;
      const top = maxScroll > 0 ? (scrollTop / maxScroll) * (trackH - thumbH) : 0;

      barEl.classList.remove('hidden');
      barEl.setAttribute('aria-hidden', 'false');
      barEl.style.height = `${trackH}px`;
      thumbEl.style.height = `${thumbH}px`;
      thumbEl.style.transform = `translateY(${top}px)`;
      barEl.classList.add('is-active');

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!dragging) barEl.classList.remove('is-active');
      }, 1400);
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.clientX >= window.innerWidth - 24) update();
    };

    const onThumbDown = (event: PointerEvent) => {
      event.preventDefault();
      dragging = true;
      thumbEl.classList.add('is-dragging');

      const startY = event.clientY;
      const start = metrics();
      const startScroll = start.scrollTop;
      const thumbH = Math.max(32, (start.clientHeight / start.scrollHeight) * start.clientHeight);

      const onMove = (ev: PointerEvent) => {
        const maxScroll = start.scrollHeight - start.clientHeight;
        const delta = ev.clientY - startY;
        const scrollDelta = (delta / Math.max(1, start.clientHeight - thumbH)) * maxScroll;
        window.scrollTo(0, Math.min(maxScroll, Math.max(0, startScroll + scrollDelta)));
      };

      const onUp = () => {
        dragging = false;
        thumbEl.classList.remove('is-dragging');
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        update();
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    thumbEl.addEventListener('pointerdown', onThumbDown);
    update();

    return () => {
      root.classList.remove('overlay-scroll-root');
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('pointermove', onPointerMove);
      thumbEl.removeEventListener('pointerdown', onThumbDown);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="overlay-scrollbar overlay-scrollbar--viewport hidden"
      aria-hidden="true"
    >
      <div ref={thumbRef} className="overlay-scrollbar-thumb" />
    </div>
  );
}
