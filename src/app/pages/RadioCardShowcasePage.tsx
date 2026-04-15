import React, { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { RadioGroup, RadioIndicator } from '../components/RadioCard';

/* ═══════════════════════════════════════════════════════════════════════════
   RADIO CARD SHOWCASE — Prompt 0 §11
   Demonstrates the accessible radio group pattern used in M-03 and C-05.
═══════════════════════════════════════════════════════════════════════════ */

type Recipient = 'all' | 'orgs' | 'users';

const OPTIONS = [
  { value: 'all' as const,   label: 'Все организации',       sub: 'Отправить всем активным администраторам организаций' },
  { value: 'orgs' as const,  label: 'Выбранные организации', sub: 'Выбрать конкретные организации из списка' },
  { value: 'users' as const, label: 'Конкретные пользователи', sub: 'Поиск отдельных получателей по имени' },
];

export default function RadioCardShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [recipient, setRecipient] = useState<Recipient>('orgs');
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
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
              style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}
            >
              Дизайн-система
            </span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Radio cards</span>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
            Radio card — доступная группа
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '6px 0 24px', lineHeight: 1.5 }}>
            Prompt 0 §11 — WAI-ARIA <code style={codeInline}>radiogroup</code> pattern с роiving-tabindex.
            Используется в M-03 (получатели), C-05 (назначение карт) и любых формах с выбором одного из нескольких вариантов.
          </p>

          {/* 1. Live demo */}
          <ContextFrame caption="1. LIVE — интерактивная группа (попробуйте Tab + стрелки)">
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
                fontFamily: F.inter, fontSize: '12px', color: C.text3,
              }}>
                Выбрано:{' '}
                <code style={codeInline}>{recipient}</code>
              </div>
            </div>
          </ContextFrame>

          {/* 2. Keyboard interaction diagram */}
          <ContextFrame caption="2. KEYBOARD — навигация">
            <div style={{
              display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '10px', columnGap: '16px',
              fontFamily: F.inter, fontSize: '13px', color: C.text2,
            }}>
              <KbdRow keys={['Tab']} desc="Фокусирует группу. Получает фокус выбранный элемент (или первый, если ничего не выбрано)." />
              <KbdRow keys={['↑', '↓']} desc="Перемещает выбор между опциями. Wrap-around: с последней на первую и наоборот." />
              <KbdRow keys={['←', '→']} desc="То же, что и ↑/↓. Работает и для горизонтальных групп." />
              <KbdRow keys={['Space']} desc="Выбирает сфокусированную опцию (эквивалентно стрелкам в radiogroup)." />
              <KbdRow keys={['Home']} desc="Переход на первую опцию." />
              <KbdRow keys={['End']} desc="Переход на последнюю." />
            </div>
            <div style={{
              marginTop: '14px', padding: '10px 12px',
              background: '#F9FAFB', borderRadius: '6px',
              fontFamily: F.inter, fontSize: '12px', color: C.text3, lineHeight: 1.5,
            }}>
              <b style={{ color: C.text1, fontWeight: 600 }}>Roving tabindex:</b>{' '}
              только одна опция (выбранная) имеет <code style={codeInline}>tabIndex=0</code>,
              остальные — <code style={codeInline}>tabIndex=-1</code>. Поэтому Tab проходит группу
              одним шагом, а внутреннюю навигацию ведут стрелки — как рекомендует WAI-ARIA.
            </div>
          </ContextFrame>

          {/* 3. Focus state matrix */}
          <ContextFrame caption="3. FOCUS STATES — 4 варианта каждой карточки">
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px',
            }}>
              <StateFrame label="Default">
                <StaticCard selected={false} focused={false} />
              </StateFrame>
              <StateFrame label="Focused (keyboard)">
                <StaticCard selected={false} focused={true} />
              </StateFrame>
              <StateFrame label="Selected (no focus)">
                <StaticCard selected={true} focused={false} />
              </StateFrame>
              <StateFrame label="Focused + Selected">
                <StaticCard selected={true} focused={true} />
              </StateFrame>
            </div>
          </ContextFrame>

          {/* 4. Dev note */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '12px 14px',
            background: C.blueLt, borderLeft: `3px solid ${C.blue}`,
            borderRadius: '8px', marginTop: '16px',
          }}>
            <Info size={16} color={C.blue} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2, lineHeight: 1.5 }}>
              <b style={{ color: C.text1, fontWeight: 600 }}>Apply identical pattern to all radio groups and checkbox card groups across the platform.</b>
              {' '}Используйте <code style={codeInline}>:focus-visible</code>, а не{' '}
              <code style={codeInline}>:focus</code> — кольцо появляется только для клавиатурного фокуса,
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
   STATIC CARD — non-interactive render of a single state
═══════════════════════════════════════════════════════════════════════════ */

function StaticCard({ selected, focused }: { selected: boolean; focused: boolean }) {
  const border = selected ? `2px solid ${C.blue}` : `1px solid ${C.inputBorder}`;
  const padding = selected ? '11px' : '12px';
  const bg = selected ? '#EFF6FF' : C.surface;

  return (
    <div style={{
      padding,
      border,
      borderRadius: '10px',
      background: bg,
      outline: focused ? `2px solid ${C.blue}` : 'none',
      outlineOffset: focused ? '2px' : 0,
      display: 'flex', alignItems: 'flex-start', gap: '10px',
    }}>
      <RadioIndicator selected={selected} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
          color: C.text1, lineHeight: 1.3,
        }}>
          Выбранные организации
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: C.text3,
          marginTop: '3px', lineHeight: 1.4,
        }}>
          Выбрать конкретные организации из списка
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUPPORT COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function KbdRow({ keys, desc }: { keys: string[]; desc: string }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {keys.map((k, i) => (
          <React.Fragment key={i}>
            <Kbd>{k}</Kbd>
            {i < keys.length - 1 && <span style={{ color: C.text4 }}>/</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ lineHeight: 1.5 }}>{desc}</div>
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: '28px', height: '24px', padding: '0 7px',
      fontFamily: F.mono, fontSize: '12px', fontWeight: 600,
      color: C.text2,
      background: C.surface,
      border: `1px solid ${C.inputBorder}`, borderRadius: '5px',
      boxShadow: `0 1px 0 ${C.border}`,
    }}>
      {children}
    </kbd>
  );
}

function StateFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      <span style={{
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </span>
      <div style={{ padding: '6px' /* room for focus ring */ }}>
        {children}
      </div>
    </div>
  );
}

function ContextFrame({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', overflow: 'hidden',
      marginBottom: '16px',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: `1px solid ${C.border}`,
        background: '#F9FAFB',
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
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

const codeInline: React.CSSProperties = {
  fontFamily: F.mono, fontSize: '11px',
  padding: '1px 6px', borderRadius: '4px',
  background: C.surface, border: `1px solid ${C.border}`,
  color: C.text1,
};
