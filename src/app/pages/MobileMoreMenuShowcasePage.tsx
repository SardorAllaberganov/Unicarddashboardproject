import React, { useState } from 'react';
import {
  ChevronRight, Search, Settings2, Upload, FileSpreadsheet, Wallet, Bell,
  Megaphone, ListChecks, Users, Settings, LogOut, LayoutDashboard, Building2,
  CreditCard, MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, MDS, SectionBlock } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE "ЕЩЁ" MENU — Bank Admin · references X-00 §3
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Tint palettes ───────────────────────────────────────────────────── */

type TintKey = 'blue' | 'green' | 'amber' | 'violet' | 'rose' | 'cyan' | 'gray';

const TINT_LIGHT: Record<TintKey, { bg: string; fg: string }> = {
  blue:   { bg: '#EFF6FF', fg: '#2563EB' },
  green:  { bg: '#F0FDF4', fg: '#16A34A' },
  amber:  { bg: '#FFFBEB', fg: '#D97706' },
  violet: { bg: '#F3F0FF', fg: '#7C3AED' },
  rose:   { bg: '#FFF1F2', fg: '#E11D48' },
  cyan:   { bg: '#ECFEFF', fg: '#0891B2' },
  gray:   { bg: '#F3F4F6', fg: '#4B5563' },
};

const TINT_DARK: Record<TintKey, { bg: string; fg: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.15)',  fg: '#3B82F6' },
  green:  { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' },
  amber:  { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
  violet: { bg: 'rgba(167,139,250,0.15)', fg: '#A78BFA' },
  rose:   { bg: 'rgba(251,113,133,0.15)', fg: '#FB7185' },
  cyan:   { bg: 'rgba(34,211,238,0.15)',  fg: '#22D3EE' },
  gray:   { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' },
};

/* ─── Data ────────────────────────────────────────────────────────────── */

type TileDef = { icon: React.ElementType; label: string; tint: TintKey; badge?: number };

const SECTIONS: Array<{ title: string; tiles: TileDef[] }> = [
  {
    title: 'УПРАВЛЕНИЕ',
    tiles: [
      { icon: Settings2,       label: 'KPI конфигурации', tint: 'blue' },
      { icon: Upload,          label: 'Импорт карт',      tint: 'green' },
      { icon: FileSpreadsheet, label: 'Отчёты',           tint: 'amber' },
    ],
  },
  {
    title: 'ФИНАНСЫ',
    tiles: [
      { icon: Wallet, label: 'Вознаграждения', tint: 'violet' },
    ],
  },
  {
    title: 'СИСТЕМА',
    tiles: [
      { icon: Bell,       label: 'Уведомления',   tint: 'rose',   badge: 3 },
      { icon: Megaphone,  label: 'Объявления',     tint: 'cyan' },
      { icon: ListChecks, label: 'Лог доставки',   tint: 'blue' },
      { icon: Users,      label: 'Пользователи',   tint: 'violet' },
      { icon: Settings,   label: 'Настройки',      tint: 'gray' },
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

/* ─── Tab bar (pinned bottom, "Ещё" active) ───────────────────────────── */

type TabDef = { icon: React.ElementType; label: string };

const TABS: TabDef[] = [
  { icon: LayoutDashboard, label: 'Дашборд' },
  { icon: Building2,       label: 'Организации' },
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
      {TABS.map((tab, i) => {
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
  const barColor = dark ? '#FFFFFF' : '#000000';
  return (
    <div style={{
      height: MDS.safeBottom, width: '100%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingBottom: 8, boxSizing: 'border-box', flexShrink: 0,
    }}>
      <div style={{ width: 36, height: 5, borderRadius: 3, background: barColor, opacity: 0.9 }} />
    </div>
  );
}

/* ─── Tile component ──────────────────────────────────────────────────── */

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
      padding: '16px 8px 12px',
      boxSizing: 'border-box',
      position: 'relative',
      transform: pressed ? 'scale(0.96)' : undefined,
      transition: 'transform 100ms ease-out',
    }}>
      {/* Badge */}
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
      {/* Icon circle */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: pal.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10, flexShrink: 0,
      }}>
        <Icon size={28} color={pal.fg} strokeWidth={2} />
      </div>
      {/* Label */}
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
      borderRadius: 16, padding: '14px 16px',
      marginTop: 28,
    }}>
      {/* Avatar 48 */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: t.blueLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: t.blue }}>АК</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1 }}>
          Админ Камолов
        </div>
        <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 2 }}>
          Банк-администратор
        </div>
      </div>
      <ChevronRight size={20} color={t.textDisabled} strokeWidth={2} />
    </div>
  );
}

