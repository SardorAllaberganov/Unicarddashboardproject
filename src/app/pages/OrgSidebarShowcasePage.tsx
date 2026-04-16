import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR SHOWCASE — Organization Admin
   Developer reference: 4-quadrant Light/Dark × Expanded/Collapsed matrix.
   Each quadrant renders <Sidebar role="org" /> pinned via the `darkMode`
   prop, so quadrant theme is independent of the global theme preference.
═══════════════════════════════════════════════════════════════════════════ */

const QUADRANTS = [
  { id: 'light-exp',  label: 'Light · Expanded',  dark: false, collapsed: false, width: 260 },
  { id: 'dark-exp',   label: 'Dark · Expanded',   dark: true,  collapsed: false, width: 260 },
  { id: 'light-col',  label: 'Light · Collapsed', dark: false, collapsed: true,  width: 68  },
  { id: 'dark-col',   label: 'Dark · Collapsed',  dark: true,  collapsed: true,  width: 68  },
] as const;

/* ─── Spec rows ────────────────────────────────────────────────────────── */

const SPEC_ROWS = [
  { token: 'Role',              value: 'Organization Admin (role="org")' },
  { token: 'Width · expanded',  value: '260px' },
  { token: 'Width · collapsed', value: '68px'  },
  { token: 'Org subtitle',      value: '"Mysafar OOO" · C.blue · hidden when collapsed' },
  { token: 'Header height',     value: '60px · 1px divider below' },
  { token: 'Background',        value: '#FFFFFF light / #12141C dark' },
  { token: 'Right border',      value: '1px solid #E5E7EB / #2D3148' },
  { token: 'Active bg',         value: '#EFF6FF + left 2px #2563EB' },
  { token: 'Hover bg',          value: '#F9FAFB / #1E2130' },
  { token: 'Nav items',         value: '7 items across 4 groups' },
];

const ROLE_COMPARE = [
  { prop: 'Nav items',      bank: '10 items · 4 groups',   org: '7 items · 4 groups' },
  { prop: 'Header subtitle',bank: '"Bank Admin"',           org: '"Mysafar OOO" (org name)' },
  { prop: 'Subtitle color', bank: 'text4 / text3 (dark)',   org: 'C.blue (brand)' },
  { prop: 'Scope',          bank: 'All organizations',      org: 'Own org only' },
  { prop: 'Active route',   bank: '/dashboard',             org: '/org-dashboard' },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function OrgSidebarShowcasePage() {
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: t.pageBg,
      transition: 'background 0.2s',
    }}>
      {/* ── Page chrome: live org sidebar ── */}
      <Sidebar
        role="org"
        collapsed={false}
        onToggle={() => {}}
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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Sidebar · Org Admin</span>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
            Left Sidebar — Organization Admin
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '6px 0 20px', lineHeight: 1.5, maxWidth: '760px' }}>
            Dev reference for the unified <code style={{ fontFamily: F.mono, color: t.text2 }}>&lt;Sidebar role="org" /&gt;</code> component.
            Each quadrant below is pinned to a specific theme × collapse state via the{' '}
            <code style={{ fontFamily: F.mono, color: t.text2 }}>darkMode</code> and{' '}
            <code style={{ fontFamily: F.mono, color: t.text2 }}>collapsed</code> props. Live sidebar state
            (hover, active route, theme toggle) lives elsewhere in the app shell.
          </p>

          {/* §01 — 4-quadrant matrix */}
          <SectionTitle index="01" title="Reference Matrix" sub="Light + Dark × Expanded + Collapsed · 4 pinned quadrants" t={t} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {QUADRANTS.map(q => (
              <QuadrantCell key={q.id} q={q} t={t} />
            ))}
          </div>

          {/* §02 — Role comparison */}
          <SectionTitle index="02" title="Role Comparison" sub="Bank Admin vs Org Admin — key differences" t={t} />

          <div style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '48px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                  {['Property', 'Bank Admin', 'Org Admin'].map(h => (
                    <th key={h} style={{
                      padding: '10px 20px',
                      textAlign: 'left',
                      fontFamily: F.inter,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: t.text4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROLE_COMPARE.map((row, i) => (
                  <tr key={row.prop} style={{ borderBottom: i < ROLE_COMPARE.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                    <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: '13px', color: t.blue }}>{row.prop}</td>
                    <td style={{ padding: '12px 20px', fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>{row.bank}</td>
                    <td style={{ padding: '12px 20px', fontFamily: F.inter, fontSize: '13px', color: t.text2, fontWeight: 500 }}>{row.org}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* §03 — Token spec */}
          <SectionTitle index="03" title="Design Tokens" sub="All sidebar-specific values · role='org'" t={t} />

          <div style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '40px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                  {['Token / Property', 'Value'].map(h => (
                    <th key={h} style={{
                      padding: '10px 20px',
                      textAlign: 'left',
                      fontFamily: F.inter,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: t.text4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row, i) => (
                  <tr key={row.token} style={{ borderBottom: i < SPEC_ROWS.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                    <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: '13px', color: t.blue }}>{row.token}</td>
                    <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Quadrant cell ───────────────────────────────────────────────────── */

type Quadrant = typeof QUADRANTS[number];

function QuadrantCell({ q, t }: { q: Quadrant; t: T }) {
  const cellBg     = q.dark ? '#0F1117' : '#F9FAFB';
  const cellBorder = q.dark ? '#2D3148' : '#E5E7EB';
  const labelColor = q.dark ? '#9CA3AF' : t.text3;
  const dimColor   = q.dark ? '#6B7280' : t.text4;

  return (
    <div style={{
      background: cellBg,
      border: `1px solid ${cellBorder}`,
      borderRadius: '12px',
      padding: '24px',
      boxSizing: 'border-box',
    }}>
      {/* Header: label + dims */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        gap: '12px',
      }}>
        <div style={{
          fontSize: '12px',
          color: labelColor,
          fontFamily: F.inter,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {q.label}
        </div>
        <div style={{
          fontFamily: F.mono,
          fontSize: '11px',
          color: dimColor,
          whiteSpace: 'nowrap',
        }}>
          {q.width}px × 560
        </div>
      </div>

      {/* Pinned sidebar — darkMode + collapsed forced via props */}
      <div style={{
        width: q.width,
        height: 560,
        display: 'flex',
        borderRadius: '10px',
        overflow: q.collapsed ? 'visible' : 'hidden',
        boxShadow: q.dark
          ? '0 4px 16px rgba(0,0,0,0.45)'
          : '0 4px 16px rgba(17,24,39,0.08)',
        border: `1px solid ${q.dark ? '#2D3148' : '#E5E7EB'}`,
      }}>
        <Sidebar
          role="org"
          collapsed={q.collapsed}
          onToggle={() => {}}
          darkMode={q.dark}
          orgName="Mysafar OOO"
          activePath="/org-dashboard"
        />
      </div>
    </div>
  );
}

/* ─── Section title ───────────────────────────────────────────────────── */

function SectionTitle({ index, title, sub, t }: { index: string; title: string; sub: string; t: T }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
        <span style={{
          fontFamily: F.mono,
          fontSize: '11px',
          color: t.blue,
          background: t.blueLt,
          border: `1px solid ${t.blueTint}`,
          borderRadius: '4px',
          padding: '2px 7px',
        }}>
          §{index}
        </span>
        <h2 style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 700, color: t.text1, margin: 0 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: 0 }}>{sub}</p>
      <div style={{ height: '1px', background: t.border, marginTop: '12px' }} />
    </div>
  );
}
