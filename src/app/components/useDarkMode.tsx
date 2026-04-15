import { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   useDarkMode — cross-route theme store

   Drop-in replacement for `useState<boolean>(false)` that persists to
   localStorage and syncs across all components (and across route changes).
   Supports 'light' | 'dark' | 'system' preference; the hook exposes the
   *resolved* boolean for backwards compatibility with existing pages.

   Storage key:  moment-kpi-theme
   Values:       'light' | 'dark' | 'system'
═══════════════════════════════════════════════════════════════════════════ */

export type ThemePref = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'moment-kpi-theme';

/* ── Module-level store (outlives component unmount / route change) ── */

function readStoredPref(): ThemePref {
  if (typeof window === 'undefined') return 'light';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch { /* ignore */ }
  return 'light';
}

function prefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  try { return window.matchMedia('(prefers-color-scheme: dark)').matches; }
  catch { return false; }
}

function resolve(pref: ThemePref): boolean {
  if (pref === 'system') return prefersDark();
  return pref === 'dark';
}

let currentPref: ThemePref = readStoredPref();
let currentResolved: boolean = resolve(currentPref);

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach(fn => fn());

// Re-resolve if OS theme flips while pref === 'system'
if (typeof window !== 'undefined' && window.matchMedia) {
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (currentPref === 'system') {
        const next = prefersDark();
        if (next !== currentResolved) {
          currentResolved = next;
          notify();
        }
      }
    };
    mq.addEventListener?.('change', handler);
  } catch { /* ignore */ }
}

/* ── Public API ── */

export function getThemePref(): ThemePref { return currentPref; }
export function getResolvedDark(): boolean { return currentResolved; }

export function setThemePref(pref: ThemePref) {
  currentPref = pref;
  currentResolved = resolve(pref);
  try { localStorage.setItem(STORAGE_KEY, pref); } catch { /* ignore */ }
  notify();
}

/**
 * useDarkMode — drop-in replacement for `useState<boolean>(false)`.
 * Returns the resolved dark-mode boolean and a setter. Setting via this
 * hook writes to localStorage as either 'dark' or 'light' (never 'system');
 * for the 3-way preference use `useThemePref()` instead.
 */
export function useDarkMode(): [boolean, (next: boolean | ((prev: boolean) => boolean)) => void] {
  const [value, setValue] = useState<boolean>(currentResolved);

  useEffect(() => {
    const fn: Listener = () => setValue(currentResolved);
    listeners.add(fn);
    // Resync on mount in case module-scope value changed between renders
    if (value !== currentResolved) setValue(currentResolved);
    return () => { listeners.delete(fn); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setter = (next: boolean | ((prev: boolean) => boolean)) => {
    const resolved = typeof next === 'function' ? (next as (p: boolean) => boolean)(currentResolved) : next;
    setThemePref(resolved ? 'dark' : 'light');
  };

  return [value, setter];
}

/**
 * useThemePref — 3-way preference hook for the settings page.
 * Returns `[pref, resolved, setPref]`.
 */
export function useThemePref(): [ThemePref, boolean, (pref: ThemePref) => void] {
  const [pref, setPref] = useState<ThemePref>(currentPref);
  const [resolved, setResolved] = useState<boolean>(currentResolved);

  useEffect(() => {
    const fn: Listener = () => {
      setPref(currentPref);
      setResolved(currentResolved);
    };
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  return [pref, resolved, setThemePref];
}
