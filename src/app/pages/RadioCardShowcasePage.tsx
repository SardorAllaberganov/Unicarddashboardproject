import React, { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { RadioGroup, RadioIndicator } from '../components/RadioCard';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   RADIO CARD SHOWCASE — Prompt 0 §11

   Developer reference: all 5 states rendered side-by-side as pinned
   light + dark variants. Matrix cells are locked via <RadioGroup dark> /
   <StaticCard dark> — they do NOT respond to the global theme toggle.
═══════════════════════════════════════════════════════════════════════════ */

type Recipient = 'all' | 'orgs' | 'users';

const LIGHT_BG      = '#F9FAFB';
const LIGHT_BORDER  = '#E5E7EB';
const DARK_BG       = '#0F1117';
const DARK_BORDER   = '#2D3148';

const OPTIONS = [
  { value: 'all' as const,   label: 'Все организации',        sub: 'Отправить всем активным администраторам организаций' },
  { value: 'orgs' as const,  label: 'Выбранные организации',  sub: 'Выбрать конкретные организации из списка' },
  { value: 'users' as const, label: 'Конкретные пользователи', sub: 'Поиск отдельных получателей по имени' },
];

type CardState = 'default' | 'selected' | 'hover' | 'focused' | 'disabled';

const STATES: { label: string; sub: string; state: CardState }[] = [
  { label: 'Default',  sub: 'Unselected resting state',                state: 'default'  },
  { label: 'Hover',    sub: 'Pointer over unselected option',          state: 'hover'    },
  { label: 'Selected', sub: 'Active option, blue border + bg',         state: 'selected' },
  { label: 'Focused',  sub: 'Keyboard focus ring via :focus-visible',  state: 'focused'  },
  { label: 'Disabled', sub: 'Non-interactive, muted text',             state: 'disabled' },
];

export default function RadioCardShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const [recipient, setRecipient] = useState<Recipient>('orgs');
  const navigate = useNavigate();

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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Radio cards</span>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
            Radio card — доступная группа
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '6px 0 24px', lineHeight: 1.5 }}>
            Prompt 0 §11 — WAI-ARIA <code style={inlineCode(t)}>radiogroup</code> pattern с roving-tabindex.
            Используется в M-03 (получатели), C-05 (назначение карт) и любых формах с выбором одного из нескольких вариантов.
          </p>

          {/* 1. Live demo — follows global theme */}
          <ContextFrame caption="1. LIVE — интерактивная группа (попробуйте Tab + стрелки)" t={t}>
            <div style={{ maxWidth: '560px' }}>
              <RadioGroup
                label="Получатели"
                name="recipient"
                value={recipient}
                options={OPTIONS}
                onChange={setRecipient}
                orientation="vertical"
              />
              <div style={{
                marginTop: '12px',
                fontFamily: F.inter, fontSize: '12px', color: t.text3,
              }}>
                Выбрано:{' '}
                <code style={inlineCode(t)}>{recipient}</code>
              </div>
            </div>
          </ContextFrame>

          {/* 2. Keyboard interaction diagram */}
          <ContextFrame caption="2. KEYBOARD — навигация" t={t}>
            <div style={{
              display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '10px', columnGap: '16px',
              fontFamily: F.inter, fontSize: '13px', color: t.text2,
            }}>
              <KbdRow t={t} keys={['Tab']} desc="Фокусирует группу. Получает фокус выбранный элемент (или первый, если ничего не выбрано)." />
              <KbdRow t={t} keys={['↑', '↓']} desc="Перемещает выбор между опциями. Wrap-around: с последней на первую и наоборот." />
              <KbdRow t={t} keys={['←', '→']} desc="То же, что и ↑/↓. Работает и для горизонтальных групп." />
              <KbdRow t={t} keys={['Space']} desc="Выбирает сфокусированную опцию (эквивалентно стрелкам в radiogroup)." />
              <KbdRow t={t} keys={['Home']} desc="Переход на первую опцию." />
              <KbdRow t={t} keys={['End']} desc="Переход на последнюю." />
            </div>
            <div style={{
              marginTop: '14px', padding: '10px 12px',
              background: darkMode ? D.tableAlt : '#F9FAFB', borderRadius: '6px',
              fontFamily: F.inter, fontSize: '12px', color: t.text3, lineHeight: 1.5,
            }}>
              <b style={{ color: t.text1, fontWeight: 600 }}>Roving tabindex:</b>{' '}
              только одна опция (выбранная) имеет <code style={inlineCode(t)}>tabIndex=0</code>,
              остальные — <code style={inlineCode(t)}>tabIndex=-1</code>. Поэтому Tab проходит группу
              одним шагом, а внутреннюю навигацию ведут стрелки — как рекомендует WAI-ARIA.
            </div>
          </ContextFrame>

          {/* 3. All 5 states × 2 themes — pinned matrix */}
          <ContextFrame caption="3. STATES — все 5 состояний в light + dark (pinned)" t={t}>
            {/* Column headers row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 1fr',
              columnGap: '18px',
              marginBottom: '12px',
            }}>
              <div />
              <ColumnHeader tone="light" />
              <ColumnHeader tone="dark" />
            </div>

            {/* State rows */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 1fr',
              columnGap: '18px',
              rowGap: '14px',
              alignItems: 'stretch',
            }}>
              {STATES.map(s => (
                <React.Fragment key={s.state}>
                  <StateLabel t={t} label={s.label} sub={s.sub} />
                  <PinnedCell tone="light">
                    <StaticCard state={s.state} dark={false} />
                  </PinnedCell>
                  <PinnedCell tone="dark">
                    <StaticCard state={s.state} dark={true} />
                  </PinnedCell>
                </React.Fragment>
              ))}
            </div>
          </ContextFrame>

          {/* 4. Live interactive pair — pinned */}
          <ContextFrame caption="4. LIVE PAIR — полная группа в обоих темах (pinned)" t={t}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
            }}>
              <PinnedCell tone="light">
                <LivePair dark={false} />
              </PinnedCell>
              <PinnedCell tone="dark">
                <LivePair dark={true} />
              </PinnedCell>
            </div>
          </ContextFrame>

          {/* 5. Dev note */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '12px 14px',
            background: t.blueLt, borderLeft: `3px solid ${t.blue}`,
            borderRadius: '8px', marginTop: '16px',
          }}>
            <Info size={16} color={t.blue} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2, lineHeight: 1.5 }}>
              <b style={{ color: t.text1, fontWeight: 600 }}>Apply identical pattern to all radio groups and checkbox card groups across the platform.</b>
              {' '}Используйте <code style={inlineCode(t)}>:focus-visible</code>, а не{' '}
              <code style={inlineCode(t)}>:focus</code> — кольцо появляется только для клавиатурного фокуса,
              не для кликов мышью.
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE PAIR — interactive radio group pinned to a single theme
═══════════════════════════════════════════════════════════════════════════ */

