import React, { useState } from 'react';
import {
  ChevronRight, CreditCard, Users, Upload, Receipt, Bell, SearchX, Plus,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { EmptyState } from '../components/EmptyState';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   SHOWCASE
   Displays all 6 empty-state variants from Prompt 0 §16 in a 2×3 grid,
   each wrapped in a context-labeled frame.
═══════════════════════════════════════════════════════════════════════════ */

function ContextFrame({ context, children }: { context: string; children: React.ReactNode }) {
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
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
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
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>
              Design System
            </span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
              Empty States
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
            Empty States
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 24px' }}>
            Prompt 0 §16 — 6 variants for different contexts. All use the shared <code style={{
              fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
              background: C.blueLt, color: C.blue, borderRadius: '4px',
            }}>{'<EmptyState />'}</code> component.
          </p>

          {/* 2×3 grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            <ContextFrame context="1. Filtered table (no results)">
              <EmptyState
                icon={CreditCard}
                title="Карты не найдены"
                subtitle="Попробуйте изменить параметры фильтрации"
                outline={{ label: 'Сбросить фильтры' }}
              />
            </ContextFrame>

            <ContextFrame context="2. New organization (no sellers)">
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

            <ContextFrame context="3. Empty card batch (no imports)">
              <EmptyState
                icon={Upload}
                title="Карты не импортированы"
                subtitle="Импортируйте карты из Excel файла для начала работы с партией"
                primary={{ label: 'Импортировать карты' }}
                ghost={{ label: 'Скачать шаблон' }}
              />
            </ContextFrame>

            <ContextFrame context="4. Finance page (no transactions)">
              <EmptyState
                icon={Receipt}
                title="Нет операций за период"
                subtitle="За выбранный период начислений и выводов не было"
                outline={{ label: 'Изменить период' }}
              />
            </ContextFrame>

            <ContextFrame context="5. Notifications">
              <EmptyState
                icon={Bell}
                title="Нет уведомлений"
                subtitle="Здесь будут отображаться уведомления о KPI, продажах и финансах"
              />
            </ContextFrame>

            <ContextFrame context="6. Search (no results)">
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
