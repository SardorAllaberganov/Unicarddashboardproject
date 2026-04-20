import React from 'react';
import {
  ChevronRight, ChevronLeft, X, Check, CreditCard, Lock, Share2,
  Search, SlidersHorizontal, LayoutDashboard, Building2,
  MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, SectionBlock } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE MULTI-SELECT MODE — Y-10
   Long-press or "Выбрать" action enters selection mode across list rows.
   Three static states (default · active · long-press entry) × light+dark.
═══════════════════════════════════════════════════════════════════════════ */

interface Card {
  pan: string;
  owner: string;
  kpi: 1 | 2 | 3;
}

const CARDS: Card[] = [
  { pan: '•••• 4521', owner: 'Абдуллох Рахимов',   kpi: 3 },
  { pan: '•••• 3092', owner: 'Дилшод Каримов',     kpi: 2 },
  { pan: '•••• 2204', owner: 'Нилуфар Каримова',   kpi: 3 },
  { pan: '•••• 1089', owner: 'Камола Расулова',    kpi: 1 },
  { pan: '•••• 7102', owner: 'Мухаммад Негматов',  kpi: 3 },
];

// Indices selected in State 2 (3 of 5 per the spec).
const SELECTED = new Set([0, 2, 3]);
// Index of the row captured mid-long-press in State 3.
const LONG_PRESS_INDEX = 1;

const PHONE_H = 720;

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED BITS — KPI chip, CreditCard tile, Checkbox circle
═══════════════════════════════════════════════════════════════════════════ */

