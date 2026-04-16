import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   SKELETON SHOWCASE — 6 variants (Prompt 0)

   Developer reference: every variant renders TWICE, pinned to light and
   dark. The global theme toggle only drives the page shell — matrix cells
   are locked via the `dark` prop on each skeleton helper.

   Shimmer: linear-gradient moves across background-size 200% 100% in 1.5s.
═══════════════════════════════════════════════════════════════════════════ */

const LIGHT_BG      = '#F9FAFB';
const LIGHT_BORDER  = '#E5E7EB';
const DARK_BG       = '#0F1117';
const DARK_BORDER   = '#2D3148';

export default function SkeletonStatesShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar
        role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span
              onClick={() => navigate('/design-system')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}
            >
              Дизайн-система
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Скелетоны</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '22px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              Скелетоны загрузки
            </h1>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
              6 вариантов из Prompt 0 · shimmer 1.5s linear infinite · Light + Dark reference matrix
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <MatrixSection t={t} caption="1. ТАБЛИЦА — B-02, B-07, C-02, C-04, M-04, M-05">
              <TableSkeleton dark={false} />
              <TableSkeleton dark={true} />
            </MatrixSection>

            <MatrixSection t={t} caption="2. СТАТ-КАРТОЧКИ — B-01, C-01 dashboard top row">
              <StatCardsSkeleton dark={false} />
              <StatCardsSkeleton dark={true} />
            </MatrixSection>

            <MatrixSection t={t} caption="3. KPI STEPPER — B-08 card detail">
              <KpiStepperSkeleton dark={false} />
              <KpiStepperSkeleton dark={true} />
            </MatrixSection>

            <MatrixSection t={t} caption="4. ГРАФИКИ — B-09 donut, C-06 bar chart">
              <ChartsSkeleton dark={false} />
              <ChartsSkeleton dark={true} />
            </MatrixSection>

            <MatrixSection t={t} caption="5. ПОЛНАЯ СТРАНИЦА — первая загрузка">
              <FullPageSkeleton dark={false} />
              <FullPageSkeleton dark={true} />
            </MatrixSection>

            <MatrixSection t={t} caption="6. ФИЛЬТР-БАР">
              <FilterBarSkeleton dark={false} />
              <FilterBarSkeleton dark={true} />
            </MatrixSection>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0;  }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MATRIX SECTION — caption + 2-column Light/Dark grid with pinned cells
═══════════════════════════════════════════════════════════════════════════ */

function MatrixSection({ t, caption, children }: { t: T; caption: string; children: [React.ReactNode, React.ReactNode] }) {
  const [light, dark] = children;
  return (
    <div>
      <div style={{
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
        marginBottom: '10px',
      }}>
        {caption}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <MatrixCell tone="light">{light}</MatrixCell>
        <MatrixCell tone="dark">{dark}</MatrixCell>
      </div>
    </div>
  );
}

function MatrixCell({ tone, children }: { tone: 'light' | 'dark'; children: React.ReactNode }) {
  const isDark = tone === 'dark';
  const bg = isDark ? DARK_BG : LIGHT_BG;
  const border = isDark ? DARK_BORDER : LIGHT_BORDER;
  const labelColor = isDark ? D.text3 : C.text3;
  const swatchBg = isDark ? D.surface : '#FFFFFF';
  const swatchBorder = isDark ? D.border : C.border;

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontFamily: F.inter, fontSize: '11px', fontWeight: 700,
        color: labelColor, textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '8px', padding: '0 4px',
      }}>
        <span style={{
          width: '10px', height: '10px', borderRadius: '3px',
          background: swatchBg, border: `1px solid ${swatchBorder}`,
        }} />
        {tone}
      </div>
      <div style={{
        background: bg, border: `1px solid ${border}`,
        borderRadius: '12px', padding: '24px',
      }}>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKELETON PRIMITIVE — reads its colors from the `dark` prop
═══════════════════════════════════════════════════════════════════════════ */