function LivePair({ dark }: { dark: boolean }) {
  const [value, setValue] = useState<Recipient>('orgs');
  return (
    <RadioGroup
      label="Получатели"
      name={`recipient-${dark ? 'dark' : 'light'}`}
      value={value}
      options={OPTIONS}
      onChange={setValue}
      orientation="vertical"
      dark={dark}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC CARD — non-interactive render of a single state × theme
═══════════════════════════════════════════════════════════════════════════ */

function StaticCard({ state, dark }: { state: CardState; dark: boolean }) {
  const t = theme(dark);
  const selected = state === 'selected';
  const focused  = state === 'focused';
  const hov      = state === 'hover';
  const disabled = state === 'disabled';

  let border: string;
  let padding: string;
  let bg: string;
  let titleColor: string;
  let subColor: string;

  if (disabled) {
    border     = `1px solid ${dark ? D.border : C.inputBorder}`;
    padding    = '12px';
    bg         = dark ? D.tableAlt : '#F9FAFB';
    titleColor = dark ? D.text4    : C.text4;
    subColor   = dark ? D.text4    : C.text4;
  } else if (selected) {
    border     = `2px solid ${t.blue}`;
    padding    = '11px';
    bg         = t.blueLt;
    titleColor = dark ? D.text1 : C.text1;
    subColor   = dark ? D.text2 : C.text3;
  } else if (hov) {
    border     = `1px solid ${dark ? D.text4 : '#9CA3AF'}`;
    padding    = '12px';
    bg         = dark ? D.tableHover : '#F9FAFB';
    titleColor = dark ? D.text1 : C.text1;
    subColor   = dark ? D.text2 : C.text3;
  } else {
    border     = `1px solid ${dark ? D.border : C.inputBorder}`;
    padding    = '12px';
    bg         = dark ? D.surface : '#FFFFFF';
    titleColor = dark ? D.text1 : C.text1;
    subColor   = dark ? D.text2 : C.text3;
  }

  return (
    <div style={{
      padding,
      border,
      borderRadius: '10px',
      background: bg,
      outline: focused ? `2px solid ${t.focusRing}` : 'none',
      outlineOffset: focused ? '2px' : 0,
      opacity: disabled ? 0.7 : 1,
      display: 'flex', alignItems: 'flex-start', gap: '10px',
    }}>
      <RadioIndicator selected={selected} disabled={disabled} dark={dark} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
          color: titleColor, lineHeight: 1.3,
        }}>
          Выбранные организации
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: subColor,
          marginTop: '3px', lineHeight: 1.4,
        }}>
          Выбрать конкретные организации из списка
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PINNED CELL — locks background/border to its tone regardless of global theme
═══════════════════════════════════════════════════════════════════════════ */

