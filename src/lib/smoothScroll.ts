// JS-driven smooth scroll with custom easing — overrides default CSS scroll-behavior
// so we can control duration and curve for a more deliberate feel.

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function smoothScrollTo(id: string, duration = 1100) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const startY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + startY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

export function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  id: string,
  duration = 1100,
) {
  e.preventDefault();
  smoothScrollTo(id, duration);
}
