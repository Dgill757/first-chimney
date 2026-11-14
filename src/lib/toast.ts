/** Minimal stand-in for `sonner` used by the ported builder: one polite, auto-dismissing toast. */
function show(message: string, tone: 'ok' | 'err') {
  if (typeof document === 'undefined') return;
  document.getElementById('fc-toast')?.remove();
  const el = document.createElement('div');
  el.id = 'fc-toast';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.textContent = message;
  el.style.cssText = `position:fixed;left:50%;bottom:calc(5.5rem + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:90;max-width:min(92vw,28rem);padding:.8rem 1.1rem;border-radius:14px;font:500 .92rem Geist,system-ui,sans-serif;color:#f3ede4;background:#211e1b;border:1px solid ${tone === 'ok' ? 'rgb(143 211 174 / .5)' : 'rgb(255 149 132 / .55)'};box-shadow:0 20px 50px -20px rgb(0 0 0 / .8);transition:opacity .25s ease;opacity:0`;
  document.body.appendChild(el);
  requestAnimationFrame(() => (el.style.opacity = '1'));
  window.setTimeout(() => {
    el.style.opacity = '0';
    window.setTimeout(() => el.remove(), 300);
  }, 3200);
}
export const toast = { success: (m: string) => show(m, 'ok'), error: (m: string) => show(m, 'err') };
