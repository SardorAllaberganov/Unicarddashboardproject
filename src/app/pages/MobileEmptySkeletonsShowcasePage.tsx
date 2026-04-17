import React, { useState } from 'react';
import {
  ChevronRight, Upload, Users, Bell, SearchX, Clock, WifiOff, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, MDS, SectionBlock } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE EMPTY STATES + SKELETONS + PTR — references X-00 §15, §16
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Shared screen chrome ────────────────────────────────────────────── */

function ScreenChrome({ title, children, dark }: { title: string; children: React.ReactNode; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      {/* Fake status bar */}
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
      <div style={{ flex: 1, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

/* ─── Empty state primitive ────────────────────────────────────────────── */

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  t,
  dark,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: { label: string; variant: 'primary' | 'ghost' | 'outline' };
  t: T;
  dark: boolean;
}) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 24px 48px', textAlign: 'center',
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: dark ? 'rgba(160,165,184,0.10)' : '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
      }}>
        <Icon size={40} color={t.text4} strokeWidth={1.5} />
      </div>
      <h2 style={{
        fontFamily: F.dm, fontSize: 20, fontWeight: 700, color: t.text1,
        margin: '0 0 8px', lineHeight: 1.3,
      }}>
        {title}
      </h2>
      <p style={{
        fontFamily: F.inter, fontSize: 15, color: t.text3,
        margin: 0, lineHeight: 1.5, maxWidth: 280,
      }}>
        {description}
      </p>
      {action && (
        <div style={{ marginTop: 20, width: '100%', maxWidth: 280 }}>
          {action.variant === 'primary' && (
            <button style={{
              width: '100%', height: 48, borderRadius: 12, border: 'none',
              background: t.blue,
              fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: '#FFFFFF',
              cursor: 'pointer',
            }}>
              {action.label}
            </button>
          )}
          {action.variant === 'outline' && (
            <button style={{
              width: '100%', height: 48, borderRadius: 12,
              border: `1.5px solid ${t.inputBorder}`, background: 'transparent',
              fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1,
              cursor: 'pointer',
            }}>
              {action.label}
            </button>
          )}
          {action.variant === 'ghost' && (
            <button style={{
              width: '100%', height: 48, borderRadius: 12,
              border: 'none', background: 'transparent',
              fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.blue,
              cursor: 'pointer',
            }}>
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Skeleton primitives ─────────────────────────────────────────────── */

function Shimmer({ w, h, radius = 4, t, dark, inline = false }: {
  w: number | string; h: number; radius?: number; t: T; dark: boolean; inline?: boolean;
}) {
  const base = dark ? '#2D3148' : '#E5E7EB';
  const hi = dark ? '#3A3F50' : '#F3F4F6';
  return (
    <div style={{
      display: inline ? 'inline-block' : 'block',
      width: w, height: h, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(90deg, ${base} 0%, ${hi} 50%, ${base} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'mdsShimmer 1.4s ease-in-out infinite',
    }} />
  );
}

function SkeletonListRows({ t, dark }: { t: T; dark: boolean }) {
  return (
    <div style={{
      margin: '16px',
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
      overflow: 'hidden',
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px',
          borderBottom: i < 5 ? `1px solid ${t.border}` : 'none',
        }}>
          <Shimmer w={40} h={40} radius={20} t={t} dark={dark} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Shimmer w={120} h={14} t={t} dark={dark} />
            <Shimmer w={200} h={12} t={t} dark={dark} />
          </div>
          <Shimmer w={60} h={14} t={t} dark={dark} />
        </div>
      ))}
    </div>
  );
}

function SkeletonStatCards({ t, dark }: { t: T; dark: boolean }) {
  return (
    <div style={{
      padding: '16px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
    }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
          padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <Shimmer w={48} h={48} radius={24} t={t} dark={dark} />
          <Shimmer w={80} h={10} t={t} dark={dark} />
          <Shimmer w={100} h={20} t={t} dark={dark} />
        </div>
      ))}
    </div>
  );
}

function SkeletonKpiStepper({ t, dark }: { t: T; dark: boolean }) {
  return (
    <div style={{
      margin: 16, padding: 16,
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shimmer w={32} h={32} radius={16} t={t} dark={dark} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Shimmer w="70%" h={14} t={t} dark={dark} />
            <Shimmer w="40%" h={11} t={t} dark={dark} />
          </div>
          <Shimmer w={44} h={14} t={t} dark={dark} />
        </div>
      ))}
    </div>
  );
}

