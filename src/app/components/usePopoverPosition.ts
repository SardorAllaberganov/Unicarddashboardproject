import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Anchors a popover/dropdown menu to a trigger using fixed positioning.
 *
 * Why fixed, not absolute: a parent with `overflow-x: auto` silently sets
 * `overflow-y: auto` too (CSS spec), which clips absolutely-positioned
 * children. Fixed positioning escapes every ancestor's overflow.
 *
 * Auto-flip: if the menu would render off the bottom of the viewport, it
 * flips above the trigger. Measurement is done after mount via layout effect,
 * with the menu kept `visibility: hidden` on the first render so there's
 * no visible jump from bottom to top.
 */
export function usePopoverPosition(options?: { alignRight?: boolean }) {
  const alignRight = options?.alignRight ?? true;

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number } | null>(null);
  const [measured, setMeasured] = useState(false);

  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setMeasured(false);
  }, []);

  const toggle = useCallback(() => {
    if (open) { close(); return; }
    const t = triggerRef.current;
    if (!t) return;
    const rect = t.getBoundingClientRect();
    const base: { top: number; left?: number; right?: number } = { top: rect.bottom + 6 };
    if (alignRight) base.right = window.innerWidth - rect.right;
    else base.left = rect.left;
    setPos(base);
    setMeasured(false);
    setOpen(true);
  }, [open, close, alignRight]);

  // Measure after the menu mounts, then flip if needed — before browser paint.
  useLayoutEffect(() => {
    if (!open) return;
    const t = triggerRef.current;
    const m = menuRef.current;
    if (!t || !m) return;
    const rect = t.getBoundingClientRect();
    const h = m.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < h + 16;
    const top = openUp ? Math.max(8, rect.top - h - 6) : rect.bottom + 6;
    const next: { top: number; left?: number; right?: number } = { top };
    if (alignRight) next.right = window.innerWidth - rect.right;
    else next.left = rect.left;
    setPos(next);
    setMeasured(true);
  }, [open, alignRight]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      close();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, close]);

  // Close on scroll/resize to avoid stale fixed position
  useEffect(() => {
    if (!open) return;
    const onMove = () => close();
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open, close]);

  const menuStyle: React.CSSProperties = pos
    ? {
        position: 'fixed',
        top: pos.top,
        ...(pos.right !== undefined ? { right: pos.right } : {}),
        ...(pos.left !== undefined ? { left: pos.left } : {}),
        zIndex: 200,
        visibility: measured ? 'visible' : 'hidden',
        pointerEvents: measured ? 'auto' : 'none',
      }
    : { position: 'fixed', visibility: 'hidden', pointerEvents: 'none' };

  return { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle };
}