function Skeleton({ width, height = 12, radius = 4, shape = 'rect', dark = false, style }: {
  width?: string | number;
  height?: number;
  radius?: number;
  shape?: 'rect' | 'circle';
  dark?: boolean;
  style?: React.CSSProperties;
}) {
  const isCircle = shape === 'circle';
  const resolvedWidth = typeof width === 'number' ? `${width}px` : (width ?? '100%');
  const resolvedRadius = isCircle ? '50%' : `${radius}px`;
  const base     = dark ? D.skeletonBase    : C.skeletonBase;      // #2D3148 / #E5E7EB
  const shimmer  = dark ? D.skeletonShimmer : C.skeletonShimmer;   // #363B52 / #F3F4F6

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: resolvedWidth,
        height: `${height}px`,
        borderRadius: resolvedRadius,
        background: `linear-gradient(90deg, ${base} 0%, ${shimmer} 50%, ${base} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.5s linear infinite',
        verticalAlign: 'middle',
        ...style,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. TABLE SKELETON
═══════════════════════════════════════════════════════════════════════════ */

const TABLE_COLUMNS = [
  { label: 'ID',        width: 44  as number | undefined, cellWidth: [32, 40] },
  { label: 'Название',  width: undefined,                 cellWidth: [110, 140] },
  { label: 'Статус',    width: 110,                        cellWidth: [80, 100] },
  { label: 'Канал',     width: 120,                        cellWidth: [70, 95] },
  { label: 'Дата',      width: 110,                        cellWidth: [70, 90] },
  { label: 'Метрика',   width: 110,                        cellWidth: [50, 80] },
];

// Seeded pseudo-random (stable across renders)
function pseudoRand(seed: number) {
  return ((Math.sin(seed) * 10000) % 1 + 1) % 1;
}

function TableSkeleton({ dark = false }: { dark?: boolean }) {
  const rows = 8;
  const surface     = dark ? D.surface        : C.surface;
  const border      = dark ? D.border         : C.border;
  const headerBg    = dark ? D.tableHeaderBg  : C.tableHeaderBg;
  const headerText  = dark ? D.text4          : C.text4;

  return (
    <div style={{
      background: surface, border: `1px solid ${border}`,
      borderRadius: '12px', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: TABLE_COLUMNS.map(c => c.width ? `${c.width}px` : '1fr').join(' '),
        background: headerBg, borderBottom: `1px solid ${border}`,
      }}>
        {TABLE_COLUMNS.map(col => (
          <div
            key={col.label}
            style={{
              padding: '12px 14px',
              fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
              color: headerText, textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Body */}
      {Array.from({ length: rows }).map((_, ri) => (
        <div
          key={ri}
          style={{
            display: 'grid',
            gridTemplateColumns: TABLE_COLUMNS.map(c => c.width ? `${c.width}px` : '1fr').join(' '),
            borderBottom: ri === rows - 1 ? 'none' : `1px solid ${border}`,
          }}
        >
          {TABLE_COLUMNS.map((col, ci) => {
            const [lo, hi] = col.cellWidth;
            const r = pseudoRand(ri * 11 + ci * 7);
            const w = Math.round(lo + r * (hi - lo));
            return (
              <div key={col.label} style={{ padding: '14px' }}>
                <Skeleton width={w} height={12} dark={dark} />
              </div>
            );
          })}
        </div>
      ))}

      {/* Pagination */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderTop: `1px solid ${border}`,
      }}>
        <Skeleton width={180} height={12} dark={dark} />
        <div style={{ display: 'flex', gap: '6px' }}>
          <Skeleton width={32} height={28} radius={6} dark={dark} />
          <Skeleton width={60} height={28} radius={6} dark={dark} />
          <Skeleton width={32} height={28} radius={6} dark={dark} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. STAT CARDS SKELETON
═══════════════════════════════════════════════════════════════════════════ */

function StatCardsSkeleton({ dark = false }: { dark?: boolean }) {
  const surface = dark ? D.surface : C.surface;
  const border  = dark ? D.border  : C.border;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
    }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: surface, border: `1px solid ${border}`,
            borderRadius: '12px', padding: '16px',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}
        >
          <Skeleton width={40} height={40} radius={10} dark={dark} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width={80} height={10} dark={dark} />
            <Skeleton width={100} height={20} dark={dark} />
            <Skeleton width={50} height={10} dark={dark} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. KPI STEPPER SKELETON
═══════════════════════════════════════════════════════════════════════════ */

function KpiStepperSkeleton({ dark = false }: { dark?: boolean }) {
  const surface      = dark ? D.surface : C.surface;
  const connectorClr = dark ? D.border  : C.border;
  return (
    <div style={{ position: 'relative', paddingLeft: '16px' }}>
      {/* Vertical connector line (dashed muted) */}
      <div style={{
        position: 'absolute', left: '31px', top: '16px', bottom: '16px',
        width: '2px',
        background: `repeating-linear-gradient(to bottom, ${connectorClr} 0, ${connectorClr} 4px, transparent 4px, transparent 8px)`,
      }} />

      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '16px',
            position: 'relative', zIndex: 1,
            paddingBottom: i === 2 ? 0 : '20px',
          }}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: surface, border: `2px solid ${surface}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Skeleton width={32} height={32} shape="circle" dark={dark} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
            <Skeleton width={120} height={12} dark={dark} />
            <Skeleton width={200} height={10} dark={dark} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. CHART SKELETON — donut + bar
═══════════════════════════════════════════════════════════════════════════ */

function ChartsSkeleton({ dark = false }: { dark?: boolean }) {
  const surface   = dark ? D.surface      : C.surface;
  const border    = dark ? D.border       : C.border;
  const donutBase = dark ? D.skeletonBase : C.skeletonBase;
  const donutHole = dark ? D.surface      : '#F9FAFB';

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
    }}>
      {/* Donut */}
      <div style={{
        background: surface, border: `1px solid ${border}`,
        borderRadius: '12px', padding: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '180px', height: '180px', borderRadius: '50%',
          background: `conic-gradient(${donutBase} 0 360deg)`,
          position: 'relative',
          animation: 'skeletonShimmer 1.5s linear infinite',
          backgroundSize: '200% 100%',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '116px', height: '116px', borderRadius: '50%',
            background: donutHole,
          }} />
        </div>
      </div>

      {/* Horizontal bars */}
      <div style={{
        background: surface, border: `1px solid ${border}`,
        borderRadius: '12px', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {[88, 72, 60, 50, 42, 30].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Skeleton width={60} height={10} dark={dark} />
            <div style={{ flex: 1 }}>
              <Skeleton width={`${w}%`} height={14} radius={4} dark={dark} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. FULL PAGE SKELETON
═══════════════════════════════════════════════════════════════════════════ */

function FullPageSkeleton({ dark = false }: { dark?: boolean }) {
  const innerBg = dark ? D.pageBg : C.pageBg;
  return (
    <div style={{
      background: innerBg, borderRadius: '10px',
      padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}>
      {/* Title + subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width={200} height={24} radius={6} dark={dark} />
        <Skeleton width={300} height={14} dark={dark} />
      </div>

      {/* Stat cards row */}
      <StatCardsSkeleton dark={dark} />

      {/* Filter bar */}
      <FilterBarSkeleton dark={dark} />

      {/* Table */}
      <TableSkeleton dark={dark} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. FILTER BAR SKELETON
═══════════════════════════════════════════════════════════════════════════ */

function FilterBarSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
      <Skeleton width={280} height={40} radius={8} dark={dark} />
      <Skeleton width={160} height={40} radius={8} dark={dark} />
      <Skeleton width={160} height={40} radius={8} dark={dark} />
      <Skeleton width={160} height={40} radius={8} dark={dark} />
    </div>
  );
}
