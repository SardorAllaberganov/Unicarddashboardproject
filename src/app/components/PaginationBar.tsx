import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { F, C, D, theme } from './ds/tokens';
import { useDarkMode } from './useDarkMode';
import { usePopoverPosition } from './usePopoverPosition';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   PaginationBar — Prompt 0 §4

   Drop-in pagination row for any table page. Includes:
     • Range readout ("Показано X–Y из Z")
     • Page-size selector (compact, 72px) with optional localStorage persistence
     • Page-number buttons with ellipsis for non-contiguous groups
═══════════════════════════════════════════════════════════════════════════ */

export interface PaginationBarProps {
  total: number;
  page: number;              // 1-indexed
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  /** If set, pageSize preference persists in localStorage under `pagesize:{storageKey}`. */
  storageKey?: string;
  pageSizeOptions?: number[];
  /** Force theme variant. Omit to follow the global useDarkMode() store. */
  dark?: boolean;
}

const DEFAULT_OPTIONS = [10, 20, 50, 100];

export function PaginationBar({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  storageKey,
  pageSizeOptions = DEFAULT_OPTIONS,
  dark: darkProp,
}: PaginationBarProps) {
  const [globalDark] = useDarkMode();
  const dark = darkProp ?? globalDark;
  const t = theme(dark);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const startRow = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRow = Math.min(safePage * pageSize, total);

  // Hydrate pageSize from localStorage once on mount
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(`pagesize:${storageKey}`);
      if (!raw) return;
      const n = parseInt(raw, 10);
      if (Number.isFinite(n) && pageSizeOptions.includes(n) && n !== pageSize) {
        onPageSizeChange(n);
      }
    } catch { /* ignore */ }
    // Deliberately no deps — run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPageSize = (size: number) => {
    if (storageKey) {
      try { localStorage.setItem(`pagesize:${storageKey}`, String(size)); } catch { /* ignore */ }
    }
    onPageSizeChange(size);
    // Reset to page 1 when size changes to avoid overshooting total
    onPageChange(1);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '16px', padding: '12px 16px',
      borderTop: `1px solid ${t.border}`,
      flexWrap: 'wrap',
      fontFamily: F.inter, fontSize: '13px', color: t.text3,
    }}>
      {/* Left — range readout */}
      <div style={{ flex: '1 1 200px' }}>
        {total === 0
          ? <span>Ничего не найдено</span>
          : <span>
              Показано{' '}
              <span style={{ fontFamily: F.mono, color: t.text1 }}>
                {fmtNum(startRow)}–{fmtNum(endRow)}
              </span>{' '}
              из{' '}
              <span style={{ fontFamily: F.mono, color: t.text1 }}>
                {fmtNum(total)}
              </span>
            </span>}
      </div>

      {/* Center — page size selector */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        flex: '0 0 auto',
      }}>
        <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>
          Строк на странице:
        </span>
        <PageSizeSelect value={pageSize} options={pageSizeOptions} onChange={setPageSize} t={t} dark={dark} />
      </div>

      {/* Right — page controls */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        flex: '1 1 auto', justifyContent: 'flex-end',
      }}>
        <ArrowBtn
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          ariaLabel="Предыдущая страница"
          t={t}
          dark={dark}
        >
          <ChevronLeft size={14} strokeWidth={1.75} />
        </ArrowBtn>

        {pageList(safePage, pageCount).map((item, i) => (
          item === '…'
            ? <span
                key={`ell-${i}`}
                style={{
                  fontFamily: F.inter, fontSize: '13px', color: t.text4,
                  padding: '0 6px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: '20px', height: '28px',
                }}
              >
                …
              </span>
            : <PageBtn
                key={`p-${item}`}
                active={item === safePage}
                onClick={() => onPageChange(item as number)}
                t={t}
                dark={dark}
              >
                {item}
              </PageBtn>
        ))}

        <ArrowBtn
          disabled={safePage >= pageCount}
          onClick={() => onPageChange(safePage + 1)}
          ariaLabel="Следующая страница"
          t={t}
          dark={dark}
        >
          <ChevronRight size={14} strokeWidth={1.75} />
        </ArrowBtn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE LIST ALGORITHM
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Returns an array mixing numeric page indices and `'…'` markers.
 * Always shows first + last. Shows current ± 1. Ellipsis fills gaps.
 */
function pageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const out: (number | '…')[] = [];
  const push = (v: number | '…') => {
    if (v === '…' && out[out.length - 1] === '…') return;
    out.push(v);
  };

  // First
  push(1);

  // Left gap
  if (current > 3) push('…');

  // Around current
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) push(i);

  // Right gap
  if (current < total - 2) push('…');

  // Last
  if (total > 1) push(total);

  return out;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SIZE SELECT
═══════════════════════════════════════════════════════════════════════════ */

function PageSizeSelect({ value, options, onChange, t, dark }: {
  value: number;
  options: number[];
  onChange: (v: number) => void;
  t: T;
  dark: boolean;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } =
    usePopoverPosition({ alignRight: false });

  const hoverBg = dark ? D.tableHover : '#F9FAFB';
  const triggerText = dark ? D.text2 : C.text1;

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={toggle}
        style={{
          height: '30px', width: '72px',
          padding: '0 10px',
          border: `1px solid ${open ? t.blue : t.inputBorder}`,
          borderRadius: '6px',
          background: t.surface,
          fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
          color: triggerText, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'border-color 0.12s',
        }}
      >
        <span>{value}</span>
        <ChevronRight
          size={12} color={t.text3} strokeWidth={1.75}
          style={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.15s' }}
        />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '96px',
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(17,24,39,0.08)',
            padding: '4px 0',
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); close(); }}
              style={{
                display: 'flex', width: '100%', padding: '7px 12px',
                gap: '8px', alignItems: 'center', justifyContent: 'space-between',
                background: opt === value ? t.blueLt : 'transparent',
                border: 'none', cursor: 'pointer',
                fontFamily: F.inter, fontSize: '13px',
                color: opt === value ? t.blue : t.text2, textAlign: 'left',
                fontWeight: opt === value ? 600 : 400,
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = hoverBg; }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{opt}</span>
              {opt === value && <Check size={13} color={t.blue} strokeWidth={2.25} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE NUMBER + ARROW BUTTONS
═══════════════════════════════════════════════════════════════════════════ */

function PageBtn({ children, active, onClick, t, dark }: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  t: T;
  dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const hoverBg = dark ? D.tableHover : C.blueLt;
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        minWidth: '28px', height: '28px', padding: '0 8px',
        border: 'none', borderRadius: '6px',
        background: active ? t.blue : (hov ? hoverBg : 'transparent'),
        fontFamily: F.inter, fontSize: '12.5px',
        fontWeight: active ? 600 : 500,
        color: active ? '#FFFFFF' : t.text2,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  );
}

function ArrowBtn({ children, onClick, disabled, ariaLabel, t, dark }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  t: T;
  dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const hoverBg = dark ? D.tableHover : C.blueLt;
  const activeColor = hov && !disabled ? t.text2 : t.text3;
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        width: '28px', height: '28px',
        border: 'none', borderRadius: '6px',
        background: disabled ? 'transparent' : (hov ? hoverBg : 'transparent'),
        color: disabled ? t.text4 : activeColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function fmtNum(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
