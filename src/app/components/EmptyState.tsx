import React, { useState } from 'react';
import { F, C } from './ds/tokens';

/* ═══════════════════════════════════════════════════════════════════════════
   Reusable Empty State — Prompt 0 §16

   Use instead of ad-hoc "ничего не найдено" divs. Drop-in for any
   filtered table, list page, or data card that has no rows to display.
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
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  primary,
  outline,
  ghost,
  padding,
}: EmptyStateProps) {
  return (
    <div style={{
      width: '100%',
      padding: padding ?? '56px 24px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
    }}>
      <Icon size={64} color="#D1D5DB" strokeWidth={1.25} aria-hidden="true" />

      <h3 style={{
        fontFamily: F.dm, fontSize: '18px', fontWeight: 700,
        color: C.text1, margin: '18px 0 0', lineHeight: 1.25,
      }}>
        {title}
      </h3>

      {subtitle && (
        <p style={{
          fontFamily: F.inter, fontSize: '13px', color: C.text3,
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
          {primary && <PrimaryBtn {...primary} />}
          {outline && <OutlineBtn {...outline} />}
          {ghost && <GhostBtn {...ghost} />}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════════════════════════ */

function PrimaryBtn({ label, onClick, icon }: EmptyStateAction) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: hov ? C.blueHover : C.blue,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
        transition: 'all 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function OutlineBtn({ label, onClick, icon }: EmptyStateAction) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: `1px solid ${hov ? C.blue : C.border}`,
        borderRadius: '8px',
        background: hov ? C.blueLt : C.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: hov ? C.blue : C.text1,
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function GhostBtn({ label, onClick, icon }: EmptyStateAction) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 14px',
        border: 'none', borderRadius: '8px',
        background: hov ? C.blueLt : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.blue,
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        cursor: 'pointer', transition: 'background 0.12s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
