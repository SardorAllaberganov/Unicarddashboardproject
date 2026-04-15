import React, { useState } from 'react';
import {
  ChevronRight, Bell, Megaphone, MessageSquare, ListChecks,
  Wallet, Clock, Activity, Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { EmptyState } from '../components/EmptyState';

/* ═══════════════════════════════════════════════════════════════════════════
   FIRST-USE EMPTY STATES SHOWCASE — 7 variants (Prompt 0 §16)

   These are the "genuinely no data yet" states, distinct from the 6 filtered-
   empty variants at /empty-states.
═══════════════════════════════════════════════════════════════════════════ */

export default function FirstUseEmptyStatesShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span
              onClick={() => navigate('/design-system')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}
            >
              Дизайн-система
            </span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span
              onClick={() => navigate('/empty-states')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}
            >
              Empty States
            </span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>First use</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
            Empty States — First use
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '6px 0 24px', lineHeight: 1.5 }}>
            Prompt 0 §16 — 7 вариантов для случая «данных ещё нет» (не отфильтровано).
            Все используют общий компонент{' '}
            <code style={{
              fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
              background: C.blueLt, color: C.blue, borderRadius: '4px',
            }}>{'<EmptyState />'}</code>{' '}
            с иконкой 64px и цветом <code style={{
              fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
              background: '#F3F4F6', color: C.text1, borderRadius: '4px',
            }}>#D1D5DB</code>.
          </p>

          {/* 3-column grid */}
          <div className="fues-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            <ContextFrame caption="1. M-01 · Bank Admin · Правила уведомлений">
              <EmptyState
                icon={Bell}
                title="Нет правил уведомлений"
                subtitle="Настройте автоматические уведомления для отслеживания KPI, продаж и финансов"
                primary={{
                  label: 'Создать первое правило',
                  icon: <Plus size={14} strokeWidth={2} />,
                  onClick: () => navigate('/notification-rules/new'),
                }}
              />
            </ContextFrame>

            <ContextFrame caption="2. M-04 · Bank Admin · История объявлений">
              <EmptyState
                icon={Megaphone}
                title="Нет объявлений"
                subtitle="Вы ещё не отправляли объявлений организациям. Отправьте первое!"
                primary={{
                  label: 'Отправить объявление',
                  icon: <Plus size={14} strokeWidth={2} />,
                  onClick: () => navigate('/announcements/new'),
                }}
              />
            </ContextFrame>

            <ContextFrame caption="3. N-02 · Org Admin · Сообщения продавцам">
              <EmptyState
                icon={MessageSquare}
                title="Нет отправленных сообщений"
                subtitle="Отправьте первое сообщение вашим продавцам"
                primary={{
                  label: 'Написать сообщение',
                  icon: <Plus size={14} strokeWidth={2} />,
                  onClick: () => navigate('/seller-messages/new'),
                }}
              />
            </ContextFrame>

            <ContextFrame caption="4. M-05 · Bank Admin · Лог доставки">
              <EmptyState
                icon={ListChecks}
                title="Лог пуст"
                subtitle="Уведомления появятся здесь после активации правил и отправки первого объявления"
                ghost={{
                  label: 'Перейти к правилам →',
                  onClick: () => navigate('/notification-rules'),
                }}
              />
            </ContextFrame>

            <ContextFrame caption="5. C-07 · Org Admin · Запросы на вывод">
              <EmptyState
                icon={Wallet}
                title="Нет запросов на вывод"
                subtitle="Продавцы ещё не запрашивали вывод средств из UCOIN кошелька"
              />
            </ContextFrame>

            <ContextFrame caption="6. B-03 / C-01 · Лента активности">
              <EmptyState
                icon={Clock}
                title="Нет активности"
                subtitle="Здесь будут отображаться действия по организации: продажи, KPI, финансы"
              />
            </ContextFrame>

            <ContextFrame caption="7. Q-03 · Bank Admin · Лог срабатываний правила">
              <EmptyState
                icon={Activity}
                title="Правило ещё не срабатывало"
                subtitle="Как только произойдёт событие-триггер, здесь появится лог срабатываний"
              />
            </ContextFrame>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .fues-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 700px)  { .fues-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTEXT FRAME
═══════════════════════════════════════════════════════════════════════════ */

function ContextFrame({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
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
      <div style={{ padding: '8px 8px 12px' }}>
        {children}
      </div>
    </div>
  );
}
