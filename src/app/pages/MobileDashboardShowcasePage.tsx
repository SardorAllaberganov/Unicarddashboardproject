import React, { useState } from 'react';
import {
  ChevronRight, ChevronDown, Bell, CreditCard, ShoppingBag, UserCheck, Wallet,
  TrendingUp, LayoutDashboard, Building2, MoreHorizontal, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, MDS, SectionBlock } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE BANK ADMIN DASHBOARD — Y-06 · Tab 1
   Full-screen: header (Y-02 V1) + scrollable content + tab bar (Y-01).
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Status bar ──────────────────────────────────────────────────────── */

function StatusBar({ dark }: { dark: boolean }) {
  const fg = theme(dark).text1;
  return (
    <div style={{ height: MDS.safeTop, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 24px 8px', boxSizing: 'border-box' }}>
      <span style={{ fontFamily: F.inter, fontSize: 14, fontWeight: 600, color: fg }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>{[4,6,8,10].map(h => <div key={h} style={{ width: 3, height: h, background: fg, borderRadius: 1 }} />)}</div>
        <div style={{ width: 22, height: 10, borderRadius: 2, border: `1px solid ${fg}`, position: 'relative', marginLeft: 2 }}>
          <div style={{ position: 'absolute', inset: 1, width: '70%', background: fg, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Header (Y-02 V1) ──────────────────────────────────────────────── */

function Header({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const btnBg = t.surface;
  const btnBorder = t.border;
  return (
    <div style={{
      height: MDS.headerH, display: 'flex', alignItems: 'center',
      padding: '0 16px', background: t.surface,
      borderBottom: `1px solid ${t.border}`,
      boxSizing: 'border-box', flexShrink: 0,
    }}>
      {/* Left — app name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
        <span style={{ fontFamily: F.dm, fontSize: 15, fontWeight: 700, color: t.text1, whiteSpace: 'nowrap' }}>
          Moment KPI
        </span>
      </div>

      {/* Right — bell + avatar + chevron */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Bell button */}
        <button style={{
          position: 'relative', width: 36, height: 36, borderRadius: 8,
          border: `1px solid ${btnBorder}`, background: btnBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
          <Bell size={15} color={t.text3} strokeWidth={1.75} />
          <span style={{
            position: 'absolute', top: 3, right: 3,
            minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
            background: '#EF4444', border: `2px solid ${t.surface}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.inter, fontSize: 10, fontWeight: 700, color: '#FFFFFF', lineHeight: 1,
          }}>
            5
          </span>
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: t.border, margin: '0 2px', flexShrink: 0 }} />

        {/* Avatar + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, cursor: 'pointer' }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: t.blueLt, border: `1.5px solid ${t.blue}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 700, color: t.blue }}>БА</span>
          </div>
          <ChevronDown size={14} color={t.text4} strokeWidth={1.75} style={{ flexShrink: 0, marginLeft: 2 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Tab bar (Y-01 Bank) ────────────────────────────────────────────── */

function TabBar({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const bg = dark ? MDS.tabBarDark : MDS.tabBarLight;
  const tabs = [
    { icon: LayoutDashboard, label: 'Дашборд' },
    { icon: Building2,       label: 'Организации' },
    { icon: CreditCard,      label: 'Карты' },
    { icon: MoreHorizontal,  label: 'Ещё' },
  ];
  return (
    <div style={{ height: MDS.tabBarH, background: bg, backdropFilter: 'blur(16px)', borderTop: `1px solid ${t.border}`, display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>
      {tabs.map((tab, i) => {
        const active = i === 0;
        const color = active ? t.blue : t.text3;
        return (
          <div key={tab.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <tab.icon size={28} color={color} strokeWidth={active ? 2 : 1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: active ? 600 : 500, color }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function HomeIndicator({ dark }: { dark: boolean }) {
  return (
    <div style={{ height: MDS.safeBottom, background: dark ? MDS.tabBarDark : MDS.tabBarLight, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 8, boxSizing: 'border-box', flexShrink: 0 }}>
      <div style={{ width: 36, height: 5, borderRadius: 3, background: dark ? '#FFF' : '#000', opacity: 0.9 }} />
    </div>
  );
}

/* ─── Tint helpers ─────────────────────────────────────────────────────── */

type Tint = 'blue' | 'green' | 'cyan' | 'rose' | 'violet' | 'amber';

const TINT_L: Record<Tint, { bg: string; fg: string }> = {
  blue:   { bg: '#EFF6FF', fg: '#2563EB' },
  green:  { bg: '#F0FDF4', fg: '#16A34A' },
  cyan:   { bg: '#ECFEFF', fg: '#0891B2' },
  rose:   { bg: '#FFF1F2', fg: '#E11D48' },
  violet: { bg: '#F3F0FF', fg: '#7C3AED' },
  amber:  { bg: '#FFFBEB', fg: '#D97706' },
};
const TINT_D: Record<Tint, { bg: string; fg: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.15)',  fg: '#3B82F6' },
  green:  { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' },
  cyan:   { bg: 'rgba(34,211,238,0.15)',  fg: '#22D3EE' },
  rose:   { bg: 'rgba(251,113,133,0.15)', fg: '#FB7185' },
  violet: { bg: 'rgba(167,139,250,0.15)', fg: '#A78BFA' },
  amber:  { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
};

const TREND_L = { up: { bg: '#F0FDF4', fg: '#15803D' }, down: { bg: '#FEF2F2', fg: '#DC2626' } };
const TREND_D = { up: { bg: 'rgba(52,211,153,0.15)', fg: '#34D399' }, down: { bg: 'rgba(248,113,113,0.15)', fg: '#F87171' } };

/* ─── Section header ──────────────────────────────────────────────────── */

function SH({ text, dark }: { text: string; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '24px 20px 10px' }}>
      {text}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD CONTENT
═══════════════════════════════════════════════════════════════════════════ */

function DashContent({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const tint = (k: Tint) => (dark ? TINT_D : TINT_L)[k];
  const trend = (up: boolean) => (dark ? TREND_D : TREND_L)[up ? 'up' : 'down'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <StatusBar dark={dark} />
      <Header dark={dark} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* PTR indicator placeholder */}
        <div style={{ height: 0 }} />

        {/* 1. Greeting */}
        <div style={{ padding: '12px 20px 8px' }}>
          <h1 style={{ fontFamily: F.dm, fontSize: 32, fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.1 }}>
            Привет, Админ!
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 15, color: t.text3, margin: '6px 0 0' }}>
            Вот что происходит сегодня
          </p>
        </div>

        {/* 2. Hero KPI card */}
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{
            background: dark ? 'linear-gradient(135deg, #1E3A5F 0%, #1A2B4A 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            borderRadius: 20, padding: 20,
          }}>
            <div style={{ fontFamily: F.inter, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>
              Всего начислено за апрель
            </div>
            <div style={{ fontFamily: F.dm, fontSize: 32, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 10 }}>
              24 565 000 UZS
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 20,
              background: 'rgba(255,255,255,0.18)',
            }}>
              <TrendingUp size={14} color="#FFFFFF" strokeWidth={2.5} />
              <span style={{ fontFamily: F.inter, fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>+18% vs март</span>
            </div>
          </div>
        </div>

        {/* 3. Stat cards 2×2 */}
        <div style={{ padding: '16px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {([
            { icon: CreditCard,  tint: 'blue' as Tint,  label: 'Карт выпущено', val: '5 000' },
            { icon: ShoppingBag, tint: 'green' as Tint, label: 'Продано',       val: '2 340', tr: { up: true, v: '+12%' } },
            { icon: UserCheck,   tint: 'cyan' as Tint,  label: 'KPI 1',         val: '1 890' },
            { icon: Wallet,      tint: 'rose' as Tint,  label: 'KPI 3',         val: '567',   tr: { up: true, v: '+15%' } },
          ]).map(s => {
            const Icon = s.icon;
            const pal = tint(s.tint);
            const tp = s.tr ? trend(s.tr.up) : null;
            return (
              <div key={s.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: pal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={pal.fg} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontFamily: F.inter, fontSize: 13, fontWeight: 500, color: t.text3, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: F.dm, fontSize: 24, fontWeight: 700, color: t.text1, lineHeight: 1 }}>{s.val}</span>
                    {s.tr && tp && (
                      <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 500, color: tp.fg, background: tp.bg, padding: '1px 6px', borderRadius: 8 }}>
                        {s.tr.v}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Funnel */}
        <SH text="ВОРОНКА КОНВЕРСИИ" dark={dark} />
        <div style={{ margin: '0 16px', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16 }}>
          {([
            { label: 'Выдано',  count: 5000, pct: '100%' },
            { label: 'Продано', count: 2340, pct: '46.8%' },
            { label: 'KPI 1',   count: 1890, pct: '37.8%' },
            { label: 'KPI 2',   count: 1210, pct: '24.2%' },
            { label: 'KPI 3',   count: 567,  pct: '11.3%' },
          ]).map((row, i, arr) => {
            const w = `${(row.count / 5000) * 100}%`;
            const blue = dark ? ['#60A5FA','#3B82F6','#2563EB','#1D4ED8','#1E40AF'] : ['#93C5FD','#60A5FA','#3B82F6','#2563EB','#1D4ED8'];
            return (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < arr.length - 1 ? 14 : 0 }}>
                <div style={{ width: 56, fontFamily: F.inter, fontSize: 13, color: t.text2, textAlign: 'right', flexShrink: 0 }}>
                  {row.label}
                </div>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: t.progressTrack, overflow: 'hidden' }}>
                  <div style={{ width: w, height: '100%', background: blue[i], borderRadius: 4 }} />
                </div>
                <div style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: t.text1 }}>{row.count.toLocaleString()}</span>
                  <span style={{ fontFamily: F.inter, fontSize: 11, color: t.text4 }}>{row.pct}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Top orgs */}
        <SH text="ТОП ОРГАНИЗАЦИЙ" dark={dark} />
        <div style={{ margin: '0 16px', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden' }}>
          {([
            { ini: 'M', tint: 'blue' as Tint, name: 'Mysafar OOO',        sub: '230 продано · 45 KPI 3' },
            { ini: 'U', tint: 'violet' as Tint, name: 'Unired Marketing', sub: '310 продано · 78 KPI 3' },
            { ini: 'S', tint: 'green' as Tint, name: 'SmartCard Group',   sub: '290 продано · 68 KPI 3' },
          ]).map((org, i, arr) => {
            const pal = tint(org.tint);
            return (
              <div key={org.name} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: pal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: F.inter, fontSize: 14, fontWeight: 600, color: pal.fg }}>{org.ini}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1 }}>{org.name}</div>
                  <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 1 }}>{org.sub}</div>
                </div>
                <ChevronRight size={20} color={t.textDisabled} />
              </div>
            );
          })}
        </div>
        <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.blue, padding: '10px 20px' }}>
            Показать все
          </span>
        </div>

        {/* 6. Activity */}
        <SH text="ПОСЛЕДНЯЯ АКТИВНОСТЬ" dark={dark} />
        <div style={{ margin: '0 16px', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden' }}>
          {([
            { tint: 'green' as Tint, text: 'KPI 3 выполнен: карта …4521',     time: '14 мин назад' },
            { tint: 'blue'  as Tint, text: 'Новая продажа: карта …3092',       time: '1 час назад' },
            { tint: 'amber' as Tint, text: 'Запрос на вывод: Санжар М.',       time: '2 часа назад' },
          ]).map((ev, i, arr) => {
            const pal = tint(ev.tint);
            return (
              <div key={ev.text} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: pal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: pal.fg }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.inter, fontSize: 14, color: t.text1 }}>{ev.text}</div>
                  <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text4, marginTop: 2 }}>{ev.time}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.blue, padding: '10px 20px' }}>
            Все уведомления
          </span>
        </div>

        {/* Bottom safe-area spacer */}
        <div style={{ height: 24 }} />
      </div>

      <TabBar dark={dark} />
      <HomeIndicator dark={dark} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PTR-SHOWING VARIANT (pull-to-refresh at top of scroll)
═══════════════════════════════════════════════════════════════════════════ */

function DashContentPTR({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <StatusBar dark={dark} />
      <Header dark={dark} />
      {/* PTR spinner visible */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 56, background: t.pageBg }}>
        <Loader2 size={22} color={t.blue} style={{ animation: 'mdsSpin 1s linear infinite' }} />
      </div>
      {/* Faded greeting to show the PTR is in progress */}
      <div style={{ padding: '4px 20px', opacity: 0.5 }}>
        <div style={{ fontFamily: F.dm, fontSize: 28, fontWeight: 700, color: t.text1, lineHeight: 1.1 }}>Привет, Админ!</div>
        <div style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, marginTop: 4 }}>Обновление данных…</div>
      </div>
      <div style={{ flex: 1 }} />
      <TabBar dark={dark} />
      <HomeIndicator dark={dark} />
      <style>{`@keyframes mdsSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPEC TABLE
═══════════════════════════════════════════════════════════════════════════ */

const SPEC = [
  { k: 'Page ID',                v: 'Y-06 · Tab 1 root · Bank Admin' },
  { k: 'Header',                  v: 'Navbar-style — "Moment KPI" left + bell (36×36 bordered, count badge) + divider + avatar (30px, blue ring) + ChevronDown' },
  { k: 'Tab bar',                v: 'Y-01 Bank — Дашборд active (index 0)' },
  { k: 'Greeting title',         v: 'DM Sans 32 / 700 · padding 20 px' },
  { k: 'Hero card gradient (L)', v: 'linear-gradient(135deg, #3B82F6 → #2563EB) · radius 20' },
  { k: 'Hero card gradient (D)', v: 'linear-gradient(135deg, #1E3A5F → #1A2B4A) · radius 20' },
  { k: 'Hero value',             v: 'DM Sans 32 / 700 · #FFFFFF' },
  { k: 'Hero trend pill',        v: 'rgba(255,255,255,0.18) bg · 13/600 white' },
  { k: 'Stat cards',             v: '2×2 grid · gap 12 · 44 px icon circle · DM Sans 24/700 value' },
  { k: 'Funnel bars',            v: '8 px height · progressTrack bg · 5 blue shades light→dark' },
  { k: 'Org list rows',          v: '36 px tinted avatar + 15/500 name + 13 sub + chevron' },
  { k: 'Activity rows',          v: '32 px tinted circle dot + 14 body + 12 caption' },
  { k: 'Text button',            v: 'Inter 15/500 · C/D.blue · center-aligned · padding 10×20' },
  { k: 'Section header',         v: 'Inter 11/600 uppercase · C/D.text3 · tracking 0.06em · pad 24-20-10' },
  { k: 'Pull-to-refresh',        v: 'Loader2 22 px spinning above greeting · content faded 50% during refresh' },
  { k: 'Safe area bottom',       v: '24 px spacer before tab bar + 34 pt safe area' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileDashboardShowcasePage() {
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
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Dashboard · Bank Admin</span>
          </div>

          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            Bank Admin Dashboard — Y-06
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: '0 0 8px', maxWidth: 900 }}>
            Tab 1 root. Greeting + hero KPI gradient card + 2×2 stat grid + funnel bars + top orgs list + activity feed + pull-to-refresh. References <span style={{ fontFamily: F.mono, color: t.text2 }}>X-00 §1 §2 §4 §5 §6</span>.
          </p>

          {/* §01 — Full page light + dark */}
          <SectionBlock num="1" title="Full page — light + dark" subtitle="Complete scrollable dashboard with all 6 content sections. Tab bar pinned at bottom." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <PhoneFrame dark={false} height={844} label="Bank Dashboard · Light">
                <DashContent dark={false} />
              </PhoneFrame>
              <PhoneFrame dark={true} height={844} label="Bank Dashboard · Dark">
                <DashContent dark={true} />
              </PhoneFrame>
            </div>
          </SectionBlock>

          {/* §02 — PTR state */}
          <SectionBlock num="2" title="Pull-to-refresh state" subtitle="Spinner visible at top of scroll area. Content faded during refresh." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <PhoneFrame dark={false} height={400} label="PTR · Light">
                <DashContentPTR dark={false} />
              </PhoneFrame>
              <PhoneFrame dark={true} height={400} label="PTR · Dark">
                <DashContentPTR dark={true} />
              </PhoneFrame>
            </div>
          </SectionBlock>

          {/* §03 — Spec */}
          <SectionBlock num="3" title="Design tokens" subtitle="All dashboard-specific values." t={t}>
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
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text4 }}>Mobile Dashboard · Bank Admin · Y-06 · Tab 1</span>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: t.textDisabled }}>© 2026 Moment Finance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
