import React, { useState } from 'react';
import { F, C, D, theme } from './ds/tokens';
import { useDarkMode } from './useDarkMode';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   Reusable Empty State — Prompt 0 §16

   Use instead of ad-hoc "ничего не найдено" divs. Drop-in for any
   filtered table, list page, or data card that has no rows to display.

   Theming: reads global dark-mode state via useDarkMode(). Pass `dark`
   prop explicitly to force a specific variant (useful for showcase pages
   demonstrating both themes side by side).
═══════════════════════════════════════════════════════════════════════════ */

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  primary?: EmptyStateAction;
  outline?: EmptyStateAction;
  ghost?: EmptyStateAction;
  /** Vertical padding of the empty state shell (default 56px 24px). */
  padding?: string;
  /** Force theme variant. Omit to follow the global useDarkMode() store. */
  dark?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  primary,
  outline,
  ghost,
  padding,
  dark: darkProp,
}: EmptyStateProps) {
  const [globalDark] = useDarkMode();
  const dark = darkProp ?? globalDark;
  const t = theme(dark);

  const iconColor  = dark ? D.text4 : '#D1D5DB';
  const titleColor = dark ? D.text2 : C.text2;
  const subColor   = dark ? D.text3 : C.text3;

  return (
    <div style={{
      width: '100%',
      padding: padding ?? '56px 24px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
    }}>
      <Icon size={64} color={iconColor} strokeWidth={1.25} aria-hidden="true" />

      <h3 style={{
        fontFamily: F.dm, fontSize: '18px', fontWeight: 600,
        color: titleColor, margin: '18px 0 0', lineHeight: 1.25,
      }}>
        {title}
      </h3>

      {subtitle && (
        <p style={{
          fontFamily: F.inter, fontSize: '14px', color: subColor,
          margin: '6px 0 0', lineHeight: 1.5,
          maxWidth: '360px',
        }}>
          {subtitle}
        </p>
      )}

      {(primary || outline || ghost) && (
        <div style={{
          display: 'flex', gap: '10px', flexWrap: 'wrap',
          justifyContent: 'center', marginTop: '20px',
        }}>
          {primary && <PrimaryBtn {...primary} dark={dark} t={t} />}
          {outline && <OutlineBtn {...outline} dark={dark} t={t} />}
          {ghost && <GhostBtn {...ghost} dark={dark} t={t} />}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════════════════════════ */

function PrimaryBtn({ label, onClick, icon, dark, t }: EmptyStateAction & { dark: boolean; t: T }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: hov ? t.blueHover : t.blue,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: dark
          ? (hov ? '0 2px 8px rgba(59,130,246,0.32)' : '0 1px 3px rgba(59,130,246,0.18)')
          : (hov ? '0 2px 8px rgba(37,99,235,0.28)'  : '0 1px 3px rgba(37,99,235,0.16)'),
        transition: 'all 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function OutlineBtn({ label, onClick, icon, dark, t }: EmptyStateAction & { dark: boolean; t: T }) {
  const [hov, setHov] = useState(false);
  const baseBorder = dark ? D.border : C.border;
  const baseText   = dark ? D.text2  : C.text1;
  const hoverBg    = dark ? D.tableHover : C.blueLt;
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: `1px solid ${hov && !dark ? t.blue : baseBorder}`,
        borderRadius: '8px',
        background: hov ? hoverBg : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: hov && !dark ? t.blue : baseText,
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function GhostBtn({ label, onClick, icon, dark, t }: EmptyStateAction & { dark: boolean; t: T }) {
  const [hov, setHov] = useState(false);
  const hoverBg = dark ? D.tableHover : C.blueLt;
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 14px',
        border: 'none', borderRadius: '8px',
        background: hov ? hoverBg : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.blue,
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        cursor: 'pointer', transition: 'background 0.12s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
