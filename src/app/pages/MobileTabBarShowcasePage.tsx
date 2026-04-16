import React, { useState } from 'react';
import {
  ChevronRight, LayoutDashboard, Building2, CreditCard, Users, MoreHorizontal, Search,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, MDS } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE TAB BAR — Detailed spec (references X-00 §2)
   2 roles × 2 themes. Pressed state + home indicator.
═══════════════════════════════════════════════════════════════════════════ */

type TabDef = { icon: React.ElementType; label: string };

const BANK_TABS: TabDef[] = [
  { icon: LayoutDashboard, label: 'Дашборд' },
  { icon: Building2,       label: 'Организации' },
  { icon: CreditCard,      label: 'Карты' },
  { icon: MoreHorizontal,  label: 'Ещё' },
];

const ORG_TABS: TabDef[] = [
  { icon: LayoutDashboard, label: 'Дашборд' },
  { icon: Users,           label: 'Продавцы' },
  { icon: CreditCard,      label: 'Карты' },
  { icon: MoreHorizontal,  label: 'Ещё' },
];

/* ─── Status bar (top of frame) ───────────────────────────────────────── */

function StatusBar({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const fg = t.text1;
  return (
    <div style={{
      height: MDS.safeTop, display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', padding: '0 24px 8px', boxSizing: 'border-box',
    }}>
      <span style={{ fontFamily: F.inter, fontSize: 14, fontWeight: 600, color: fg }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {/* signal */}
        <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          {[4, 6, 8, 10].map((h) => (
            <div key={h} style={{ width: 3, height: h, background: fg, borderRadius: 1 }} />
          ))}
        </div>
        {/* battery */}
        <div style={{
          width: 22, height: 10, borderRadius: 2, border: `1px solid ${fg}`,
          position: 'relative', marginLeft: 2,
        }}>
          <div style={{ position: 'absolute', inset: 1, width: '70%', background: fg, borderRadius: 1 }} />
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 4, background: fg, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Page content placeholder (fills the scrollable area) ────────────── */

function ContentFiller({ dark, role }: { dark: boolean; role: 'bank' | 'org' }) {
  const t = theme(dark);
  return (
    <div style={{ flex: 1, overflow: 'hidden', padding: '8px 16px 16px' }}>
      <h1 style={{
        fontFamily: F.dm, fontSize: 32, fontWeight: 700,
        color: t.text1, margin: '4px 0 16px', lineHeight: 1.1,
      }}>
        Дашборд
      </h1>
      {/* mock search */}
      <div style={{
        height: 44, borderRadius: 12,
        background: dark ? '#2D3148' : '#F3F4F6',
        padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 16, boxSizing: 'border-box',
      }}>
        <Search size={18} color={t.text3} strokeWidth={2} />
        <span style={{ fontFamily: F.inter, fontSize: 15, color: t.text4 }}>Поиск…</span>
      </div>
      {/* mock stat card */}
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
        padding: 16, marginBottom: 12,
      }}>
        <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>
          {role === 'bank' ? 'Выдано карт (всего)' : 'Активных продавцов'}
        </div>
        <div style={{
          fontFamily: F.dm, fontSize: 32, fontWeight: 700, color: t.text1, marginTop: 4,
        }}>
          {role === 'bank' ? '5 000' : '28'}
        </div>
      </div>
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
        padding: 16,
      }}>
        <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>
          UCOIN за апрель
        </div>
        <div style={{
          fontFamily: F.mono, fontSize: 24, fontWeight: 500, color: t.text1, marginTop: 4,
        }}>
          18.25M UZS
        </div>
      </div>
    </div>
  );
}

/* ─── The component being spec'd ──────────────────────────────────────── */

