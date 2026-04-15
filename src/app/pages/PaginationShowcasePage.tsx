import React, { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PaginationBar } from '../components/PaginationBar';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   PAGINATION SHOWCASE — Prompt 0 §4
   3 canonical states (first, mid, last page) rendered side-by-side in
   both light and dark variants.
═══════════════════════════════════════════════════════════════════════════ */

const TOTAL = 1284;

interface DemoState { page: number; pageSize: number; }
type States = { s1: DemoState; s2: DemoState; s3: DemoState };

export default function PaginationShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const navigate = useNavigate();

  // Each theme column has its own independent state so users can click around
  // in both without one affecting the other.
  const [light, setLight] = useState<States>({
    s1: { page: 1,   pageSize: 10 },
    s2: { page: 5,   pageSize: 20 },
    s3: { page: 26,  pageSize: 50 },
  });
  const [dark, setDark] = useState<States>({
    s1: { page: 1,   pageSize: 10 },
    s2: { page: 5,   pageSize: 20 },
    s3: { page: 26,  pageSize: 50 },
  });

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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Pagination</span>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
            Pagination bar
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '6px 0 16px', lineHeight: 1.5 }}>
            Prompt 0 §4 — enhanced pagination с селектором размера страницы. Заменяет inline-пагинацию на всех табличных страницах.
          </p>

          {/* Dev note */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '12px 14px',
            background: t.blueLt, borderLeft: `3px solid ${t.blue}`,
            borderRadius: '8px', marginBottom: '20px',
          }}>
            <Info size={16} color={t.blue} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 500, color: t.text1 }}>Page size preference persists in localStorage across all tables.</span>
              {' '}Передай <code style={{
                fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
                background: t.surface, border: `1px solid ${t.blueTint}`,
                color: t.blue, borderRadius: '4px',
              }}>storageKey</code>{' '}
              (например <code style={{
                fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
                background: t.surface, border: `1px solid ${t.blueTint}`,
                color: t.blue, borderRadius: '4px',
              }}>"announcements"</code>) — значение сохраняется в{' '}
              <code style={{
                fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
                background: t.surface, border: `1px solid ${t.blueTint}`,
                color: t.blue, borderRadius: '4px',
              }}>pagesize:announcements</code>.
            </div>
          </div>

          {/* ── 3 states × 2 themes grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <ColumnHeader t={t} tone="light" />
            <ColumnHeader t={t} tone="dark" />

            <RowCaption t={t} text="State 1 — First page (страница 1 из 129)" span={2} />
            <VariantCell dark={false}>
              <PaginationBar
                dark={false}
                total={TOTAL} page={light.s1.page} pageSize={light.s1.pageSize}
                onPageChange={p => setLight(s => ({ ...s, s1: { ...s.s1, page: p } }))}
                onPageSizeChange={sz => setLight(s => ({ ...s, s1: { page: 1, pageSize: sz } }))}
              />
            </VariantCell>
            <VariantCell dark={true}>
              <PaginationBar
                dark={true}
                total={TOTAL} page={dark.s1.page} pageSize={dark.s1.pageSize}
                onPageChange={p => setDark(s => ({ ...s, s1: { ...s.s1, page: p } }))}
                onPageSizeChange={sz => setDark(s => ({ ...s, s1: { page: 1, pageSize: sz } }))}
              />
            </VariantCell>

            <RowCaption t={t} text="State 2 — Middle page (страница 5 из 65)" span={2} />
            <VariantCell dark={false}>
              <PaginationBar
                dark={false}
                total={TOTAL} page={light.s2.page} pageSize={light.s2.pageSize}
                onPageChange={p => setLight(s => ({ ...s, s2: { ...s.s2, page: p } }))}
                onPageSizeChange={sz => setLight(s => ({ ...s, s2: { page: 1, pageSize: sz } }))}
              />
            </VariantCell>
            <VariantCell dark={true}>
              <PaginationBar
                dark={true}
                total={TOTAL} page={dark.s2.page} pageSize={dark.s2.pageSize}
                onPageChange={p => setDark(s => ({ ...s, s2: { ...s.s2, page: p } }))}
                onPageSizeChange={sz => setDark(s => ({ ...s, s2: { page: 1, pageSize: sz } }))}
              />
            </VariantCell>

            <RowCaption t={t} text="State 3 — Last page (страница 26 из 26)" span={2} />
            <VariantCell dark={false}>
              <PaginationBar
                dark={false}
                total={TOTAL} page={light.s3.page} pageSize={light.s3.pageSize}
                onPageChange={p => setLight(s => ({ ...s, s3: { ...s.s3, page: p } }))}
                onPageSizeChange={sz => setLight(s => ({ ...s, s3: { page: 1, pageSize: sz } }))}
              />
            </VariantCell>
            <VariantCell dark={true}>
              <PaginationBar
                dark={true}
                total={TOTAL} page={dark.s3.page} pageSize={dark.s3.pageSize}
                onPageChange={p => setDark(s => ({ ...s, s3: { ...s.s3, page: p } }))}
                onPageSizeChange={sz => setDark(s => ({ ...s, s3: { page: 1, pageSize: sz } }))}
              />
            </VariantCell>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function ColumnHeader({ t, tone }: { t: T; tone: 'light' | 'dark' }) {
  const isDark = tone === 'dark';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 700,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.08em',
      padding: '0 4px',
    }}>
      <span style={{
        width: '10px', height: '10px', borderRadius: '3px',
        background: isDark ? D.surface : '#FFFFFF',
        border: `1px solid ${isDark ? D.border : C.border}`,
      }} />
      {tone}
    </div>
  );
}

function RowCaption({ t, text, span }: { t: T; text: string; span: number }) {
  return (
    <div style={{
      gridColumn: `span ${span}`,
      padding: '12px 4px 4px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {text}
    </div>
  );
}

function VariantCell({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  const bg      = dark ? D.surface : C.surface;
  const border  = dark ? D.border  : C.border;
  const hdrBg   = dark ? D.tableHeaderBg : C.tableHeaderBg;
  const hdrClr  = dark ? D.text4  : C.text4;
  const rowsClr = dark ? D.text4  : C.text4;
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`,
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{
        height: '44px',
        background: hdrBg,
        borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center', padding: '0 16px',
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: hdrClr, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        Пример таблицы (заголовок)
      </div>
      <div style={{
        height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.inter, fontSize: '12px', color: rowsClr,
      }}>
        (строки таблицы)
      </div>
      {children}
    </div>
  );
}
