import React, { useState } from 'react';
import {
  ChevronRight, Search, ClipboardCheck, MessageSquare, Wallet, ArrowDownToLine,
  Bell, Settings, LogOut, LayoutDashboard, Users, CreditCard, MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, MDS, SectionBlock } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE "ЕЩЁ" MENU — Organization Admin · references X-00 §3
   Same layout as Y-03 (Bank Admin) but different tiles, tab bar, and profile.
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Tint palettes (shared with Y-03) ────────────────────────────────── */

type TintKey = 'blue' | 'cyan' | 'violet' | 'amber' | 'rose' | 'gray';

const TINT_LIGHT: Record<TintKey, { bg: string; fg: string }> = {
  blue:   { bg: '#EFF6FF', fg: '#2563EB' },
  cyan:   { bg: '#ECFEFF', fg: '#0891B2' },
  violet: { bg: '#F3F0FF', fg: '#7C3AED' },
  amber:  { bg: '#FFFBEB', fg: '#D97706' },
  rose:   { bg: '#FFF1F2', fg: '#E11D48' },
  gray:   { bg: '#F3F4F6', fg: '#4B5563' },
};

const TINT_DARK: Record<TintKey, { bg: string; fg: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.15)',  fg: '#3B82F6' },
  cyan:   { bg: 'rgba(34,211,238,0.15)',  fg: '#22D3EE' },
  violet: { bg: 'rgba(167,139,250,0.15)', fg: '#A78BFA' },
  amber:  { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
  rose:   { bg: 'rgba(251,113,133,0.15)', fg: '#FB7185' },
  gray:   { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' },
};

/* ─── Data ────────────────────────────────────────────────────────────── */

type TileDef = { icon: React.ElementType; label: string; tint: TintKey; badge?: number };

const SECTIONS: Array<{ title: string; tiles: TileDef[] }> = [
  {
    title: 'УПРАВЛЕНИЕ',
    tiles: [
      { icon: ClipboardCheck, label: 'Назначение карт', tint: 'blue' },
      { icon: MessageSquare,  label: 'Сообщения',       tint: 'cyan', badge: 2 },
    ],
  },
  {
    title: 'ФИНАНСЫ',
    tiles: [
      { icon: Wallet,          label: 'Вознаграждения', tint: 'violet' },
      { icon: ArrowDownToLine, label: 'Выводы',         tint: 'amber' },
    ],
  },
  {
    title: 'СИСТЕМА',
    tiles: [
      { icon: Bell,     label: 'Уведомления', tint: 'rose', badge: 5 },
      { icon: Settings, label: 'Настройки',   tint: 'gray' },
    ],
  },
];

/* ─── Status bar ──────────────────────────────────────────────────────── */

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
        <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          {[4, 6, 8, 10].map(h => (
            <div key={h} style={{ width: 3, height: h, background: fg, borderRadius: 1 }} />
          ))}
        </div>
        <div style={{ width: 22, height: 10, borderRadius: 2, border: `1px solid ${fg}`, position: 'relative', marginLeft: 2 }}>
          <div style={{ position: 'absolute', inset: 1, width: '70%', background: fg, borderRadius: 1 }} />
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 4, background: fg, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Tab bar (Org variant — "Ещё" active) ────────────────────────────── */

type TabDef = { icon: React.ElementType; label: string };

const ORG_TABS: TabDef[] = [
  { icon: LayoutDashboard, label: 'Дашборд' },
  { icon: Users,           label: 'Продавцы' },
  { icon: CreditCard,      label: 'Карты' },
  { icon: MoreHorizontal,  label: 'Ещё' },
];

function TabBar({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const bg = dark ? MDS.tabBarDark : MDS.tabBarLight;
  return (
    <div style={{
      height: MDS.tabBarH, width: '100%',
      background: bg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderTop: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'stretch', boxSizing: 'border-box', flexShrink: 0,
    }}>
      {ORG_TABS.map((tab, i) => {
        const active = i === 3;
        const Icon = tab.icon;
        const color = active ? t.blue : t.text3;
        return (
          <div key={tab.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon size={28} color={color} strokeWidth={active ? 2 : 1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: active ? 600 : 500, color }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function HomeIndicator({ dark }: { dark: boolean }) {
  const bg = dark ? MDS.tabBarDark : MDS.tabBarLight;
  return (
    <div style={{ height: MDS.safeBottom, width: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 8, boxSizing: 'border-box', flexShrink: 0 }}>
      <div style={{ width: 36, height: 5, borderRadius: 3, background: dark ? '#FFFFFF' : '#000000', opacity: 0.9 }} />
    </div>
  );
}

/* ─── Tile ─────────────────────────────────────────────────────────────── */

function Tile({ tile, dark, pressed }: { tile: TileDef; dark: boolean; pressed?: boolean }) {
  const t = theme(dark);
  const pal = (dark ? TINT_DARK : TINT_LIGHT)[tile.tint];
  const Icon = tile.icon;
  const tapBg = pressed ? (dark ? MDS.touchIosDark : MDS.touchIosLight) : undefined;
  return (
    <div style={{
      aspectRatio: '1 / 1',
      background: tapBg || t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: 20,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '16px 8px 12px', boxSizing: 'border-box',
      position: 'relative',
      transform: pressed ? 'scale(0.96)' : undefined,
      transition: 'transform 100ms ease-out',
    }}>
      {tile.badge !== undefined && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
          background: '#EF4444',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1.5px solid ${dark ? D.surface : C.surface}`,
          fontFamily: F.inter, fontSize: 10, fontWeight: 700, color: '#FFFFFF',
          lineHeight: 1, boxSizing: 'content-box',
        }}>
          {tile.badge}
        </div>
      )}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: pal.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10, flexShrink: 0,
      }}>
        <Icon size={28} color={pal.fg} strokeWidth={2} />
      </div>
      <span style={{
        fontFamily: F.inter, fontSize: 13, fontWeight: 500,
        color: t.text2, textAlign: 'center', lineHeight: 1.25,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', wordBreak: 'break-word',
      }}>
        {tile.label}
      </span>
    </div>
  );
}

/* ─── Section label ───────────────────────────────────────────────────── */

function SectionLabel({ text, dark }: { text: string; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      fontFamily: F.inter, fontSize: 11, fontWeight: 600,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '24px 0 10px',
    }}>
      {text}
    </div>
  );
}

/* ─── Profile row ─────────────────────────────────────────────────────── */

function ProfileRow({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: 16, padding: '14px 16px', marginTop: 28,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: t.blueLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: t.blue }}>РА</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1 }}>
          Рустам Алиев
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          Менеджер организации Mysafar OOO
        </div>
      </div>
      <ChevronRight size={20} color={t.textDisabled} strokeWidth={2} />
    </div>
  );
}

/* ─── Logout ──────────────────────────────────────────────────────────── */

function LogoutBtn({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 8 }}>
      <button style={{
        background: 'none', border: 'none',
        fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.error,
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', padding: '12px 24px',
      }}>
        <LogOut size={18} strokeWidth={2} />
        Выйти из системы
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FULL PHONE CONTENT
═══════════════════════════════════════════════════════════════════════════ */

function MoreMenuContent({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <StatusBar dark={dark} />

      {/* Header — search icon only, title is inline */}
      <div style={{ height: MDS.headerH, display: 'flex', alignItems: 'center', padding: '0 16px', boxSizing: 'border-box' }}>
        <div style={{ flex: 1 }} />
        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Search size={24} color={t.text1} strokeWidth={1.75} />
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        <h1 style={{ fontFamily: F.dm, fontSize: 32, fontWeight: 700, color: t.text1, margin: '0 0 4px', lineHeight: 1.1 }}>
          Ещё
        </h1>

        {SECTIONS.map(section => (
          <div key={section.title}>
            <SectionLabel text={section.title} dark={dark} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {section.tiles.map((tile, i) => (
                <Tile
                  key={tile.label}
                  tile={tile}
                  dark={dark}
                  pressed={section.title === 'УПРАВЛЕНИЕ' && i === 0 && !dark}
                />
              ))}
            </div>
          </div>
        ))}

        <ProfileRow dark={dark} />
        <LogoutBtn dark={dark} />
      </div>

      <TabBar dark={dark} />
      <HomeIndicator dark={dark} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPEC TABLES
═══════════════════════════════════════════════════════════════════════════ */

const SPEC_ROWS = [
  { k: 'Page type',                  v: 'Full-screen tab page · "Ещё" (index 3) active' },
  { k: 'Tab bar variant',            v: 'Org Admin — Дашборд / Продавцы / Карты / Ещё' },
  { k: 'Large title',                v: 'DM Sans 32 / 700 · inline content (not in header bar)' },
  { k: 'Tile count',                 v: '6 tiles across 3 sections (vs 9 in Bank Admin Y-03)' },
  { k: 'Grid',                       v: '3 columns · gap 12 · tiles aspect-ratio 1:1 (~112 × 112)' },
  { k: 'Tile spec',                  v: 'bg surface · 1 px border · radius 20 · icon circle 56 · icon 28 · label 13/500' },
  { k: 'Badge (Сообщения)',          v: '18 × 18 pill #EF4444 · "2" · 1.5 px surface ring' },
  { k: 'Badge (Уведомления)',        v: '18 × 18 pill #EF4444 · "5" · 1.5 px surface ring' },
  { k: 'Tap state',                  v: 'scale 0.96 · iOS highlight rgba(0,0,0,0.05) / rgba(255,255,255,0.05)' },
  { k: 'Profile · avatar',           v: '48 × 48 circle · blueLt bg · "РА" Inter 15/600 blue' },
  { k: 'Profile · name',             v: 'Inter 15 / 500 · C/D.text1' },
  { k: 'Profile · role',             v: 'Inter 13 · C/D.text3 · "Менеджер организации Mysafar OOO" · ellipsis' },
  { k: 'Logout',                     v: 'Inter 15 / 500 · C/D.error · LogOut 18 icon + text · centered' },
  { k: 'Safe area bottom',           v: '34 pt · blurred tab-bar bg continues' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileMoreMenuOrgShowcasePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const t = theme(darkMode);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank" collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Дизайн-система</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/mobile-design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Mobile</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>More Menu · Org Admin</span>
          </div>

          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            "Ещё" Menu — Organization Admin
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: '0 0 8px', maxWidth: 900 }}>
            References <span style={{ fontFamily: F.mono, color: t.text2 }}>X-00 §3</span>. Same layout as <span onClick={() => navigate('/mobile-more-menu')} style={{ color: t.blue, cursor: 'pointer' }}>Y-03 (Bank Admin)</span> but with 6 org-specific tiles, org tab bar (Продавцы replaces Организации), and org profile.
          </p>

          {/* §01 — Light + Dark */}
          <SectionBlock num="1" title="Full page — light + dark" subtitle="Complete 'Ещё' screen for Org Admin. 6 tiles across 3 sections. 'Назначение карт' shows pressed state in light." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <PhoneFrame dark={false} height={860} label="Org Admin · Light" note="Pressed state on 'Назначение карт' tile — scale 0.96 + iOS highlight">
                <MoreMenuContent dark={false} />
              </PhoneFrame>
              <PhoneFrame dark={true} height={860} label="Org Admin · Dark">
                <MoreMenuContent dark={true} />
              </PhoneFrame>
            </div>
          </SectionBlock>

          {/* §02 — Tile catalogue */}
          <SectionBlock num="2" title="Tile catalogue" subtitle="All 6 tiles with their section, tint palette, and badge state." t={t}>
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: 'hidden', maxWidth: 700 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                    {['#', 'Section', 'Label', 'Tint', 'Badge'].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px', textAlign: 'left',
                        fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.text4,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SECTIONS.flatMap((s, si) =>
                    s.tiles.map((tile, ti) => {
                      const idx = SECTIONS.slice(0, si).reduce((sum, sec) => sum + sec.tiles.length, 0) + ti + 1;
                      const pal = (darkMode ? TINT_DARK : TINT_LIGHT)[tile.tint];
                      return (
                        <tr key={tile.label} style={{ borderBottom: `1px solid ${t.border}` }}>
                          <td style={{ padding: '10px 16px', fontFamily: F.mono, fontSize: 13, color: t.text4 }}>{idx}</td>
                          <td style={{ padding: '10px 16px', fontFamily: F.inter, fontSize: 13, color: t.text3 }}>{s.title}</td>
                          <td style={{ padding: '10px 16px', fontFamily: F.inter, fontSize: 13, fontWeight: 500, color: t.text1 }}>{tile.label}</td>
                          <td style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 16, height: 16, borderRadius: '50%', background: pal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: pal.fg }} />
                              </div>
                              <span style={{ fontFamily: F.mono, fontSize: 12, color: t.text2 }}>{tile.tint}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 16px', fontFamily: F.mono, fontSize: 13, color: tile.badge ? '#EF4444' : t.text4 }}>
                            {tile.badge ?? '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </SectionBlock>

          {/* §03 — Comparison table */}
          <SectionBlock num="3" title="Bank vs Org comparison" subtitle="Side-by-side tile count and section differences." t={t}>
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: 'hidden', maxWidth: 700 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                    {['Property', 'Bank Admin (Y-03)', 'Org Admin (Y-04)'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Total tiles', '9', '6'],
                    ['УПРАВЛЕНИЕ', 'KPI конфиг · Импорт · Отчёты', 'Назначение карт · Сообщения'],
                    ['ФИНАНСЫ', 'Вознаграждения', 'Вознаграждения · Выводы'],
                    ['СИСТЕМА', 'Уведомления · Объявления · Лог · Пользователи · Настройки', 'Уведомления · Настройки'],
                    ['Tab bar', 'Организации (tab 1)', 'Продавцы (tab 1)'],
                    ['Profile', 'Админ Камолов · Банк-администратор', 'Рустам Алиев · Менеджер организации…'],
                  ].map(([prop, bank, org], i, arr) => (
                    <tr key={prop} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                      <td style={{ padding: '10px 16px', fontFamily: F.inter, fontSize: 13, fontWeight: 500, color: t.text1, width: '25%' }}>{prop}</td>
                      <td style={{ padding: '10px 16px', fontFamily: F.inter, fontSize: 13, color: t.text2 }}>{bank}</td>
                      <td style={{ padding: '10px 16px', fontFamily: F.inter, fontSize: 13, color: t.text2 }}>{org}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBlock>

          {/* §04 — Token spec */}
          <SectionBlock num="4" title="Design tokens" subtitle="Org-specific values (layout/tile spec is identical to Y-03)." t={t}>
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: 'hidden', maxWidth: 920 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                    {['Token / Property', 'Value'].map(h => (
                      <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPEC_ROWS.map((row, i) => (
                    <tr key={row.k} style={{ borderBottom: i < SPEC_ROWS.length - 1 ? `1px solid ${t.border}` : 'none' }}>
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
              Mobile "Ещё" Menu · Org Admin · 6 tiles · X-00 §3
            </span>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: t.textDisabled }}>© 2026 Moment Finance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
