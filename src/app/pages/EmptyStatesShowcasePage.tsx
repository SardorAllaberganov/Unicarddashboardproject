import React, { useState } from 'react';
import {
  ChevronRight, CreditCard, Users, Upload, Receipt, Bell, SearchX, Plus,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { EmptyState } from '../components/EmptyState';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   SHOWCASE
   Displays all 6 empty-state variants from Prompt 0 §16 in a 2×3 grid,
   each wrapped in a context-labeled frame.
═══════════════════════════════════════════════════════════════════════════ */

function ContextFrame({ context, children, t }: { context: string; children: React.ReactNode; t: T }) {
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: '12px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: `1px solid ${t.border}`,
        background: t.tableHeaderBg,
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {context}
      </div>
      <div style={{ padding: '8px 8px 12px' }}>
        {children}
      </div>
    </div>
  );
}

export default function EmptyStatesShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank"
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
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>
              Design System
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
              Empty States
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
            Empty States
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 24px' }}>
            Prompt 0 §16 — 6 variants for different contexts. All use the shared <code style={{
              fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
              background: t.blueLt, color: t.blue, borderRadius: '4px',
            }}>{'<EmptyState />'}</code> component.
          </p>

          {/* 2×3 grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            <ContextFrame context="1. Filtered table (no results)" t={t}>
              <EmptyState
                icon={CreditCard}
                title="Карты не найдены"
                subtitle="Попробуйте изменить параметры фильтрации"
                outline={{ label: 'Сбросить фильтры' }}
              />
            </ContextFrame>

            <ContextFrame context="2. New organization (no sellers)" t={t}>
              <EmptyState
                icon={Users}
                title="Нет продавцов"
                subtitle="Добавьте первого продавца для начала продаж"
                primary={{
                  label: 'Добавить продавца',
                  icon: <Plus size={14} strokeWidth={2} />,
                }}
              />
            </ContextFrame>

            <ContextFrame context="3. Empty card batch (no imports)" t={t}>
              <EmptyState
                icon={Upload}
                title="Карты не импортированы"
                subtitle="Импортируйте карты из Excel файла для начала работы с партией"
                primary={{ label: 'Импортировать карты' }}
                ghost={{ label: 'Скачать шаблон' }}
              />
            </ContextFrame>

            <ContextFrame context="4. Finance page (no transactions)" t={t}>
              <EmptyState
                icon={Receipt}
                title="Нет операций за период"
                subtitle="За выбранный период начислений и выводов не было"
                outline={{ label: 'Изменить период' }}
              />
            </ContextFrame>

            <ContextFrame context="5. Notifications" t={t}>
              <EmptyState
                icon={Bell}
                title="Нет уведомлений"
                subtitle="Здесь будут отображаться уведомления о KPI, продажах и финансах"
              />
            </ContextFrame>

            <ContextFrame context="6. Search (no results)" t={t}>
              <EmptyState
                icon={SearchX}
                title="Ничего не найдено"
                subtitle="По запросу «дилшод» ничего не найдено. Проверьте написание или измените запрос"
                ghost={{ label: 'Очистить поиск' }}
              />
            </ContextFrame>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
