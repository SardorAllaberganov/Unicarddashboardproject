import React from 'react';
import {
  ChevronLeft, Menu, Bell, MoreHorizontal, X, LayoutDashboard, Building2, CreditCard,
  Users, TrendingUp, Settings, FileSpreadsheet, ArrowDownToLine, Wallet, BellRing,
  Megaphone, UserCog, Package,
} from 'lucide-react';
import { F, D, theme, MDS, Pair, VariantLabel, T } from './frame';

/* ═══════════════════════════════════════════════════════════════════════════
   §1 TOP HEADER VARIANTS
═══════════════════════════════════════════════════════════════════════════ */

function StatusBar({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      height: MDS.safeTop, width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px 8px', boxSizing: 'border-box',
    }}>
      <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: t.text1 }}>9:41</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <div style={{ width: '16px', height: '10px', borderRadius: '2px', border: `1px solid ${t.text1}`, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '2px', background: t.text1, width: '9px', borderRadius: '1px' }} />
        </div>
      </div>
    </div>
  );
}

function HeaderShell({
  dark, variant, title, scrolled = false, leftIcon, leftLabel, rightIcons = [], rightLabel,
}: {
  dark: boolean;
  variant: 'root' | 'detail' | 'modal' | 'large';
  title?: string;
  scrolled?: boolean;
  leftIcon?: React.ReactNode;
  leftLabel?: string;
  rightIcons?: React.ReactNode[];
  rightLabel?: string;
}) {
  const t = theme(dark);
  const bg = scrolled ? t.surface : 'transparent';
  const border = scrolled ? `1px solid ${t.border}` : '1px solid transparent';
  return (
    <div style={{
      height: MDS.headerH, width: '100%', position: 'relative',
      display: 'flex', alignItems: 'center', padding: '0 8px',
      background: bg, borderBottom: border, boxSizing: 'border-box',
      backdropFilter: scrolled ? 'blur(12px)' : undefined,
    }}>
      <div style={{ minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '8px', gap: '4px' }}>
        {leftIcon}
        {leftLabel && <span style={{ fontFamily: F.inter, fontSize: '15px', color: t.blue }}>{leftLabel}</span>}
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        {title && variant !== 'large' && (
          <span style={{ fontFamily: F.inter, fontSize: '17px', fontWeight: 600, color: t.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </span>
        )}
      </div>
      <div style={{ minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', paddingRight: '8px' }}>
        {rightLabel && <span style={{ fontFamily: F.inter, fontSize: '16px', fontWeight: 600, color: t.blue }}>{rightLabel}</span>}
        {rightIcons.map((ic, i) => <div key={i} style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ic}</div>)}
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, dark, badge }: { icon: React.ElementType; dark: boolean; badge?: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={24} color={t.text1} strokeWidth={1.75} />
      {badge && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 8, height: 8, borderRadius: '50%',
          background: t.error,
          border: `2px solid ${t.surface}`,
        }} />
      )}
    </div>
  );
}

function PreviewFiller({ dark, title }: { dark: boolean; title?: string }) {
  const t = theme(dark);
  return (
    <div style={{ padding: '16px 16px 24px' }}>
      {title && (
        <h1 style={{ fontFamily: F.dm, fontSize: '32px', fontWeight: 700, color: t.text1, margin: '8px 0 12px', lineHeight: 1.1 }}>
          {title}
        </h1>
      )}
      <div style={{ fontFamily: F.inter, fontSize: '15px', color: t.text3 }}>
        Содержимое страницы прокручивается здесь…
      </div>
    </div>
  );
}

function HeaderVariantsCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark={dark} />

      {/* Variant A — Root */}
      <div style={{ padding: '4px 16px 2px' }}>
        <VariantLabel text="A · Root (menu + bell)" dark={dark} />
      </div>
      <HeaderShell
        dark={dark} variant="root" title="Дашборд" scrolled
        leftIcon={<IconButton icon={Menu} dark={dark} />}
        rightIcons={[<IconButton icon={Bell} dark={dark} badge />]}
      />
      <div style={{ height: 16 }} />

      {/* Variant B — Detail */}
      <div style={{ padding: '4px 16px 2px' }}>
        <VariantLabel text="B · Detail (back + ⋯)" dark={dark} />
      </div>
      <HeaderShell
        dark={dark} variant="detail" title="Mysafar OOO" scrolled
        leftIcon={<div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={t.blue} strokeWidth={2} />
        </div>}
        rightIcons={[<IconButton icon={MoreHorizontal} dark={dark} />]}
      />
      <div style={{ height: 16 }} />

      {/* Variant C — Modal */}
      <div style={{ padding: '4px 16px 2px' }}>
        <VariantLabel text="C · Modal (X + Готово)" dark={dark} />
      </div>
      <HeaderShell
        dark={dark} variant="modal" title="Новая партия" scrolled
        leftIcon={<IconButton icon={X} dark={dark} />}
        rightLabel="Готово"
      />
      <div style={{ height: 16 }} />

      {/* Variant D — Large title */}
      <div style={{ padding: '4px 16px 2px' }}>
        <VariantLabel text="D · Large title (inline H1)" dark={dark} />
      </div>
      <HeaderShell
        dark={dark} variant="large"
        leftIcon={<IconButton icon={Menu} dark={dark} />}
        rightIcons={[<IconButton icon={Bell} dark={dark} badge />]}
      />
      <PreviewFiller dark={dark} title="Дашборд" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   §2 BOTTOM TAB BAR
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

