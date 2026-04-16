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

   Developer reference: 3 canonical states (first / middle / last page)
   rendered side-by-side as light + dark pinned variants. The matrix cells
   do NOT respond to the global theme toggle — each <PaginationBar /> gets
   an explicit `dark={true|false}` prop.
═══════════════════════════════════════════════════════════════════════════ */

const TOTAL = 1284;

const LIGHT_BG      = '#F9FAFB';
const LIGHT_BORDER  = '#E5E7EB';
const DARK_BG       = '#0F1117';
const DARK_BORDER   = '#2D3148';

interface DemoState { page: number; pageSize: number; }
type States = { s1: DemoState; s2: DemoState; s3: DemoState };

const INITIAL: States = {
  s1: { page: 1,   pageSize: 10 },
  s2: { page: 5,   pageSize: 20 },
  s3: { page: 26,  pageSize: 50 },
};

export default function PaginationShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const navigate = useNavigate();

  // Each theme column has its own independent state so users can click
  // around in both without one affecting the other.
  const [light, setLight] = useState<States>(INITIAL);
  const [dark, setDark]   = useState<States>(INITIAL);

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
            Prompt 0 §4 — enhanced pagination с селектором размера страницы. Каждая пара рендерится
            pinned light + pinned dark для наглядного сравнения.
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
              {' '}Передай <code style={inlineCode(t)}>storageKey</code>{' '}
              (например <code style={inlineCode(t)}>"announcements"</code>) — значение сохраняется в{' '}
              <code style={inlineCode(t)}>pagesize:announcements</code>.
            </div>
          </div>

          {/* ── 3 states, each rendered as Light + Dark matrix row ── */}
          <MatrixSection
            t={t}
            caption="State 1 — First page (страница 1 из 129)"
            light={
              <PaginationBar
                dark={false}
                total={TOTAL} page={light.s1.page} pageSize={light.s1.pageSize}
                onPageChange={p => setLight(s => ({ ...s, s1: { ...s.s1, page: p } }))}
                onPageSizeChange={sz => setLight(s => ({ ...s, s1: { page: 1, pageSize: sz } }))}
              />
            }
            dark={
              <PaginationBar
                dark={true}
                total={TOTAL} page={dark.s1.page} pageSize={dark.s1.pageSize}
                onPageChange={p => setDark(s => ({ ...s, s1: { ...s.s1, page: p } }))}
                onPageSizeChange={sz => setDark(s => ({ ...s, s1: { page: 1, pageSize: sz } }))}
              />
            }
          />

          <MatrixSection
            t={t}
            caption="State 2 — Middle page (страница 5 из 65)"
            light={
              <PaginationBar
                dark={false}
                total={TOTAL} page={light.s2.page} pageSize={light.s2.pageSize}
                onPageChange={p => setLight(s => ({ ...s, s2: { ...s.s2, page: p } }))}
                onPageSizeChange={sz => setLight(s => ({ ...s, s2: { page: 1, pageSize: sz } }))}
              />
            }
            dark={
              <PaginationBar
                dark={true}
                total={TOTAL} page={dark.s2.page} pageSize={dark.s2.pageSize}
                onPageChange={p => setDark(s => ({ ...s, s2: { ...s.s2, page: p } }))}
                onPageSizeChange={sz => setDark(s => ({ ...s, s2: { page: 1, pageSize: sz } }))}
              />
            }
          />

          <MatrixSection
            t={t}
            caption="State 3 — Last page (страница 26 из 26)"
            light={
              <PaginationBar
                dark={false}
                total={TOTAL} page={light.s3.page} pageSize={light.s3.pageSize}
                onPageChange={p => setLight(s => ({ ...s, s3: { ...s.s3, page: p } }))}
                onPageSizeChange={sz => setLight(s => ({ ...s, s3: { page: 1, pageSize: sz } }))}
              />
            }
            dark={
              <PaginationBar
                dark={true}
                total={TOTAL} page={dark.s3.page} pageSize={dark.s3.pageSize}
                onPageChange={p => setDark(s => ({ ...s, s3: { ...s.s3, page: p } }))}
                onPageSizeChange={sz => setDark(s => ({ ...s, s3: { page: 1, pageSize: sz } }))}
              />
            }
          />

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MATRIX SECTION — one row caption + 2 pinned cells
═══════════════════════════════════════════════════════════════════════════ */

function MatrixSection({ t, caption, light, dark }: {
  t: T; caption: string;
  light: React.ReactNode; dark: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
        marginBottom: '10px',
      }}>
        {caption}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <PinnedCell tone="light">{light}</PinnedCell>
        <PinnedCell tone="dark">{dark}</PinnedCell>
      </div>
    </div>
  );
}

function PinnedCell({ tone, children }: { tone: 'light' | 'dark'; children: React.ReactNode }) {
  const isDark = tone === 'dark';

  // Every color in the pinned cell is locked — no theme() lookup.
  const pageBg       = isDark ? DARK_BG            : LIGHT_BG;
  const pageBorder   = isDark ? DARK_BORDER        : LIGHT_BORDER;
  const surface      = isDark ? D.surface          : C.surface;
  const border       = isDark ? D.border           : C.border;
  const headerBg     = isDark ? D.tableHeaderBg    : C.tableHeaderBg;
  const headerClr    = isDark ? D.text4            : C.text4;
  const rowsClr      = isDark ? D.text4            : C.text4;
  const labelClr     = isDark ? D.text3            : C.text3;
  const swatchBg     = isDark ? D.surface          : '#FFFFFF';
  const swatchBorder = isDark ? D.border           : C.border;

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontFamily: F.inter, fontSize: '11px', fontWeight: 700,
        color: labelClr, textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '8px', padding: '0 4px',
      }}>
        <span style={{
          width: '10px', height: '10px', borderRadius: '3px',
          background: swatchBg, border: `1px solid ${swatchBorder}`,
        }} />
        {tone}
      </div>

      <div style={{
        background: pageBg, border: `1px solid ${pageBorder}`,
        borderRadius: '12px', padding: '20px',
      }}>
        <div style={{
          background: surface, border: `1px solid ${border}`,
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <div style={{
            height: '44px',
            background: headerBg,
            borderBottom: `1px solid ${border}`,
            display: 'flex', alignItems: 'center', padding: '0 16px',
            fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
            color: headerClr, textTransform: 'uppercase', letterSpacing: '0.04em',
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
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function inlineCode(t: T): React.CSSProperties {
  return {
    fontFamily: F.mono, fontSize: '12px',
    padding: '1px 6px', borderRadius: '4px',
    background: t.surface, border: `1px solid ${t.blueTint}`,
    color: t.blue,
  };
}
