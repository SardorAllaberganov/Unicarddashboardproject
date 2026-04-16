import React from 'react';
import { F, C, D, theme } from '../ds/tokens';

export type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE DESIGN SYSTEM — shared constants, frames, and matrix helpers.
═══════════════════════════════════════════════════════════════════════════ */

export const MDS = {
  phoneW: 390,
  safeTop: 44,
  safeBottom: 34,
  headerH: 56,
  tabBarH: 64,
  cardRadius: 16,
  frameRadius: 40,
  touchTarget: 48,
  // Mobile-specific tokens
  tabBarLight:  'rgba(255,255,255,0.92)',
  tabBarDark:   'rgba(26,29,39,0.92)',
  touchIosLight: 'rgba(0,0,0,0.05)',
  touchIosDark:  'rgba(255,255,255,0.05)',
  androidRipple: 'rgba(59,130,246,0.12)',
};

/* ─── Phone frame ─────────────────────────────────────────────────────── */

export function PhoneFrame({
  children, dark, height = 720, label, note,
}: {
  children: React.ReactNode;
  dark: boolean;
  height?: number;
  label?: string;
  note?: string;
}) {
  const t = theme(dark);
  const bezel = dark ? '#0A0B11' : '#111827';
  const chrome = dark ? '#9CA3AF' : '#6B7280';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
      {label && (
        <div style={{
          fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
          color: dark ? '#9CA3AF' : '#6B7280',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {label}
        </div>
      )}
      <div style={{
        width: MDS.phoneW + 16,
        padding: '8px',
        borderRadius: MDS.frameRadius + 8,
        background: bezel,
        boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.6)' : '0 8px 24px rgba(17,24,39,0.18)',
      }}>
        <div style={{
          width: MDS.phoneW,
          height,
          background: t.pageBg,
          borderRadius: MDS.frameRadius,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {children}
        </div>
      </div>
      {note && (
        <div style={{ fontFamily: F.mono, fontSize: '11px', color: chrome, maxWidth: MDS.phoneW + 16 }}>
          {note}
        </div>
      )}
    </div>
  );
}

/* ─── Light + dark matrix ─────────────────────────────────────────────── */

export function Pair({
  children, height, lightLabel = 'Light', darkLabel = 'Dark', note,
}: {
  children: (dark: boolean) => React.ReactNode;
  height?: number;
  lightLabel?: string;
  darkLabel?: string;
  note?: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <PhoneFrame dark={false} height={height} label={lightLabel} note={note}>
        {children(false)}
      </PhoneFrame>
      <PhoneFrame dark={true} height={height} label={darkLabel}>
        {children(true)}
      </PhoneFrame>
    </div>
  );
}

/* ─── Section wrapper (on the desktop canvas) ─────────────────────────── */

export function SectionBlock({
  num, title, subtitle, children, t,
}: {
  num: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  t: T;
}) {
  return (
    <section style={{ marginTop: '56px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
        <span style={{
          fontFamily: F.mono, fontSize: '12px', fontWeight: 600,
          color: t.text4, background: t.tableHeaderBg,
          border: `1px solid ${t.border}`, borderRadius: '4px',
          padding: '2px 8px',
        }}>
          §{num}
        </span>
        <h2 style={{
          fontFamily: F.dm, fontSize: '20px', fontWeight: 600,
          color: t.text1, margin: 0,
        }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '0 0 16px', maxWidth: '860px' }}>
          {subtitle}
        </p>
      )}
      <div style={{ height: '1px', background: t.border, marginBottom: '20px' }} />
      {children}
    </section>
  );
}

export function VariantLabel({ text, dark }: { text: string; dark: boolean }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: dark ? '#9CA3AF' : '#6B7280',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      marginBottom: '8px',
    }}>
      {text}
    </div>
  );
}

/* Re-export shared tokens for convenience. */
export { F, C, D, theme };