function SkeletonDetailPage({ t, dark }: { t: T; dark: boolean }) {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero card */}
      <div style={{
        height: 160, borderRadius: 20, overflow: 'hidden',
        background: `linear-gradient(90deg, ${dark ? '#2D3148' : '#E5E7EB'} 0%, ${dark ? '#3A3F50' : '#F3F4F6'} 50%, ${dark ? '#2D3148' : '#E5E7EB'} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'mdsShimmer 1.4s ease-in-out infinite',
      }} />
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
            padding: 12, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <Shimmer w={36} h={36} radius={18} t={t} dark={dark} />
            <Shimmer w="70%" h={10} t={t} dark={dark} />
            <Shimmer w="55%" h={16} t={t} dark={dark} />
          </div>
        ))}
      </div>
      {/* Section blocks */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Shimmer w={120} h={11} t={t} dark={dark} />
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
            padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <Shimmer w="90%" h={14} t={t} dark={dark} />
            <Shimmer w="70%" h={12} t={t} dark={dark} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── PTR states ──────────────────────────────────────────────────────── */

function FakeListRow({ t, dark, fade = false }: { t: T; dark: boolean; fade?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: `1px solid ${t.border}`, opacity: fade ? 0.55 : 1,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.blueLt, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 12, width: '60%', background: t.border, borderRadius: 3 }} />
        <div style={{ height: 10, width: '80%', background: t.border, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function PtrIdle({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <ScreenChrome title="Уведомления" dark={dark}>
      <div style={{ background: t.surface, margin: 16, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {Array.from({ length: 6 }).map((_, i) => <FakeListRow key={i} t={t} dark={dark} />)}
      </div>
    </ScreenChrome>
  );
}

function PtrPulling({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <ScreenChrome title="Уведомления" dark={dark}>
      {/* Partial spinner */}
      <div style={{
        height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.pageBg,
      }}>
        <Loader2 size={22} color={t.blue} style={{
          transform: 'rotate(120deg)',
          opacity: 0.6,
        }} />
      </div>
      <div style={{ background: t.surface, margin: '0 16px 16px', border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden', transform: 'translateY(8px)' }}>
        {Array.from({ length: 5 }).map((_, i) => <FakeListRow key={i} t={t} dark={dark} />)}
      </div>
    </ScreenChrome>
  );
}

function PtrRefreshing({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <ScreenChrome title="Уведомления" dark={dark}>
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.pageBg,
      }}>
        <Loader2 size={22} color={t.blue} style={{ animation: 'mdsSpin 1s linear infinite' }} />
      </div>
      <div style={{ background: t.surface, margin: '0 16px 16px', border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {Array.from({ length: 5 }).map((_, i) => <FakeListRow key={i} t={t} dark={dark} fade />)}
      </div>
    </ScreenChrome>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT WRAPPERS (empty states inside screen chrome)
═══════════════════════════════════════════════════════════════════════════ */

type EmptyVariantDef = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  heading: string;
  description: string;
  action?: { label: string; variant: 'primary' | 'ghost' | 'outline' };
};

const EMPTY_VARIANTS: EmptyVariantDef[] = [
  {
    key: 'cards',
    title: 'No cards',
    subtitle: 'Primary action to start the import flow.',
    icon: Upload,
    heading: 'Нет карт',
    description: 'Импортируйте первую партию карт',
    action: { label: 'Импортировать', variant: 'primary' },
  },
  {
    key: 'sellers',
    title: 'No sellers',
    subtitle: 'Primary action to add the first seller.',
    icon: Users,
    heading: 'Нет продавцов',
    description: 'Добавьте первого продавца',
    action: { label: 'Добавить продавца', variant: 'primary' },
  },
  {
    key: 'notifications',
    title: 'No notifications',
    subtitle: 'Pure info — no action needed.',
    icon: Bell,
    heading: 'Нет уведомлений',
    description: 'Новые уведомления появятся здесь',
  },
  {
    key: 'search',
    title: 'No search results',
    subtitle: 'Ghost action to clear the search.',
    icon: SearchX,
    heading: 'Нет результатов',
    description: 'По запросу ничего не найдено. Проверьте написание.',
    action: { label: 'Очистить поиск', variant: 'ghost' },
  },
  {
    key: 'activity',
    title: 'No activity',
    subtitle: 'Pure info — history will populate over time.',
    icon: Clock,
    heading: 'Нет активности',
    description: 'Здесь появится история операций',
  },
  {
    key: 'offline',
    title: 'No connection',
    subtitle: 'Outline action to retry.',
    icon: WifiOff,
    heading: 'Нет интернета',
    description: 'Проверьте подключение и попробуйте снова',
    action: { label: 'Повторить', variant: 'outline' },
  },
];

function EmptyScreen({ def, dark }: { def: EmptyVariantDef; dark: boolean }) {
  const t = theme(dark);
  return (
    <ScreenChrome title={def.heading} dark={dark}>
      <EmptyState
        icon={def.icon}
        title={def.heading}
        description={def.description}
        action={def.action}
        t={t}
        dark={dark}
      />
    </ScreenChrome>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPEC TABLE
═══════════════════════════════════════════════════════════════════════════ */

const SPEC = [
  { k: 'Empty icon',           v: '40 px lucide · strokeWidth 1.5 · color t.text4 · wrapped in 88 px grey circle' },
  { k: 'Empty title',          v: 'DM Sans 20 / 700 · color t.text1 · margin-bottom 8' },
  { k: 'Empty description',    v: 'Inter 15 · color t.text3 · line-height 1.5 · max-width 280' },
  { k: 'Empty CTA (primary)',  v: 'height 48 · radius 12 · fill t.blue · 15/600 white · max-width 280' },
  { k: 'Empty CTA (outline)',  v: 'height 48 · 1.5 px border inputBorder · transparent · 15/500 text1' },
  { k: 'Empty CTA (ghost)',    v: 'height 48 · no border/bg · 15/500 t.blue' },
  { k: 'Shimmer bar base (L)', v: '#E5E7EB' },
  { k: 'Shimmer bar base (D)', v: '#2D3148' },
  { k: 'Shimmer highlight (L)', v: '#F3F4F6' },
  { k: 'Shimmer highlight (D)', v: '#3A3F50' },
  { k: 'Shimmer animation',    v: 'mdsShimmer · 1.4 s ease-in-out infinite · 200% background-size · translateX sweep' },
  { k: 'List skeleton',        v: '6 rows · 40 circle + 120 title + 200 subtitle + 60 right · all 14-12-14 px tall' },
  { k: 'Stat skeleton',        v: '2×2 grid · 48 icon circle + 80 × 10 label + 100 × 20 value' },
  { k: 'Stepper skeleton',     v: '3 rows · 32 circle + 70% title + 40% subtitle + 44 px right' },
  { k: 'Detail skeleton',      v: 'hero 160 px + 2×2 mini stat + 3 section blocks' },
  { k: 'PTR idle',             v: 'hidden above content — 0 height' },
  { k: 'PTR pulling',          v: '42 px strip · spinner at 60% opacity · rotation follows pull distance' },
  { k: 'PTR refreshing',       v: '56 px strip · spinner animate mdsSpin 1 s linear · list below fades to 0.55 opacity' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileEmptySkeletonsShowcasePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const t = theme(darkMode);

  const skeletonVariants: Array<{ num: string; title: string; subtitle: string; render: (dark: boolean) => React.ReactNode }> = [
    {
      num: '2.1', title: 'List skeleton',
      subtitle: '6 list rows — avatar circle + title + subtitle + right value. Used for Sellers, Cards, Notifications lists.',
      render: (d: boolean) => <ScreenChrome title="Продавцы" dark={d}><SkeletonListRows t={theme(d)} dark={d} /></ScreenChrome>,
    },
    {
      num: '2.2', title: 'Stat card skeleton',
      subtitle: '2×2 grid — 48 px icon circle, label bar, value bar. Used on dashboards while stats load.',
      render: (d: boolean) => <ScreenChrome title="Дашборд" dark={d}><SkeletonStatCards t={theme(d)} dark={d} /></ScreenChrome>,
    },
    {
      num: '2.3', title: 'KPI stepper skeleton',
      subtitle: '3 step rows — 32 px circle + title + subtitle + right value. Used on card-detail and kpi-config.',
      render: (d: boolean) => <ScreenChrome title="KPI прогресс" dark={d}><SkeletonKpiStepper t={theme(d)} dark={d} /></ScreenChrome>,
    },
    {
      num: '2.4', title: 'Detail page skeleton',
      subtitle: 'Full detail-page placeholder: 160 px hero + 2×2 stats + 3 section blocks. Used on Org / Seller / Card detail while fetching.',
      render: (d: boolean) => <ScreenChrome title="Загрузка…" dark={d}><SkeletonDetailPage t={theme(d)} dark={d} /></ScreenChrome>,
    },
  ];

  const ptrVariants = [
    { num: '3.1', title: 'PTR idle',        subtitle: 'Hidden — the scroll container is at the top, no indicator visible.', render: (d: boolean) => <PtrIdle dark={d} /> },
    { num: '3.2', title: 'PTR pulling',     subtitle: 'User is pulling down — partial spinner at 60% opacity, rotation follows pull distance.', render: (d: boolean) => <PtrPulling dark={d} /> },
    { num: '3.3', title: 'PTR refreshing',  subtitle: 'Release reached threshold — fixed spinner, list below fades until refresh completes.', render: (d: boolean) => <PtrRefreshing dark={d} /> },
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
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Empty states · Skeletons · PTR</span>
          </div>

          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            Mobile Empty States · Skeletons · Pull-to-refresh — X-00 §15 §16
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: '0 0 8px', maxWidth: 900 }}>
            Six empty-state variants covering first-use, search, offline, and activity scenarios. Four skeleton loaders for the main list / stat / stepper / detail patterns. Three pull-to-refresh states.
          </p>

          {/* Shimmer keyframes — injected once */}
          <style>{`
            @keyframes mdsShimmer {
              0%   { background-position: 100% 0; }
              100% { background-position: -100% 0; }
            }
            @keyframes mdsSpin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
          `}</style>

          {/* §1 — Empty states */}
          <SectionBlock num="1" title="Empty states — 6 variants" subtitle="Each: 88 px muted icon circle + DM 20/700 title + 15/text3 description (max-width 280) + optional CTA." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {EMPTY_VARIANTS.map(v => (
                <React.Fragment key={v.key}>
                  <PhoneFrame dark={false} height={620} label={`${v.title} · Light`} note={v.subtitle}>
                    <EmptyScreen def={v} dark={false} />
                  </PhoneFrame>
                  <PhoneFrame dark={true} height={620} label={`${v.title} · Dark`}>
                    <EmptyScreen def={v} dark={true} />
                  </PhoneFrame>
                </React.Fragment>
              ))}
            </div>
          </SectionBlock>

          {/* §2 — Skeletons */}
          <SectionBlock num="2" title="Skeleton loaders — 4 variants" subtitle="All bars use t.border base with linear-gradient shimmer animation. Respects reduced-motion where supported." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {skeletonVariants.map(v => (
                <React.Fragment key={v.num}>
                  <PhoneFrame dark={false} height={720} label={`${v.title} · Light`} note={v.subtitle}>
                    {v.render(false)}
                  </PhoneFrame>
                  <PhoneFrame dark={true} height={720} label={`${v.title} · Dark`}>
                    {v.render(true)}
                  </PhoneFrame>
                </React.Fragment>
              ))}
            </div>
          </SectionBlock>

          {/* §3 — Pull-to-refresh */}
          <SectionBlock num="3" title="Pull-to-refresh states" subtitle="Idle (hidden) → pulling (partial spinner) → refreshing (fixed spinner, content faded)." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {ptrVariants.map(v => (
                <React.Fragment key={v.num}>
                  <PhoneFrame dark={false} height={640} label={`${v.title} · Light`} note={v.subtitle}>
                    {v.render(false)}
                  </PhoneFrame>
                  <PhoneFrame dark={true} height={640} label={`${v.title} · Dark`}>
                    {v.render(true)}
                  </PhoneFrame>
                </React.Fragment>
              ))}
            </div>
          </SectionBlock>

          {/* §4 — Spec */}
          <SectionBlock num="4" title="Design tokens" subtitle="All shared specs across empty states, skeletons, and PTR." t={t}>
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
              Mobile Empty · Skeleton · PTR · X-00 §15 §16
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