function KpiChip({ kpi, t, dark }: { kpi: 1 | 2 | 3; t: T; dark: boolean }) {
  const palette = {
    1: {
      bg: dark ? 'rgba(217,119,6,0.15)' : '#FFFBEB',
      fg: dark ? '#FBBF24' : '#B45309',
      label: 'KPI 1',
    },
    2: {
      bg: dark ? 'rgba(37,99,235,0.18)' : '#EFF6FF',
      fg: dark ? '#60A5FA' : '#1D4ED8',
      label: 'KPI 2',
    },
    3: {
      bg: dark ? 'rgba(22,163,74,0.18)' : '#F0FDF4',
      fg: dark ? '#34D399' : '#15803D',
      label: 'KPI 3 ✓',
    },
  } as const;
  const cfg = palette[kpi];
  return (
    <span style={{
      fontFamily: F.inter, fontSize: 11, fontWeight: 600,
      padding: '3px 8px', borderRadius: 999,
      background: cfg.bg, color: cfg.fg,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

function CardIconTile({ t, dark, size = 40 }: { t: T; dark: boolean; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 10, flexShrink: 0,
      background: dark ? 'rgba(37,99,235,0.15)' : '#EFF6FF',
      border: `1px solid ${dark ? 'rgba(37,99,235,0.3)' : '#DBEAFE'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <CreditCard size={18} color={t.blue} strokeWidth={1.75} />
    </div>
  );
}

function CheckboxCircle({
  checked, t, dark, opacity = 1, size = 24,
}: { checked: boolean; t: T; dark: boolean; opacity?: number; size?: number }) {
  if (checked) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: t.blue, flexShrink: 0, opacity,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.15s',
      }}>
        <Check size={14} color="#FFFFFF" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `1.5px solid ${t.inputBorder}`,
      background: 'transparent',
      flexShrink: 0, opacity,
      transition: 'opacity 0.15s',
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATE 1 — DEFAULT LIST (reference)
═══════════════════════════════════════════════════════════════════════════ */

function State1_Default({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <ListHeader t={t} dark={dark} variant="default" />
      <div style={{ flex: 1, overflow: 'hidden', padding: '6px 0' }}>
        {CARDS.map((c, i) => (
          <CardRow key={i} card={c} t={t} dark={dark} mode="default" isLast={i === CARDS.length - 1} />
        ))}
      </div>
      <TabBar t={t} dark={dark} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATE 2 — SELECTION MODE ACTIVE (3 of 5 selected)
═══════════════════════════════════════════════════════════════════════════ */

function State2_Active({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <ListHeader t={t} dark={dark} variant="selection" count={SELECTED.size} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '6px 0' }}>
        {CARDS.map((c, i) => (
          <CardRow
            key={i}
            card={c}
            t={t}
            dark={dark}
            mode="selection"
            selected={SELECTED.has(i)}
            isLast={i === CARDS.length - 1}
          />
        ))}
      </div>
      <ContextualActionBar t={t} dark={dark} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATE 3 — LONG-PRESS ENTRY (mid-transition)
═══════════════════════════════════════════════════════════════════════════ */

function State3_LongPress({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <ListHeader t={t} dark={dark} variant="morph" count={1} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '6px 0' }}>
        {CARDS.map((c, i) => {
          const isPressed = i === LONG_PRESS_INDEX;
          return (
            <CardRow
              key={i}
              card={c}
              t={t}
              dark={dark}
              mode="morph"
              selected={isPressed}
              pressed={isPressed}
              isLast={i === CARDS.length - 1}
            />
          );
        })}
      </div>
      <ContextualActionBar t={t} dark={dark} entering />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIST HEADER — 3 variants: default / selection / morph
═══════════════════════════════════════════════════════════════════════════ */

function ListHeader({
  t, dark, variant, count = 0,
}: { t: T; dark: boolean; variant: 'default' | 'selection' | 'morph'; count?: number }) {
  return (
    <div style={{
      height: 52, flexShrink: 0, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 8px',
      background: t.surface, borderBottom: `1px solid ${t.border}`,
    }}>
      {variant === 'default' && (
        <>
          <IconBtn icon={ChevronLeft} t={t} />
          <span style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1,
            whiteSpace: 'nowrap',
          }}>
            Все карты
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconBtn icon={Search} t={t} muted />
            <IconBtn icon={SlidersHorizontal} t={t} muted />
          </div>
        </>
      )}

      {variant === 'selection' && (
        <>
          <IconBtn icon={X} t={t} />
          <span style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: t.text1,
            whiteSpace: 'nowrap',
          }}>
            Выбрано: {count}
          </span>
          <button style={{
            border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 13, fontWeight: 500, color: t.blue,
            padding: '0 12px', height: 40, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            Выбрать все
          </button>
        </>
      )}

      {variant === 'morph' && (
        <>
          {/* Old header at 50% opacity, new header fading in at 100% */}
          <div style={{ position: 'relative', width: 48, height: 48 }}>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35, transition: 'opacity 0.2s' }}>
              <ChevronLeft size={24} color={t.blue} strokeWidth={2} />
            </span>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.85, transition: 'opacity 0.2s' }}>
              <X size={22} color={t.text1} strokeWidth={2} />
            </span>
          </div>

          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            lineHeight: 1,
          }}>
            <span style={{
              fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1,
              opacity: 0.35, position: 'absolute', whiteSpace: 'nowrap',
            }}>
              Все карты
            </span>
            <span style={{
              fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: t.text1,
              opacity: 0.85, whiteSpace: 'nowrap',
            }}>
              Выбрано: {count}
            </span>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.35 }}>
              <IconBtn icon={Search} t={t} muted />
              <IconBtn icon={SlidersHorizontal} t={t} muted />
            </span>
            <span style={{
              position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
              fontFamily: F.inter, fontSize: 13, fontWeight: 500, color: t.blue,
              padding: '0 12px', opacity: 0.85, whiteSpace: 'nowrap',
            }}>
              Выбрать все
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function IconBtn({ icon: Icon, t, muted = false }: { icon: React.ElementType; t: T; muted?: boolean }) {
  return (
    <div style={{
      width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon
        size={muted ? 20 : 24}
        color={muted ? t.text2 : t.text1}
        strokeWidth={2}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARD ROW — supports default, selection, and morph modes
═══════════════════════════════════════════════════════════════════════════ */

function CardRow({
  card, t, dark, mode, selected = false, pressed = false, isLast,
}: {
  card: Card;
  t: T;
  dark: boolean;
  mode: 'default' | 'selection' | 'morph';
  selected?: boolean;
  pressed?: boolean;
  isLast: boolean;
}) {
  const selectionBg = dark ? '#1E2A4A' : '#EFF6FF';
  const rowBg = selected && mode === 'selection'
    ? selectionBg
    : t.surface;

  const pressedRing = pressed
    ? `0 0 0 2px ${dark ? 'rgba(59,130,246,0.35)' : 'rgba(37,99,235,0.3)'}`
    : 'none';

  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      background: rowBg,
      borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
      transform: pressed ? 'scale(1.02)' : 'scale(1)',
      transformOrigin: 'center',
      boxShadow: pressedRing,
      transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
    }}>
      {/* Leading element: icon tile / checkbox / morph transition */}
      {mode === 'default' && <CardIconTile t={t} dark={dark} />}

      {mode === 'selection' && (
        <CheckboxCircle checked={selected} t={t} dark={dark} />
      )}

      {mode === 'morph' && (
        <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', opacity: 0.35, transition: 'opacity 0.2s' }}>
            <CardIconTile t={t} dark={dark} />
          </span>
          <span style={{ position: 'absolute', opacity: 0.5, transition: 'opacity 0.2s' }}>
            <CheckboxCircle checked={selected} t={t} dark={dark} />
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.mono, fontSize: 14, fontWeight: 600, color: t.text1,
          lineHeight: 1.2,
        }}>
          {card.pan}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: 12, color: t.text3,
          marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {card.owner}
        </div>
      </div>

      {/* KPI chip — visible in all modes */}
      <KpiChip kpi={card.kpi} t={t} dark={dark} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB BAR — simplified 4-tab representation for default state
═══════════════════════════════════════════════════════════════════════════ */

function TabBar({ t, dark }: { t: T; dark: boolean }) {
  const tabs = [
    { icon: LayoutDashboard, label: 'Дашборд',     active: false },
    { icon: Building2,       label: 'Организации', active: false },
    { icon: CreditCard,      label: 'Карты',       active: true  },
    { icon: MoreHorizontal,  label: 'Ещё',         active: false },
  ];
  const bg = dark ? 'rgba(26,29,39,0.97)' : 'rgba(255,255,255,0.97)';
  return (
    <div style={{
      height: 64, flexShrink: 0, display: 'flex', alignItems: 'stretch',
      background: bg, borderTop: `1px solid ${t.border}`,
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    }}>
      {tabs.map((tab, i) => {
        const color = tab.active ? t.blue : t.text3;
        const Icon = tab.icon;
        return (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <Icon size={22} color={color} strokeWidth={tab.active ? 2 : 1.75} />
            <span style={{
              fontFamily: F.inter, fontSize: 11,
              fontWeight: tab.active ? 600 : 500, color,
            }}>
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTEXTUAL ACTION BAR — replaces tab bar in selection mode
   Actions per spec for Cards List: Назначить / Заблокировать / Экспорт / Отмена
═══════════════════════════════════════════════════════════════════════════ */

function ContextualActionBar({
  t, dark, entering = false,
}: { t: T; dark: boolean; entering?: boolean }) {
  const actions = [
    { icon: CreditCard, label: 'Назначить',     primary: true,         destructive: false },
    { icon: Lock,       label: 'Заблокировать', primary: false,        destructive: false },
    { icon: Share2,     label: 'Экспорт',       primary: false,        destructive: false },
    { icon: X,          label: 'Отмена',        primary: false,        destructive: false, neutral: true },
  ];

  return (
    <div style={{
      height: 64, flexShrink: 0, display: 'flex', alignItems: 'stretch',
      background: t.surface, borderTop: `1px solid ${t.border}`,
      padding: '0 4px',
      opacity: entering ? 0.85 : 1,
      transition: 'opacity 0.2s',
    }}>
      {actions.map((a, i) => {
        const color = a.primary
          ? t.blue
          : a.destructive
            ? (dark ? '#F87171' : '#DC2626')
            : (a.neutral ? t.text3 : t.text2);
        const Icon = a.icon;
        return (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            padding: '6px 0',
          }}>
            <Icon size={20} color={color} strokeWidth={a.primary ? 2 : 1.75} />
            <span style={{
              fontFamily: F.inter, fontSize: 11,
              fontWeight: a.primary ? 600 : 500, color,
              whiteSpace: 'nowrap',
            }}>
              {a.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DESKTOP CANVAS — 3 states × light+dark pair each
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileMultiSelectShowcasePage() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const t = theme(darkMode);

  const sections: Array<{
    num: string; title: string; subtitle: string;
    light: React.ReactNode; dark: React.ReactNode;
  }> = [
    {
      num: '1',
      title: 'Default list (reference)',
      subtitle: 'Y-09 cards list in its normal state — 52 px header with back + search + filter, 5 rows with tinted icon tile, masked PAN, owner, KPI chip, and the standard bottom tab bar.',
      light: <State1_Default dark={false} />,
      dark:  <State1_Default dark={true}  />,
    },
    {
      num: '2',
      title: 'Selection mode active — 3 of 5 selected',
      subtitle: 'Header replaces back + title + action icons with X close / "Выбрано: N" / "Выбрать все". Icon tiles swap for 24 px checkbox circles (filled blue + check when selected, outline when not); selected rows tint to #EFF6FF / #1E2A4A. Tab bar is replaced by a contextual action bar — CreditCard Назначить (primary blue), Lock Заблокировать, Share2 Экспорт, X Отмена.',
      light: <State2_Active dark={false} />,
      dark:  <State2_Active dark={true}  />,
    },
    {
      num: '3',
      title: 'Long-press entry (mid-transition)',
      subtitle: 'Single-frame capture as the user long-presses a row. The pressed row scales to 1.02 and gains a subtle 2 px blue glow ring (haptic-feedback indicator). Checkboxes cross-fade in over icon tiles at ~40 % opacity. Header cross-fades between default and selection variants. Bottom bar slides up beneath the tab bar.',
      light: <State3_LongPress dark={false} />,
      dark:  <State3_LongPress dark={true}  />,
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar
        role="bank"
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
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Дизайн-система</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/mobile-design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Mobile</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Multi-select Mode · Y-10</span>
          </div>

          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            Mobile Multi-select Mode — Y-10
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: '0 0 8px', maxWidth: 900 }}>
            Entered by a 400 ms long-press on any list row or by tapping a "Выбрать" action in the row's ⋯ menu. Exits via X in the header or the Отмена action. Context: cards list (Y-09) with 3 of 5 selected. All three states shown with PhoneFrame pairs (light + dark).
          </p>

          {sections.map(s => (
            <SectionBlock key={s.num} num={s.num} title={s.title} subtitle={s.subtitle} t={t}>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <PhoneFrame dark={false} height={PHONE_H} label={`${s.title} · Light`}>
                  {s.light}
                </PhoneFrame>
                <PhoneFrame dark={true} height={PHONE_H} label={`${s.title} · Dark`}>
                  {s.dark}
                </PhoneFrame>
              </div>
            </SectionBlock>
          ))}
        </div>
      </div>
    </div>
  );
}
