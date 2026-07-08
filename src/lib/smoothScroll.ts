const SCROLL_DURATION_MS = 650;

let scrollAnimationId: number | null = null;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function cancelScrollAnimation(): void {
  if (scrollAnimationId !== null) {
    cancelAnimationFrame(scrollAnimationId);
    scrollAnimationId = null;
  }
}

function getScrollTargetY(element: HTMLElement): number {
  const scrollMargin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  return window.scrollY + element.getBoundingClientRect().top - scrollMargin;
}

function animateScrollTo(targetY: number): void {
  cancelScrollAnimation();

  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clampedTarget = Math.min(maxY, Math.max(0, targetY));

  if (prefersReducedMotion()) {
    window.scrollTo(0, clampedTarget);
    return;
  }

  const startY = window.scrollY;
  const distance = clampedTarget - startY;

  if (Math.abs(distance) < 1) {
    window.scrollTo(0, clampedTarget);
    return;
  }

  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / SCROLL_DURATION_MS, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));

    if (progress < 1) {
      scrollAnimationId = requestAnimationFrame(step);
    } else {
      scrollAnimationId = null;
    }
  };

  scrollAnimationId = requestAnimationFrame(step);
}

export function scrollToHash(hash: string): void {
  if (!hash || hash === '#') {
    animateScrollTo(0);
    history.pushState(null, '', window.location.pathname + window.location.search);
    return;
  }

  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;

  animateScrollTo(getScrollTargetY(target));
  history.pushState(null, '', hash);
}
