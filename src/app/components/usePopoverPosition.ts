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
 *
 * On scroll/resize the popover re-anchors to its trigger instead of closing.
 * It only closes when the trigger leaves the viewport entirely (e.g. the
 * user scrolled past it).
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

  const place = useCallback(() => {
    const t = triggerRef.current;
    const m = menuRef.current;
    if (!t || !m) return;
    const rect = t.getBoundingClientRect();

    // If the trigger scrolled out of view, dismiss the popover.
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      close();
      return;
    }

    const h = m.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < h + 16;
    const top = openUp ? Math.max(8, rect.top - h - 6) : rect.bottom + 6;
    const next: { top: number; left?: number; right?: number } = { top };
    if (alignRight) next.right = window.innerWidth - rect.right;
    else next.left = rect.left;
    setPos(next);
  }, [alignRight, close]);

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
    place();
    setMeasured(true);
  }, [open, place]);

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

  // Re-anchor on scroll/resize; close only if the trigger left the viewport.
  useEffect(() => {
    if (!open) return;
    const onMove = () => place();
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open, place]);

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
