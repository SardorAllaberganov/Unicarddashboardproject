import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';

/* ═══════════════════════════════════════════════════════════════════════════
   SKELETON SHOWCASE — 6 variants (Prompt 0)
   Shimmer: linear-gradient moves across background-size 200% 100% in 1.5s.
═══════════════════════════════════════════════════════════════════════════ */

export default function SkeletonStatesShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
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
              style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}
            >
              Дизайн-система
            </span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Скелетоны</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '22px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
              Скелетоны загрузки
            </h1>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
              6 вариантов из Prompt 0 · shimmer 1.5s linear infinite
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ContextFrame caption="1. ТАБЛИЦА — B-02, B-07, C-02, C-04, M-04, M-05">
              <TableSkeleton />
            </ContextFrame>

            <ContextFrame caption="2. СТАТ-КАРТОЧКИ — B-01, C-01 dashboard top row">
              <StatCardsSkeleton />
            </ContextFrame>

            <ContextFrame caption="3. KPI STEPPER — B-08 card detail">
              <KpiStepperSkeleton />
            </ContextFrame>

            <ContextFrame caption="4. ГРАФИКИ — B-09 donut, C-06 bar chart">
              <ChartsSkeleton />
            </ContextFrame>

            <ContextFrame caption="5. ПОЛНАЯ СТРАНИЦА — первая загрузка">
              <FullPageSkeleton />
            </ContextFrame>

            <ContextFrame caption="6. ФИЛЬТР-БАР">
              <FilterBarSkeleton />
            </ContextFrame>
          </div>
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
   CONTEXT FRAME
═══════════════════════════════════════════════════════════════════════════ */

function ContextFrame({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: `1px solid ${C.border}`,
        background: '#F9FAFB',
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {caption}
      </div>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKELETON PRIMITIVE
═══════════════════════════════════════════════════════════════════════════ */

function Skeleton({ width, height = 12, radius = 4, shape = 'rect', style }: {
  width?: string | number;
  height?: number;
  radius?: number;
  shape?: 'rect' | 'circle';
  style?: React.CSSProperties;
}) {
  const isCircle = shape === 'circle';
  const resolvedWidth = typeof width === 'number' ? `${width}px` : (width ?? '100%');
  const resolvedRadius = isCircle ? '50%' : `${radius}px`;

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: resolvedWidth,
        height: `${height}px`,
        borderRadius: resolvedRadius,
        background: 'linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%)',
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

function TableSkeleton() {
  const rows = 8;
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: TABLE_COLUMNS.map(c => c.width ? `${c.width}px` : '1fr').join(' '),
        background: '#F9FAFB', borderBottom: `1px solid ${C.border}`,
      }}>
        {TABLE_COLUMNS.map(col => (
          <div
            key={col.label}
            style={{
              padding: '12px 14px',
              fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
              color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
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
            borderBottom: ri === rows - 1 ? 'none' : `1px solid ${C.border}`,
          }}
        >
          {TABLE_COLUMNS.map((col, ci) => {
            const [lo, hi] = col.cellWidth;
            const r = pseudoRand(ri * 11 + ci * 7);
            const w = Math.round(lo + r * (hi - lo));
            return (
              <div key={col.label} style={{ padding: '14px' }}>
                <Skeleton width={w} height={12} />
              </div>
            );
          })}
        </div>
      ))}

      {/* Pagination */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderTop: `1px solid ${C.border}`,
      }}>
        <Skeleton width={180} height={12} />
        <div style={{ display: 'flex', gap: '6px' }}>
          <Skeleton width={32} height={28} radius={6} />
          <Skeleton width={60} height={28} radius={6} />
          <Skeleton width={32} height={28} radius={6} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. STAT CARDS SKELETON
═══════════════════════════════════════════════════════════════════════════ */

function StatCardsSkeleton() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
    }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '16px',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}
        >
          <Skeleton width={40} height={40} radius={10} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width={80} height={10} />
            <Skeleton width={100} height={20} />
            <Skeleton width={50} height={10} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. KPI STEPPER SKELETON
═══════════════════════════════════════════════════════════════════════════ */

function KpiStepperSkeleton() {
  return (
    <div style={{ position: 'relative', paddingLeft: '16px' }}>
      {/* Vertical connector line (dashed muted) */}
      <div style={{
        position: 'absolute', left: '31px', top: '16px', bottom: '16px',
        width: '2px', background: 'repeating-linear-gradient(to bottom, #E5E7EB 0, #E5E7EB 4px, transparent 4px, transparent 8px)',
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
            background: C.surface, border: `2px solid ${C.surface}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Skeleton width={32} height={32} shape="circle" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
            <Skeleton width={120} height={12} />
            <Skeleton width={200} height={10} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. CHART SKELETON — donut + bar
═══════════════════════════════════════════════════════════════════════════ */

function ChartsSkeleton() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
    }}>
      {/* Donut */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'conic-gradient(#E5E7EB 0 360deg)',
          position: 'relative',
          animation: 'skeletonShimmer 1.5s linear infinite',
          backgroundSize: '200% 100%',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '116px', height: '116px', borderRadius: '50%',
            background: '#F9FAFB',
          }} />
        </div>
      </div>

      {/* Horizontal bars */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {[88, 72, 60, 50, 42, 30].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Skeleton width={60} height={10} />
            <div style={{ flex: 1 }}>
              <Skeleton width={`${w}%`} height={14} radius={4} />
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

function FullPageSkeleton() {
  return (
    <div style={{
      background: C.pageBg, borderRadius: '10px',
      padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}>
      {/* Title + subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width={200} height={24} radius={6} />
        <Skeleton width={300} height={14} />
      </div>

      {/* Stat cards row */}
      <StatCardsSkeleton />

      {/* Filter bar */}
      <FilterBarSkeleton />

      {/* Table */}
      <TableSkeleton />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. FILTER BAR SKELETON
═══════════════════════════════════════════════════════════════════════════ */

function FilterBarSkeleton() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
      <Skeleton width={280} height={40} radius={8} />
      <Skeleton width={160} height={40} radius={8} />
      <Skeleton width={160} height={40} radius={8} />
      <Skeleton width={160} height={40} radius={8} />
    </div>
  );
}
