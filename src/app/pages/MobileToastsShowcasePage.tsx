import React, { useState } from 'react';
import {
  ChevronRight, CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X,
  LayoutDashboard, Building2, CreditCard, MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, MDS, SectionBlock } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE TOASTS / SNACKBARS — references X-00 §13
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Fake app chrome behind the toast ────────────────────────────────── */

function AppChrome({ dark, withTabBar, children, title = 'Moment KPI', animation }: {
  dark: boolean;
  withTabBar: boolean;
  children: React.ReactNode;
  title?: string;
  animation?: 'enter' | 'exit' | null;
}) {
  const t = theme(dark);
  const tabBg = dark ? MDS.tabBarDark : MDS.tabBarLight;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg, position: 'relative' }}>
      {/* Status bar */}
      <div style={{
        height: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.text1,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 3 }}>
          {[3, 5, 7, 9].map(h => <div key={h} style={{ width: 3, height: h, background: t.text1, borderRadius: 1 }} />)}
        </div>
      </div>

      {/* Header */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <span style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          {title}
        </span>
      </div>

      {/* Scrollable fake content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            height: 56, borderRadius: 12,
            background: t.surface, border: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.blueLt, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ height: 10, width: '60%', background: t.border, borderRadius: 3 }} />
              <div style={{ height: 8, width: '40%', background: t.border, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Toast slot */}
      <div style={{
        position: 'absolute',
        left: 16, right: 16,
        bottom: withTabBar ? 80 + 34 : 16 + 34,
        zIndex: 50,
        pointerEvents: 'none',
      }}>
        <div style={{
          animation: animation === 'enter'
            ? 'toastSlideUp 200ms ease-out both'
            : animation === 'exit'
              ? 'toastSlideDown 200ms ease-in both'
              : undefined,
          pointerEvents: 'auto',
        }}>
          {children}
        </div>
      </div>

      {/* Tab bar */}
      {withTabBar && (
        <>
          <div style={{
            height: MDS.tabBarH, background: tabBg,
            backdropFilter: 'blur(16px)',
            borderTop: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'stretch', flexShrink: 0,
          }}>
            {[
              { icon: LayoutDashboard, label: 'Дашборд' },
              { icon: Building2,       label: 'Организации' },
              { icon: CreditCard,      label: 'Карты' },
              { icon: MoreHorizontal,  label: 'Ещё' },
            ].map((tab, i) => {
              const active = i === 0;
              const color = active ? t.blue : t.text3;
              return (
                <div key={tab.label} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                }}>
                  <tab.icon size={24} color={color} strokeWidth={active ? 2 : 1.75} />
                  <span style={{ fontFamily: F.inter, fontSize: 10, fontWeight: active ? 600 : 500, color }}>
                    {tab.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Home indicator */}
          <div style={{
            height: 34, background: tabBg, display: 'flex',
            alignItems: 'center', justifyContent: 'center', paddingBottom: 8,
            boxSizing: 'border-box', flexShrink: 0,
          }}>
            <div style={{ width: 36, height: 5, borderRadius: 3, background: dark ? '#FFF' : '#000', opacity: 0.9 }} />
          </div>
        </>
      )}

      {/* Safe-area only (no tab bar) */}
      {!withTabBar && (
        <div style={{ height: 34, background: t.pageBg, flexShrink: 0 }} />
      )}
    </div>
  );
}

/* ─── Toast primitive ─────────────────────────────────────────────────── */

type ToastKind = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'undo';

function Toast({
  kind, title, action, closable, t, dark,
}: {
  kind: ToastKind;
  title: string;
  action?: { label: string };
  closable?: boolean;
  t: T;
  dark: boolean;
}) {
  const semanticColor: Record<ToastKind, string> = {
    success: dark ? '#34D399' : '#16A34A',
    error:   dark ? '#F87171' : '#DC2626',
    warning: dark ? '#FBBF24' : '#D97706',
    info:    dark ? '#3B82F6' : '#2563EB',
    loading: dark ? '#3B82F6' : '#2563EB',
    undo:    dark ? '#A0A5B8' : '#4B5563',
  };

  const Icon = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    loading: Loader2,
    undo: null as React.ElementType | null,
  }[kind];

  const fg = semanticColor[kind];

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      boxShadow: dark
        ? '0 8px 24px rgba(0,0,0,0.45)'
        : '0 8px 24px rgba(17,24,39,0.15)',
      padding: '12px 16px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      minHeight: 48,
    }}>
      {Icon && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', height: 20, marginTop: 1 }}>
          <Icon
            size={20}
            color={fg}
            strokeWidth={2}
            style={kind === 'loading' ? { animation: 'toastSpin 1s linear infinite' } : undefined}
          />
        </div>
      )}

      <span style={{
        flex: 1,
        fontFamily: F.inter, fontSize: 14, fontWeight: 500, color: t.text1,
        lineHeight: 1.4,
        paddingTop: 1,
      }}>
        {title}
      </span>

      {action && (
        <button style={{
          flexShrink: 0, border: 'none', background: 'transparent',
          padding: '2px 2px', marginLeft: 4,
          fontFamily: F.inter, fontSize: 14, fontWeight: 600,
          color: t.blue, cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          {action.label}
        </button>
      )}

      {closable && (
        <button style={{
          flexShrink: 0, width: 24, height: 24, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginLeft: 4, marginTop: -2,
        }}>
          <X size={16} color={t.text3} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/* ─── Variant screens ─────────────────────────────────────────────────── */

function V1Success({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <AppChrome dark={dark} withTabBar={true} title="Карта •••• 4521" animation="enter">
      <Toast kind="success" title="KPI начислен: 5 000 UZS" closable t={t} dark={dark} />
    </AppChrome>
  );
}

function V2Error({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <AppChrome dark={dark} withTabBar={true} title="Отчёты" animation="enter">
      <Toast kind="error" title="Ошибка отправки" action={{ label: 'Повторить' }} t={t} dark={dark} />
    </AppChrome>
  );
}

function V3Warning({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <AppChrome dark={dark} withTabBar={true} title="Дашборд" animation="enter">
      <Toast kind="warning" title="Срок KPI истекает через 3 дня" closable t={t} dark={dark} />
    </AppChrome>
  );
}

function V4InfoLong({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <AppChrome dark={dark} withTabBar={true} title="Импорт" animation="enter">
      <Toast
        kind="info"
        title="Ваши карты успешно импортированы. Осталось назначить 140 карт продавцам."
        action={{ label: 'Перейти →' }}
        t={t} dark={dark}
      />
    </AppChrome>
  );
}

function V5Loading({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <AppChrome dark={dark} withTabBar={true} title="Отчёты">
      <Toast kind="loading" title="Формирование отчёта..." t={t} dark={dark} />
    </AppChrome>
  );
}

function V6Undo({ dark }: { dark: boolean }) {
  const t = theme(dark);
  // "Отменить" sits at left per spec — custom layout: action first, then text
  return (
    <AppChrome dark={dark} withTabBar={true} title="Продавцы" animation="enter">
      <div style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.45)' : '0 8px 24px rgba(17,24,39,0.15)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 16, minHeight: 48,
      }}>
        <button style={{
          border: 'none', background: 'transparent', padding: '2px 2px',
          fontFamily: F.inter, fontSize: 14, fontWeight: 600, color: t.blue,
          cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          Отменить
        </button>
        <span style={{
          flex: 1, fontFamily: F.inter, fontSize: 14, fontWeight: 500, color: t.text1,
        }}>
          Продавец удалён
        </span>
      </div>
    </AppChrome>
  );
}

/* ─── Positioning scenes ──────────────────────────────────────────────── */

function SceneAboveTabBar({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <AppChrome dark={dark} withTabBar={true} title="Дашборд" animation="enter">
      <Toast kind="success" title="Данные обновлены" closable t={t} dark={dark} />
    </AppChrome>
  );
}

function SceneNoTabBar({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <AppChrome dark={dark} withTabBar={false} title="Новая карта" animation="enter">
      <Toast kind="success" title="Карта создана" closable t={t} dark={dark} />
    </AppChrome>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPEC TABLE
═══════════════════════════════════════════════════════════════════════════ */

const SPEC = [
  { k: 'Container bg',            v: 't.surface — solid white (light) / #1A1D27 (dark)' },
  { k: 'Border',                  v: '1 px solid t.border' },
  { k: 'Border radius',           v: '12 px' },
  { k: 'Shadow (light)',          v: '0 8px 24px rgba(17,24,39,0.15)' },
  { k: 'Shadow (dark)',           v: '0 8px 24px rgba(0,0,0,0.45)' },
  { k: 'Padding',                 v: '12 px vertical · 16 px horizontal' },
  { k: 'Margin from screen edge', v: '16 px left/right' },
  { k: 'Min height',              v: '48 px' },
  { k: 'Icon',                    v: '20 px lucide · strokeWidth 2 · semantic color' },
  { k: 'Title',                   v: 'Inter 14 / 500 · t.text1 · line-height 1.4' },
  { k: 'Action button',           v: 'Inter 14 / 600 · t.blue · no bg / border · right-aligned (or left for Undo)' },
  { k: 'Close button',            v: '24 × 24 · X 16 px · t.text3 · right-most' },
  { k: 'Position — tab bar visible', v: 'bottom = 80 px + tab-bar (64) + safe-area-inset-bottom (34)' },
  { k: 'Position — no tab bar',   v: 'bottom = 16 px + safe-area-inset-bottom (34)' },
  { k: 'Entrance animation',      v: 'toastSlideUp · translateY(100%) → translateY(0) · 200 ms ease-out' },
  { k: 'Exit animation',          v: 'toastSlideDown · translateY(0) → translateY(100%) · 200 ms ease-in' },
  { k: 'Loading spin',            v: 'toastSpin · rotate 360 · 1 s linear infinite' },
  { k: 'Auto-dismiss (success)',  v: '4 seconds' },
  { k: 'Auto-dismiss (undo)',     v: '5 seconds — window during which action can be reversed' },
  { k: 'No auto-dismiss',         v: 'error, warning, info with action, loading — await user / async completion' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileToastsShowcasePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const t = theme(darkMode);

  const variants: Array<{ num: string; title: string; subtitle: string; light: React.ReactNode; dark: React.ReactNode }> = [
    { num: '1.1', title: 'Success',  subtitle: 'CheckCircle + message + X close. Auto-dismiss 4 s.',                                        light: <V1Success dark={false} />, dark: <V1Success dark={true} /> },
    { num: '1.2', title: 'Error',    subtitle: 'XCircle + message + "Повторить" action. User-dismissed.',                                   light: <V2Error   dark={false} />, dark: <V2Error   dark={true} /> },
    { num: '1.3', title: 'Warning',  subtitle: 'AlertTriangle + message + X close. User-dismissed.',                                        light: <V3Warning dark={false} />, dark: <V3Warning dark={true} /> },
    { num: '1.4', title: 'Info (long)', subtitle: 'Info + 2-line body + "Перейти →" text action. User-dismissed.',                          light: <V4InfoLong dark={false} />, dark: <V4InfoLong dark={true} /> },
    { num: '1.5', title: 'Loading',  subtitle: 'Spinner animating + processing text. No close — auto-replaces on completion.',              light: <V5Loading dark={false} />, dark: <V5Loading dark={true} /> },
    { num: '1.6', title: 'Undo',     subtitle: 'Action left-aligned + message. Auto-dismiss 5 s if "Отменить" not tapped.',                 light: <V6Undo    dark={false} />, dark: <V6Undo    dark={true} /> },
  ];

  const scenes = [
    { num: '2.1', title: 'Above visible tab bar',  subtitle: 'bottom = 80 + tab-bar + safe-area. Toast sits above the nav bar — always reachable.',       light: <SceneAboveTabBar dark={false} />, dark: <SceneAboveTabBar dark={true} /> },
    { num: '2.2', title: 'No tab bar (modal page)', subtitle: 'bottom = 16 + safe-area. Toast sits just above the home indicator on full-screen modals.', light: <SceneNoTabBar    dark={false} />, dark: <SceneNoTabBar    dark={true} /> },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar
        role="bank"
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Дизайн-система</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/mobile-design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Mobile</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Toasts · Snackbars · X-00 §13</span>
          </div>

          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            Mobile Toasts, Snackbars & In-App Notifications — X-00 §13
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: '0 0 8px', maxWidth: 900 }}>
            Six variants covering success, error, warning, long-form info, loading, and undo flows. All sit above the tab bar when present, else above the safe-area.
            Slide-up entrance (200 ms ease-out), slide-down exit (200 ms ease-in).
          </p>

          {/* Animation keyframes */}
          <style>{`
            @keyframes toastSlideUp {
              from { transform: translateY(100%); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
            @keyframes toastSlideDown {
              from { transform: translateY(0);    opacity: 1; }
              to   { transform: translateY(100%); opacity: 0; }
            }
            @keyframes toastSpin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
          `}</style>

          {/* §1 — Variants */}
          <SectionBlock num="1" title="Toast variants — 6 shown" subtitle="Each variant in a realistic page context. Both light and dark." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {variants.map(v => (
                <React.Fragment key={v.num}>
                  <PhoneFrame dark={false} height={700} label={`${v.title} · Light`} note={v.subtitle}>
                    {v.light}
                  </PhoneFrame>
                  <PhoneFrame dark={true} height={700} label={`${v.title} · Dark`}>
                    {v.dark}
                  </PhoneFrame>
                </React.Fragment>
              ))}
            </div>
          </SectionBlock>

          {/* §2 — Positioning scenes */}
          <SectionBlock num="2" title="Positioning — above tab bar vs. safe-area-only" subtitle="Toast offset changes based on whether the bottom tab bar is visible." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {scenes.map(s => (
                <React.Fragment key={s.num}>
                  <PhoneFrame dark={false} height={700} label={`${s.title} · Light`} note={s.subtitle}>
                    {s.light}
                  </PhoneFrame>
                  <PhoneFrame dark={true} height={700} label={`${s.title} · Dark`}>
                    {s.dark}
                  </PhoneFrame>
                </React.Fragment>
              ))}
            </div>
          </SectionBlock>

          {/* §3 — Spec */}
          <SectionBlock num="3" title="Design tokens" subtitle="All shared specs across the 6 variants and 2 positioning scenes." t={t}>
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: 'hidden', maxWidth: 920 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                    {['Token / Property', 'Value'].map(h => (
                      <th key={h} style={{
                        padding: '10px 20px', textAlign: 'left',
                        fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.text4,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPEC.map((row, i) => (
                    <tr key={row.k} style={{ borderBottom: i < SPEC.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                      <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: 13, color: t.blue, width: '38%' }}>{row.k}</td>
                      <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: 13, color: t.text2 }}>{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBlock>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text4 }}>
              Mobile Toasts · 6 variants · 2 positioning scenes · X-00 §13
            </span>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: t.textDisabled }}>
              © 2026 Moment Finance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