/* ─── Logout button ───────────────────────────────────────────────────── */

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
   FULL PHONE FRAME CONTENT
═══════════════════════════════════════════════════════════════════════════ */

function MoreMenuContent({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <StatusBar dark={dark} />

      {/* Header area — V1 style with large title */}
      <div style={{
        height: MDS.headerH, display: 'flex', alignItems: 'center',
        padding: '0 16px', boxSizing: 'border-box',
      }}>
        <div style={{ flex: 1 }} />
        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Search size={24} color={t.text1} strokeWidth={1.75} />
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        {/* Large title */}
        <h1 style={{
          fontFamily: F.dm, fontSize: 32, fontWeight: 700,
          color: t.text1, margin: '0 0 4px', lineHeight: 1.1,
        }}>
          Ещё
        </h1>

        {/* Grid sections */}
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <SectionLabel text={section.title} dark={dark} />
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
            }}>
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

        {/* Profile row */}
        <ProfileRow dark={dark} />

        {/* Logout */}
        <LogoutBtn dark={dark} />
      </div>

      {/* Tab bar */}
      <TabBar dark={dark} />
      <HomeIndicator dark={dark} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPEC TABLE
═══════════════════════════════════════════════════════════════════════════ */

const SPEC_ROWS = [
  { k: 'Page type',                   v: 'Full-screen tab page · not a push (tab switch)' },
  { k: 'Large title',                 v: 'DM Sans 32 / 700 · pageBg · no header blur (title is inline content)' },
  { k: 'Header right icon',           v: 'Search 24 · C/D.text1 · 48 × 48 touch area' },
  { k: 'Grid columns',                v: '3 equal · gap 12' },
  { k: 'Tile aspect-ratio',           v: '1 : 1 (~112 × 112 at 390 px viewport minus 32 px padding minus 24 px gap)' },
  { k: 'Tile bg',                     v: 'C.surface #FFF / D.surface #1A1D27 · 1 px border C/D.border' },
  { k: 'Tile radius',                 v: '20 px' },
  { k: 'Icon circle',                 v: '56 × 56 · tinted bg at 15 % opacity' },
  { k: 'Icon size',                   v: '28 px · stroke-width 2' },
  { k: 'Label',                       v: 'Inter 13 / 500 · C/D.text2 · center · 2-line clamp' },
  { k: 'Tap state',                   v: 'scale 0.96 · iOS highlight rgba(0,0,0,0.05) / rgba(255,255,255,0.05)' },
  { k: 'Badge (notifications tile)',   v: '18 × 18 pill #EF4444 · Inter 10/700 #FFF · 1.5 px surface ring · pos top-right' },
  { k: 'Section label',               v: 'Inter 11 / 600 · uppercase · C/D.text3 · tracking 0.06 em · pad 24-0-10' },
  { k: 'Profile row',                 v: 'Card-style (16 px border-radius) · 48 px avatar + name 15/500 + role 13 text3 + chevron' },
  { k: 'Logout',                      v: 'Inter 15 / 500 · C/D.error · centered · LogOut 18 icon left' },
  { k: 'Active tab',                  v: '"Ещё" (index 3) · C/D.blue · 600 weight' },
  { k: 'Safe area bottom',            v: '34 pt · tab-bar blurred bg continues into safe area' },
];

