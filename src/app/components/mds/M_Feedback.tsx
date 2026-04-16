import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, Loader2, RefreshCw, FileX, Package } from 'lucide-react';
import { F, theme, MDS, Pair, VariantLabel, T } from './frame';

/* ═══════════════════════════════════════════════════════════════════════════
   §13 TOAST  +  §14 PULL-TO-REFRESH  +  §15 EMPTY  +  §16 SKELETON
═══════════════════════════════════════════════════════════════════════════ */

/* ─── §13 Toast / Snackbar ──────────────────────────────────────────── */

type ToastKind = 'success' | 'error' | 'warning' | 'info';

function Toast({
  kind, title, message, action, dark,
}: {
  kind: ToastKind; title: string; message?: string;
  action?: string; dark: boolean;
}) {
  const t = theme(dark);
  const pal: Record<ToastKind, { icon: React.ElementType; color: string }> = {
    success: { icon: CheckCircle,    color: t.success },
    error:   { icon: XCircle,        color: t.error },
    warning: { icon: AlertTriangle,  color: t.warning },
    info:    { icon: Info,           color: t.blue },
  };
  const p = pal[kind];
  const Icon = p.icon;
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderLeft: `4px solid ${p.color}`, borderRadius: 12,
      padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 12,
      boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(17,24,39,0.15)',
    }}>
      <Icon size={22} color={p.color} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: '15px', fontWeight: 600, color: t.text1 }}>
          {title}
        </div>
        {message && (
          <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, lineHeight: 1.4, marginTop: 2 }}>
            {message}
          </div>
        )}
      </div>
      {action ? (
        <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: t.blue, flexShrink: 0 }}>
          {action}
        </span>
      ) : (
        <X size={16} color={t.text4} style={{ flexShrink: 0, marginTop: 2 }} />
      )}
    </div>
  );
}

function ToastsCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg, padding: '24px 16px', gap: 24 }}>
      <div>
        <VariantLabel text="Success (auto-dismiss 4s)" dark={dark} />
        <Toast dark={dark} kind="success" title="KPI начислен" message="Камола Юсупова получила 15 000 UZS за выполнение KPI 2" />
      </div>
      <div>
        <VariantLabel text="Info (auto-dismiss 4s)" dark={dark} />
        <Toast dark={dark} kind="info" title="Новая партия создана" message="500 карт добавлено в систему" />
      </div>
      <div>
        <VariantLabel text="Warning (auto-dismiss 6s)" dark={dark} />
        <Toast dark={dark} kind="warning" title="Срок KPI истекает" message="89 карт не завершат KPI до 30.04.2026" />
      </div>
      <div>
        <VariantLabel text="Error + action (manual dismiss)" dark={dark} />
        <Toast dark={dark} kind="error" title="Ошибка импорта" message="Файл не соответствует формату .xlsx" action="Повторить" />
      </div>
      <div style={{
        marginTop: 'auto',
        fontFamily: F.mono, fontSize: '11px', color: t.text3,
        padding: 12, border: `1px dashed ${t.inputBorder}`, borderRadius: 10, lineHeight: 1.6,
      }}>
        Position: bottom, above tab bar (or safe-area-bottom).<br />
        Margin: 16 px horizontal.<br />
        Slide-up on enter, slide-down on exit.<br />
        Max stack: 1 (newer replaces older).
      </div>
    </div>
  );
}

/* ─── §14 Pull-to-Refresh ───────────────────────────────────────────── */

function PtrState({
  state, dark,
}: { state: 'idle' | 'pulling' | 'refreshing'; dark: boolean }) {
  const t = theme(dark);
  const spinnerColor = t.blue;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.pageBg, height: '100%' }}>
      <div style={{ height: MDS.safeTop, background: t.surface, borderBottom: `1px solid ${t.border}` }} />
      {/* Top indicator area */}
      <div style={{
        height: state === 'idle' ? 0 : 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.pageBg,
        transition: 'height 0.2s',
      }}>
        {state === 'pulling' && (
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: `3px solid ${t.border}`, borderTopColor: spinnerColor,
            transform: 'rotate(45deg)',
          }} />
        )}
        {state === 'refreshing' && (
          <Loader2 size={24} color={spinnerColor} style={{ animation: 'mdsSpin 1s linear infinite' }} />
        )}
      </div>

      {/* Content rows (placeholder) */}
      <div style={{ flex: 1, background: t.surface }}>
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            padding: '16px', borderBottom: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', gap: 12,
            opacity: state === 'pulling' ? 0.85 : 1,
            transform: state === 'pulling' ? 'translateY(8px)' : 'none',
            transition: 'transform 0.2s',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: t.blueLt,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 14, borderRadius: 4, background: t.skeletonBase, width: `${60 + i * 4}%` }} />
              <div style={{ height: 10, borderRadius: 4, background: t.skeletonBase, width: `${30 + i * 3}%`, marginTop: 8, opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes mdsSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function PtrCol({ dark }: { dark: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '8px 16px 2px' }}>
          <VariantLabel text="A · Idle (at rest)" dark={dark} />
        </div>
        <div style={{ height: 200 }}>
          <PtrState state="idle" dark={dark} />
        </div>
        <div style={{ padding: '8px 16px 2px' }}>
          <VariantLabel text="B · Pulling (user dragging ~60 px)" dark={dark} />
        </div>
        <div style={{ height: 200 }}>
          <PtrState state="pulling" dark={dark} />
        </div>
        <div style={{ padding: '8px 16px 2px' }}>
          <VariantLabel text="C · Refreshing (released, loading)" dark={dark} />
        </div>
        <div style={{ height: 200 }}>
          <PtrState state="refreshing" dark={dark} />
        </div>
      </div>
    </div>
  );
}