function PinnedCell({ tone, children }: { tone: 'light' | 'dark'; children: React.ReactNode }) {
  const isDark = tone === 'dark';
  const bg     = isDark ? DARK_BG     : LIGHT_BG;
  const border = isDark ? DARK_BORDER : LIGHT_BORDER;
  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      padding: '16px',
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUPPORT COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function ColumnHeader({ tone }: { tone: 'light' | 'dark' }) {
  const isDark = tone === 'dark';
  const labelColor = isDark ? D.text3 : C.text3;
  const swatchBg   = isDark ? D.surface : '#FFFFFF';
  const swatchBorder = isDark ? D.border : C.border;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 700,
      color: labelColor, textTransform: 'uppercase', letterSpacing: '0.08em',
      padding: '0 4px',
    }}>
      <span style={{
        width: '10px', height: '10px', borderRadius: '3px',
        background: swatchBg,
        border: `1px solid ${swatchBorder}`,
      }} />
      {tone}
    </div>
  );
}

function StateLabel({ t, label, sub }: { t: T; label: string; sub: string }) {
  return (
    <div style={{ paddingTop: '4px' }}>
      <div style={{
        fontFamily: F.inter, fontSize: '12px', fontWeight: 700,
        color: t.text2, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: F.inter, fontSize: '11px', color: t.text4,
        marginTop: '3px', lineHeight: 1.4,
      }}>
        {sub}
      </div>
    </div>
  );
}

function KbdRow({ t, keys, desc }: { t: T; keys: string[]; desc: string }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {keys.map((k, i) => (
          <React.Fragment key={i}>
            <Kbd t={t}>{k}</Kbd>
            {i < keys.length - 1 && <span style={{ color: t.text4 }}>/</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ lineHeight: 1.5 }}>{desc}</div>
    </>
  );
}

function Kbd({ t, children }: { t: T; children: React.ReactNode }) {
  return (
    <kbd style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: '28px', height: '24px', padding: '0 7px',
      fontFamily: F.mono, fontSize: '12px', fontWeight: 600,
      color: t.text2,
      background: t.surface,
      border: `1px solid ${t.inputBorder}`, borderRadius: '5px',
      boxShadow: `0 1px 0 ${t.border}`,
    }}>
      {children}
    </kbd>
  );
}

function ContextFrame({ caption, children, t }: { caption: string; children: React.ReactNode; t: T }) {
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: '12px', overflow: 'hidden',
      marginBottom: '16px',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: `1px solid ${t.border}`,
        background: t.tableHeaderBg,
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
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
   STYLES
═══════════════════════════════════════════════════════════════════════════ */

function inlineCode(t: T): React.CSSProperties {
  return {
    fontFamily: F.mono, fontSize: '11px',
    padding: '1px 6px', borderRadius: '4px',
    background: t.surface, border: `1px solid ${t.border}`,
    color: t.text1,
  };
}