function TabItem({
  tab, active, dark, pressed, activeDotBadge, countBadge,
}: {
  tab: TabDef;
  active: boolean;
  dark: boolean;
  pressed?: boolean;
  activeDotBadge?: boolean;
  countBadge?: number;
}) {
  const t = theme(dark);
  const activeColor = dark ? '#3B82F6' : '#2563EB';
  const defaultColor = '#6B7280';
  const color = active ? activeColor : defaultColor;
  const Icon = tab.icon;

  return (
    <div style={{
      flex: 1, height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 4, position: 'relative',
      transform: pressed ? 'scale(0.96)' : 'none',
      opacity: pressed ? 0.7 : 1,
      transition: 'transform 100ms ease-out, opacity 100ms ease-out',
    }}>
      <div style={{ position: 'relative', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={28} color={color} strokeWidth={active ? 2 : 1.75} />
        {activeDotBadge && (
          <div style={{
            position: 'absolute', top: -1, right: 0,
            width: 8, height: 8, borderRadius: '50%',
            background: '#EF4444',
            border: `1.5px solid ${dark ? '#1A1D27' : '#FFFFFF'}`,
            boxSizing: 'content-box',
          }} />
        )}
        {countBadge !== undefined && (
          <div style={{
            position: 'absolute', top: -4, right: -6,
            minWidth: 14, height: 14, padding: '0 4px', borderRadius: 7,
            background: '#EF4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1.5px solid ${dark ? '#1A1D27' : '#FFFFFF'}`,
            fontFamily: F.inter, fontSize: 9, fontWeight: 700, color: '#FFFFFF',
            lineHeight: 1,
          }}>
            {countBadge}
          </div>
        )}
      </div>
      <span style={{
        fontFamily: F.inter, fontSize: 11,
        fontWeight: active ? 600 : 500,
        color,
        lineHeight: 1,
      }}>
        {tab.label}
      </span>
    </div>
  );
}

function TabBar({
  role, dark, pressedIndex,
}: { role: 'bank' | 'org'; dark: boolean; pressedIndex?: number }) {
  const tabs = role === 'bank' ? BANK_TABS : ORG_TABS;
  const bg = dark ? 'rgba(26,29,39,0.92)' : 'rgba(255,255,255,0.92)';
  const topBorder = dark ? '#2D3148' : '#E5E7EB';
  return (
    <div style={{
      height: MDS.tabBarH, width: '100%',
      background: bg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderTop: `1px solid ${topBorder}`,
      display: 'flex', alignItems: 'stretch',
      boxSizing: 'border-box',
    }}>
      {tabs.map((tab, i) => (
        <TabItem
          key={tab.label}
          tab={tab}
          active={i === 0}
          dark={dark}
          pressed={pressedIndex === i}
          activeDotBadge={i === 0}
          countBadge={i === 3 ? 3 : undefined}
        />
      ))}
    </div>
  );
}

/* ─── Home indicator area (safe-area-bottom) ──────────────────────────── */

function HomeIndicator({ dark }: { dark: boolean }) {
  const bg = dark ? 'rgba(26,29,39,0.92)' : 'rgba(255,255,255,0.92)';
  const barColor = dark ? '#FFFFFF' : '#000000';
  return (
    <div style={{
      height: MDS.safeBottom, width: '100%',
      background: bg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingBottom: 8, boxSizing: 'border-box',
    }}>
      <div style={{
        width: 36, height: 5, borderRadius: 3,
        background: barColor, opacity: 0.9,
      }} />
    </div>
  );
}

/* ─── Variant cell (one phone frame) ──────────────────────────────────── */

function VariantCell({
  role, dark, label, pressedIndex, note,
}: {
  role: 'bank' | 'org';
  dark: boolean;
  label: string;
  pressedIndex?: number;
  note?: string;
}) {
  return (
    <PhoneFrame dark={dark} height={720} label={label} note={note}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <StatusBar dark={dark} />
        <ContentFiller dark={dark} role={role} />
        <TabBar role={role} dark={dark} pressedIndex={pressedIndex} />
        <HomeIndicator dark={dark} />
      </div>
    </PhoneFrame>
  );
}

/* ─── Spec table ──────────────────────────────────────────────────────── */

const SPEC_ROWS: Array<{ k: string; v: string }> = [
  { k: 'Container · height',        value: '64 px + safe-area-bottom (34 pt iOS)' }  as any,
  { k: 'Container · bg (light)',    v: 'rgba(255,255,255,0.92) · backdrop-blur 16 px' },
  { k: 'Container · bg (dark)',     v: 'rgba(26,29,39,0.92) · backdrop-blur 16 px' },
  { k: 'Top border',                v: '1 px · #E5E7EB light / #2D3148 dark' },
  { k: 'Tab count',                 v: '4 (equal width)' },
  { k: 'Icon size',                 v: '28 × 28' },
  { k: 'Icon stroke',               v: '1.75 default / 2 active' },
  { k: 'Label',                     v: 'Inter 11 px · 500 default / 600 active' },
  { k: 'Active color (light)',      v: '#2563EB (icon + label)' },
  { k: 'Active color (dark)',       v: '#3B82F6 (icon + label)' },
  { k: 'Default color',             v: '#6B7280 (both themes)' },
  { k: 'Pressed state',             v: 'transform: scale(0.96) · opacity 0.7 · 100 ms ease-out' },
  { k: 'Dot badge (active tab)',    v: '8 × 8 circle #EF4444 · 1.5 px surface-color ring · top-right of icon' },
  { k: 'Count badge (Ещё tab)',     v: '14 × 14 pill #EF4444 · Inter 9/700 #FFF · 1.5 px surface ring' },
  { k: 'Home indicator (iOS)',      v: '36 × 5 rounded · #000 light / #FFF dark @ 90 % opacity, centered in safe area' },
  { k: 'Touch target',              v: '≥ 48 × 48 pt (covers full tab cell)' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileTabBarShowcasePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const t = theme(darkMode);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank"
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
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>
              Дизайн-система
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/mobile-design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>
              Mobile
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Bottom Tab Bar</span>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            Bottom Tab Bar — 2 roles × 2 themes
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: 0, maxWidth: 860 }}>
            References <span style={{ fontFamily: F.mono, color: t.text2 }}>X-00 §2</span>. 4 tabs per role, height 64 + safe-area-bottom, translucent bg with 16 px backdrop-blur. The pressed state on Bank Admin Light marks tab 2 (Организации) at scale 0.96 / opacity 0.7. Home indicator (36 × 5, centered) sits in the safe area below every tab bar.
          </p>

          {/* §01 — 2×2 matrix */}
          <h2 style={{
            fontFamily: F.dm, fontSize: 18, fontWeight: 600, color: t.text1,
            margin: '40px 0 6px', display: 'flex', alignItems: 'baseline', gap: 10,
          }}>
            <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 600, color: t.text4, background: t.tableHeaderBg, border: `1px solid ${t.border}`, borderRadius: 4, padding: '2px 8px' }}>
              §01
            </span>
            Variant matrix
          </h2>
          <div style={{ height: 1, background: t.border, margin: '8px 0 24px' }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(430px, 1fr))',
            gap: '32px 24px',
            alignItems: 'start',
          }}>
            <VariantCell
              role="bank" dark={false}
              label="Bank Admin · Light"
              pressedIndex={1}
              note="Pressed state demo on tab 2 (Организации) · scale 0.96 · opacity 0.7"
            />
            <VariantCell
              role="bank" dark={true}
              label="Bank Admin · Dark"
            />
            <VariantCell
              role="org" dark={false}
              label="Org Admin · Light"
            />
            <VariantCell
              role="org" dark={true}
              label="Org Admin · Dark"
            />
          </div>

          {/* §02 — Spec */}
          <h2 style={{
            fontFamily: F.dm, fontSize: 18, fontWeight: 600, color: t.text1,
            margin: '56px 0 6px', display: 'flex', alignItems: 'baseline', gap: 10,
          }}>
            <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 600, color: t.text4, background: t.tableHeaderBg, border: `1px solid ${t.border}`, borderRadius: 4, padding: '2px 8px' }}>
              §02
            </span>
            Design tokens
          </h2>
          <div style={{ height: 1, background: t.border, margin: '8px 0 16px' }} />

          <div style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12,
            overflow: 'hidden', maxWidth: 920,
          }}>
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
                {SPEC_ROWS.map((row, i) => (
                  <tr key={row.k} style={{ borderBottom: i < SPEC_ROWS.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                    <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: 13, color: t.blue, width: '38%' }}>{row.k}</td>
                    <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: 13, color: t.text2 }}>{(row as any).v ?? (row as any).value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* §03 — Tabs composition */}
          <h2 style={{
            fontFamily: F.dm, fontSize: 18, fontWeight: 600, color: t.text1,
            margin: '56px 0 6px', display: 'flex', alignItems: 'baseline', gap: 10,
          }}>
            <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 600, color: t.text4, background: t.tableHeaderBg, border: `1px solid ${t.border}`, borderRadius: 4, padding: '2px 8px' }}>
              §03
            </span>
            Tabs by role
          </h2>
          <div style={{ height: 1, background: t.border, margin: '8px 0 16px' }} />

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 920,
          }}>
            {(['bank', 'org'] as const).map((role) => {
              const tabs = role === 'bank' ? BANK_TABS : ORG_TABS;
              return (
                <div key={role} style={{
                  background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12,
                  padding: 16,
                }}>
                  <div style={{
                    fontFamily: F.inter, fontSize: 11, fontWeight: 600,
                    color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: 12,
                  }}>
                    {role === 'bank' ? 'Bank Admin' : 'Org Admin'}
                  </div>
                  {tabs.map((tab, i) => {
                    const Icon = tab.icon;
                    return (
                      <div key={tab.label} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 0',
                        borderBottom: i < tabs.length - 1 ? `1px solid ${t.border}` : 'none',
                      }}>
                        <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                          <Icon size={20} color={i === 0 ? t.blue : t.text3} strokeWidth={2} />
                        </div>
                        <span style={{ flex: 1, fontFamily: F.inter, fontSize: 14, color: t.text1 }}>
                          {tab.label}
                        </span>
                        <span style={{ fontFamily: F.mono, fontSize: 11, color: t.text4 }}>
                          {i === 0 ? 'ACTIVE · dot' : i === 3 ? 'badge · 3' : `idx ${i}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