/* ─── §15 Empty state ───────────────────────────────────────────────── */

function EmptyCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ height: MDS.safeTop }} />
      <div style={{
        height: MDS.headerH, display: 'flex', alignItems: 'center', padding: '0 8px',
        borderBottom: `1px solid ${t.border}`, background: t.surface,
      }}>
        <div style={{ width: 48, height: 48 }} />
        <div style={{ flex: 1, textAlign: 'center', fontFamily: F.inter, fontSize: '17px', fontWeight: 600, color: t.text1 }}>
          Карты
        </div>
        <div style={{ width: 48 }} />
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', textAlign: 'center',
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: dark ? 'rgba(59,130,246,0.12)' : '#EFF6FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <FileX size={48} color={t.text4} strokeWidth={1.5} />
        </div>
        <h3 style={{
          fontFamily: F.dm, fontSize: '20px', fontWeight: 600,
          color: t.text2, margin: '0 0 8px',
        }}>
          Карты не найдены
        </h3>
        <p style={{
          fontFamily: F.inter, fontSize: '15px', color: t.text3,
          lineHeight: 1.5, margin: 0, maxWidth: 280,
        }}>
          Попробуйте изменить фильтры или импортировать новую партию карт.
        </p>
        <button style={{
          marginTop: 24, width: '100%', maxWidth: 260, height: 48, borderRadius: 12,
          background: t.blue, border: 'none',
          fontFamily: F.inter, fontSize: '16px', fontWeight: 600, color: '#FFFFFF',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Package size={18} strokeWidth={2} /> Импортировать партию
        </button>
        <button style={{
          marginTop: 8, width: '100%', maxWidth: 260, height: 44,
          border: 'none', background: 'transparent',
          fontFamily: F.inter, fontSize: '15px', fontWeight: 500, color: t.blue,
        }}>
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
}

/* ─── §16 Skeleton loaders ──────────────────────────────────────────── */

function Shimmer({ width, height, dark, radius = 6 }: { width: number | string; height: number; dark: boolean; radius?: number }) {
  const t = theme(dark);
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: `linear-gradient(90deg, ${t.skeletonBase} 0%, ${t.skeletonShimmer} 50%, ${t.skeletonBase} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'mdsShimmer 1.5s linear infinite',
    }} />
  );
}

function SkeletonCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ height: MDS.safeTop }} />

      {/* Stat card skeleton */}
      <div style={{ padding: '16px' }}>
        <VariantLabel text="Stat card skeleton (2-col grid)" dark={dark} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[0,1].map(i => (
            <div key={i} style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 16, padding: 14,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <Shimmer width={40} height={40} dark={dark} radius={20} />
              <Shimmer width="60%" height={10} dark={dark} />
              <Shimmer width="45%" height={22} dark={dark} />
            </div>
          ))}
        </div>
      </div>

      {/* List skeleton */}
      <div style={{ padding: '0 16px 16px' }}>
        <VariantLabel text="List row skeleton (6 rows · varying widths)" dark={dark} />
      </div>
      <div style={{ background: t.surface, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: i < 5 ? `1px solid ${t.border}` : 'none',
          }}>
            <Shimmer width={32} height={32} dark={dark} radius={16} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Shimmer width={`${55 + i * 5}%`} height={12} dark={dark} />
              <Shimmer width={`${25 + i * 4}%`} height={10} dark={dark} />
            </div>
            <Shimmer width={44} height={14} dark={dark} />
          </div>
        ))}
      </div>

      <div style={{ padding: '16px', fontFamily: F.mono, fontSize: '11px', color: t.text3, lineHeight: 1.6 }}>
        Shimmer: linear-gradient 200% wide, translated 1.5 s linear infinite.<br />
        Base: skeletonBase  ·  Highlight: skeletonShimmer
      </div>
      <style>{`@keyframes mdsShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC
═══════════════════════════════════════════════════════════════════════════ */

export const M_Feedback = {
  Toasts: ({ t: _t }: { t: T }) => (
    <Pair height={760} note="4 variants shown stacked for reference. In practice only one toast displays at a time — newer replaces older. Bottom anchor, above tab bar.">
      {(dark) => <ToastsCol dark={dark} />}
    </Pair>
  ),
  PullToRefresh: ({ t: _t }: { t: T }) => (
    <Pair height={720} note="Three states of the same list. A idle, B pulling (rotated dial), C refreshing (spinning). Haptic tick on release if supported.">
      {(dark) => <PtrCol dark={dark} />}
    </Pair>
  ),
  Empty: ({ t: _t }: { t: T }) => (
    <Pair height={800} note="Centered 96 px tinted circle + 48 px icon, DM Sans 20/600 heading, 15 px muted subtext clamped to 280 px, primary CTA + ghost secondary.">
      {(dark) => <EmptyCol dark={dark} />}
    </Pair>
  ),
  Skeleton: ({ t: _t }: { t: T }) => (
    <Pair height={760} note="Stat card skeleton (2×1 row) + 6-row list skeleton. Shimmer is a 1.5 s linear-gradient background-position animation.">
      {(dark) => <SkeletonCol dark={dark} />}
    </Pair>
  ),
};