function TabBar({
  tabs, activeIndex, dark, withBadge,
}: { tabs: TabDef[]; activeIndex: number; dark: boolean; withBadge?: number }) {
  const t = theme(dark);
  const bg = dark ? MDS.tabBarDark : MDS.tabBarLight;
  return (
    <div style={{
      width: '100%', height: MDS.tabBarH,
      background: bg, backdropFilter: 'blur(16px)',
      borderTop: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'stretch',
      boxSizing: 'border-box',
    }}>
      {tabs.map((tab, i) => {
        const active = i === activeIndex;
        const Icon = tab.icon;
        const color = active ? t.blue : t.text3;
        return (
          <div key={tab.label} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '4px', position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              <Icon size={28} color={color} strokeWidth={active ? 2 : 1.75} />
              {withBadge && i === 0 && (
                <div style={{
                  position: 'absolute', top: -2, right: -6,
                  minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
                  background: t.error,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${dark ? '#1A1D27' : '#FFFFFF'}`,
                  fontFamily: F.inter, fontSize: '10px', fontWeight: 700, color: '#FFFFFF',
                }}>
                  {withBadge}
                </div>
              )}
            </div>
            <span style={{
              fontFamily: F.inter, fontSize: '11px',
              fontWeight: active ? 600 : 500, color,
            }}>
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TabBarsCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StatusBar dark={dark} />
      <div style={{ padding: '4px 16px 2px' }}>
        <VariantLabel text="Bank Admin · active Дашборд · bell badge ‘3’" dark={dark} />
      </div>
      <div style={{ flex: 1, background: t.pageBg, padding: '12px 16px', fontFamily: F.inter, fontSize: '14px', color: t.text3 }}>
        (content region)
      </div>
      <TabBar tabs={BANK_TABS} activeIndex={0} dark={dark} withBadge={3} />

      <div style={{ padding: '12px 16px 2px' }}>
        <VariantLabel text="Org Admin · active Дашборд" dark={dark} />
      </div>
      <div style={{ flex: 1, background: t.pageBg, padding: '12px 16px', fontFamily: F.inter, fontSize: '14px', color: t.text3 }}>
        (content region)
      </div>
      <TabBar tabs={ORG_TABS} activeIndex={0} dark={dark} />
      <div style={{ height: MDS.safeBottom, background: dark ? MDS.tabBarDark : MDS.tabBarLight }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   §3 MORE MENU — APP GRID
═══════════════════════════════════════════════════════════════════════════ */

type TileColor = 'blue' | 'violet' | 'green' | 'cyan' | 'amber' | 'rose' | 'neutral';

const TILE_LIGHT: Record<TileColor, { bg: string; fg: string }> = {
  blue:    { bg: '#EFF6FF', fg: '#2563EB' },
  violet:  { bg: '#F3F0FF', fg: '#7C3AED' },
  green:   { bg: '#F0FDF4', fg: '#16A34A' },
  cyan:    { bg: '#ECFEFF', fg: '#0891B2' },
  amber:   { bg: '#FFFBEB', fg: '#D97706' },
  rose:    { bg: '#FFF1F2', fg: '#E11D48' },
  neutral: { bg: '#F3F4F6', fg: '#4B5563' },
};

const TILE_DARK: Record<TileColor, { bg: string; fg: string }> = {
  blue:    { bg: 'rgba(59,130,246,0.15)',  fg: '#3B82F6' },
  violet:  { bg: 'rgba(167,139,250,0.15)', fg: '#A78BFA' },
  green:   { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' },
  cyan:    { bg: 'rgba(34,211,238,0.15)',  fg: '#22D3EE' },
  amber:   { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
  rose:    { bg: 'rgba(251,113,133,0.15)', fg: '#FB7185' },
  neutral: { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' },
};

function MoreTile({ icon: Icon, label, color, dark }: { icon: React.ElementType; label: string; color: TileColor; dark: boolean }) {
  const t = theme(dark);
  const pal = (dark ? TILE_DARK : TILE_LIGHT)[color];
  return (
    <div style={{
      width: 100, height: 100,
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: 20,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '10px', boxSizing: 'border-box', gap: 8,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: pal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={24} color={pal.fg} strokeWidth={2} />
      </div>
      <span style={{
        fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
        color: t.text2, textAlign: 'center', lineHeight: 1.2,
      }}>
        {label}
      </span>
    </div>
  );
}

type TileDef = { icon: React.ElementType; label: string; color: TileColor };

const MORE_SECTIONS: Array<{ section: string; tiles: TileDef[] }> = [
  {
    section: 'АНАЛИТИКА',
    tiles: [
      { icon: TrendingUp,      label: 'Отчёты',     color: 'blue' },
      { icon: FileSpreadsheet, label: 'Экспорт',    color: 'violet' },
      { icon: BellRing,        label: 'Правила',    color: 'amber' },
    ],
  },
  {
    section: 'ФИНАНСЫ',
    tiles: [
      { icon: Wallet,           label: 'UCOIN',     color: 'green' },
      { icon: ArrowDownToLine,  label: 'Вывод',     color: 'cyan' },
      { icon: Package,          label: 'Партии',    color: 'rose' },
    ],
  },
  {
    section: 'СИСТЕМА',
    tiles: [
      { icon: UserCog,   label: 'Пользователи', color: 'blue' },
      { icon: Megaphone, label: 'Объявления',   color: 'violet' },
      { icon: Settings,  label: 'Настройки',    color: 'neutral' },
    ],
  },
];

function MoreMenuCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <StatusBar dark={dark} />
      <HeaderShell
        dark={dark} variant="root"
        leftIcon={<IconButton icon={Menu} dark={dark} />}
        rightIcons={[<IconButton icon={Bell} dark={dark} />]}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        <h1 style={{ fontFamily: F.dm, fontSize: '32px', fontWeight: 700, color: t.text1, margin: '4px 0 20px', lineHeight: 1.1 }}>
          Ещё
        </h1>
        {MORE_SECTIONS.map((s) => (
          <div key={s.section} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
              color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: '8px 4px 12px',
            }}>
              {s.section}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {s.tiles.map((tile) => (
                <MoreTile key={tile.label} icon={tile.icon} label={tile.label} color={tile.color} dark={dark} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <TabBar tabs={BANK_TABS} activeIndex={3} dark={dark} />
      <div style={{ height: MDS.safeBottom, background: dark ? MDS.tabBarDark : MDS.tabBarLight }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC EXPORTS
═══════════════════════════════════════════════════════════════════════════ */

export const M_Navigation = {
  Headers: ({ t: _t }: { t: T }) => (
    <Pair height={640} note="Variants A–D stacked in one frame. Scroll state = elevated bg + 1 px border; transparent at top.">
      {(dark) => <HeaderVariantsCol dark={dark} />}
    </Pair>
  ),
  TabBars: ({ t: _t }: { t: T }) => (
    <Pair height={620} note="Bank Admin + Org Admin, both with active ‘Дашборд’. Bank variant shows a 3-count bell badge on tab 0.">
      {(dark) => <TabBarsCol dark={dark} />}
    </Pair>
  ),
  MoreMenu: ({ t: _t }: { t: T }) => (
    <Pair height={780} note="Opened from the ‘Ещё’ tab. 3-column grid, grouped by section, tiles are 100×100 with a 48 px tinted icon circle.">
      {(dark) => <MoreMenuCol dark={dark} />}
    </Pair>
  ),
};
