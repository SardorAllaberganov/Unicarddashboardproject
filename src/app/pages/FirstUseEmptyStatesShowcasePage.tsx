import React, { useState } from 'react';
import {
  ChevronRight, Bell, Megaphone, MessageSquare, ListChecks,
  Wallet, Clock, Activity, Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { EmptyState, EmptyStateProps } from '../components/EmptyState';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   FIRST-USE EMPTY STATES SHOWCASE — S-02 · 7 variants (Prompt 0 §16)
   Rendered as side-by-side Light + Dark reference matrix.
═══════════════════════════════════════════════════════════════════════════ */

interface Variant {
  caption: string;
  build: (navigate: ReturnType<typeof useNavigate>) => Omit<EmptyStateProps, 'dark'>;
}

const VARIANTS: Variant[] = [
  {
    caption: '1. M-01 · Bank Admin · Правила уведомлений',
    build: (navigate) => ({
      icon: Bell,
      title: 'Нет правил уведомлений',
      subtitle: 'Настройте автоматические уведомления для отслеживания KPI, продаж и финансов',
      primary: {
        label: 'Создать первое правило',
        icon: <Plus size={14} strokeWidth={2} />,
        onClick: () => navigate('/notification-rules/new'),
      },
    }),
  },
  {
    caption: '2. M-04 · Bank Admin · История объявлений',
    build: (navigate) => ({
      icon: Megaphone,
      title: 'Нет объявлений',
      subtitle: 'Вы ещё не отправляли объявлений организациям. Отправьте первое!',
      primary: {
        label: 'Отправить объявление',
        icon: <Plus size={14} strokeWidth={2} />,
        onClick: () => navigate('/announcements/new'),
      },
    }),
  },
  {
    caption: '3. N-02 · Org Admin · Сообщения продавцам',
    build: (navigate) => ({
      icon: MessageSquare,
      title: 'Нет отправленных сообщений',
      subtitle: 'Отправьте первое сообщение вашим продавцам',
      primary: {
        label: 'Написать сообщение',
        icon: <Plus size={14} strokeWidth={2} />,
        onClick: () => navigate('/seller-messages/new'),
      },
    }),
  },
  {
    caption: '4. M-05 · Bank Admin · Лог доставки',
    build: (navigate) => ({
      icon: ListChecks,
      title: 'Лог пуст',
      subtitle: 'Уведомления появятся здесь после активации правил и отправки первого объявления',
      ghost: {
        label: 'Перейти к правилам →',
        onClick: () => navigate('/notification-rules'),
      },
    }),
  },
  {
    caption: '5. C-07 · Org Admin · Запросы на вывод',
    build: () => ({
      icon: Wallet,
      title: 'Нет запросов на вывод',
      subtitle: 'Продавцы ещё не запрашивали вывод средств из UCOIN кошелька',
    }),
  },
  {
    caption: '6. B-03 / C-01 · Лента активности',
    build: () => ({
      icon: Clock,
      title: 'Нет активности',
      subtitle: 'Здесь будут отображаться действия по организации: продажи, KPI, финансы',
    }),
  },
  {
    caption: '7. Q-03 · Bank Admin · Лог срабатываний правила',
    build: () => ({
      icon: Activity,
      title: 'Правило ещё не срабатывало',
      subtitle: 'Как только произойдёт событие-триггер, здесь появится лог срабатываний',
    }),
  },
];

export default function FirstUseEmptyStatesShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span
              onClick={() => navigate('/design-system')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}
            >
              Дизайн-система
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span
              onClick={() => navigate('/empty-states')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}
            >
              Empty States
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>First use</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
            Empty States — First use
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '6px 0 24px', lineHeight: 1.5 }}>
            Prompt 0 §16 — 7 вариантов для случая «данных ещё нет» (не отфильтровано).
            Все используют общий компонент{' '}
            <code style={{
              fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
              background: t.blueLt, color: t.blue, borderRadius: '4px',
            }}>{'<EmptyState />'}</code>{' '}
            с иконкой 64px. Каждый вариант показан в обеих темах.
          </p>

          {/* Light / Dark reference matrix */}
          {VARIANTS.map(v => (
            <VariantRow key={v.caption} caption={v.caption} t={t} props={v.build(navigate)} />
          ))}

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT ROW — caption + Light / Dark columns
═══════════════════════════════════════════════════════════════════════════ */

function VariantRow({ caption, t, props }: { caption: string; t: T; props: Omit<EmptyStateProps, 'dark'> }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontFamily: F.dm, fontSize: '14px', fontWeight: 600,
        color: t.text1, marginBottom: 10, lineHeight: 1.3,
      }}>
        {caption}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ToneCell tone="light" t={t}>
          <EmptyState {...props} dark={false} />
        </ToneCell>
        <ToneCell tone="dark" t={t}>
          <EmptyState {...props} dark={true} />
        </ToneCell>
      </div>
    </div>
  );
}

function ToneCell({ tone, t, children }: { tone: 'light' | 'dark'; t: T; children: React.ReactNode }) {
  const isDark = tone === 'dark';
  const bg     = isDark ? '#0F1117' : '#F9FAFB';
  const border = isDark ? '#2D3148' : '#E5E7EB';
  return (
    <div>
      <div style={{
        fontSize: 12, color: t.text3, marginBottom: 8,
        fontFamily: F.inter, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        {tone === 'light' ? 'Light' : 'Dark'}
      </div>
      <div style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: 40,
      }}>
        {children}
      </div>
    </div>
  );
}
