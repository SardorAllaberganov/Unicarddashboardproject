import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

const listeners = new Set<() => void>();
let cachedMobile = typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false;

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const next = window.innerWidth < MOBILE_BREAKPOINT;
    if (next !== cachedMobile) {
      cachedMobile = next;
      listeners.forEach(fn => fn());
    }
  });
}

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(cachedMobile);
  useEffect(() => {
    const fn = () => setMobile(cachedMobile);
    listeners.add(fn);
    fn();
    return () => { listeners.delete(fn); };
  }, []);
  return mobile;
}