const TILE_SPEC = SECTIONS.flatMap(s => s.tiles).map(tile => ({
  label: tile.label,
  icon: tile.icon.displayName || tile.icon.name || '—',
  tint: tile.tint,
  badge: tile.badge ?? '—',
}));

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileMoreMenuShowcasePage() {
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
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>More Menu · Bank Admin</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            "Ещё" Menu — Bank Admin
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: '0 0 8px', maxWidth: 900 }}>
            References <span style={{ fontFamily: F.mono, color: t.text2 }}>X-00 §3</span>. Full-screen tab page with 3-column app-icon grid (9 tiles across 3 groups), user profile card, and destructive logout. Bank Admin variant — Org Admin has different tiles.
          </p>

          {/* §01 — Light + Dark matrix */}
          <SectionBlock num="1" title="Full page — light + dark" subtitle="Each frame shows the complete 'Ещё' screen including tab bar with 'Ещё' tab active, safe-area bottom, and home indicator. Bank Light shows a pressed state on 'KPI конфигурации' tile." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <PhoneFrame dark={false} height={920} label="Bank Admin · Light" note="Tap state on 'KPI конфигурации' tile — scale 0.96 + iOS highlight bg">
                <MoreMenuContent dark={false} />
              </PhoneFrame>
              <PhoneFrame dark={true} height={920} label="Bank Admin · Dark">
                <MoreMenuContent dark={true} />
              </PhoneFrame>
            </div>
          </SectionBlock>

          {/* §02 — Tile anatomy */}
          <SectionBlock num="2" title="Tile anatomy" subtitle="Breakdown of a single tile's structure." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Large exploded tile */}
              {([false, true] as const).map(dk => {
                const tt = theme(dk);
                const pal = (dk ? TINT_DARK : TINT_LIGHT).rose;
                return (
                  <div key={String(dk)} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{
                      fontFamily: F.inter, fontSize: 11, fontWeight: 600,
                      color: dk ? '#9CA3AF' : '#6B7280',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      {dk ? 'Dark' : 'Light'} · Rose tint · with badge
                    </div>
                    <div style={{
                      width: 180, height: 180,
                      background: tt.surface, border: `1px solid ${tt.border}`, borderRadius: 20,
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '24px 16px 16px', boxSizing: 'border-box', position: 'relative',
                    }}>
                      {/* Badge */}
                      <div style={{
                        position: 'absolute', top: 14, right: 14,
                        minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
                        background: '#EF4444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1.5px solid ${dk ? D.surface : C.surface}`,
                        fontFamily: F.inter, fontSize: 10, fontWeight: 700, color: '#FFFFFF', boxSizing: 'content-box',
                      }}>
                        3
                      </div>
                      {/* Icon circle */}
                      <div style={{
                        width: 72, height: 72, borderRadius: '50%', background: pal.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                      }}>
                        <Bell size={36} color={pal.fg} strokeWidth={2} />
                      </div>
                      <span style={{
                        fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: tt.text2, textAlign: 'center',
                      }}>
                        Уведомления
                      </span>
                    </div>
                    {/* Dimension callouts */}
                    <div style={{
                      fontFamily: F.mono, fontSize: 11, color: dk ? '#6B7280' : '#9CA3AF', lineHeight: 1.6,
                    }}>
                      Tile: ~112 × 112 (fills 1/3 col)<br />
                      Circle: 56 × 56 · bg 15% tint<br />
                      Icon: 28 px · solid color<br />
                      Badge: 18 × 18 · #EF4444<br />
                      Label: Inter 13/500 · 2-line clamp<br />
                      Radius: 20 px · border 1 px
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionBlock>

          {/* §03 — Tile catalogue */}
          <SectionBlock num="3" title="Tile catalogue" subtitle="All 9 tiles with their section, icon, tint palette, and badge state." t={t}>
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

          {/* §04 — Token spec */}
          <SectionBlock num="4" title="Design tokens" subtitle="All dimensions, colors, and behavior specs." t={t}>
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
              Mobile "Ещё" Menu · Bank Admin · 9 tiles · X-00 §3
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
