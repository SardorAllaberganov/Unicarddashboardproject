import React, { useState } from 'react';
import {
  ChevronRight, CreditCard, Users, Upload, Receipt, Bell, SearchX, Plus,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { EmptyState, EmptyStateProps } from '../components/EmptyState';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   SHOWCASE — L-06 filtered empty states
   6 variants rendered as side-by-side Light + Dark reference matrix.
═══════════════════════════════════════════════════════════════════════════ */

interface Variant {
  caption: string;
  props: Omit<EmptyStateProps, 'dark'>;
}

const VARIANTS: Variant[] = [
  {
    caption: '1. Filtered table (no results)',
    props: {
      icon: CreditCard,
      title: 'Карты не найдены',
      subtitle: 'Попробуйте изменить параметры фильтрации',
      outline: { label: 'Сбросить фильтры' },
    },
  },
  {
    caption: '2. New organization (no sellers)',
    props: {
      icon: Users,
      title: 'Нет продавцов',
      subtitle: 'Добавьте первого продавца для начала продаж',
      primary: {
        label: 'Добавить продавца',
        icon: <Plus size={14} strokeWidth={2} />,
      },
    },
  },
  {
    caption: '3. Empty card batch (no imports)',
    props: {
      icon: Upload,
      title: 'Карты не импортированы',
      subtitle: 'Импортируйте карты из Excel файла для начала работы с партией',
      primary: { label: 'Импортировать карты' },
      ghost: { label: 'Скачать шаблон' },
    },
  },
  {
    caption: '4. Finance page (no transactions)',
    props: {
      icon: Receipt,
      title: 'Нет операций за период',
      subtitle: 'За выбранный период начислений и выводов не было',
      outline: { label: 'Изменить период' },
    },
  },
  {
    caption: '5. Notifications',
    props: {
      icon: Bell,
      title: 'Нет уведомлений',
      subtitle: 'Здесь будут отображаться уведомления о KPI, продажах и финансах',
    },
  },
  {
    caption: '6. Search (no results)',
    props: {
      icon: SearchX,
      title: 'Ничего не найдено',
      subtitle: 'По запросу «дилшод» ничего не найдено. Проверьте написание или измените запрос',
      ghost: { label: 'Очистить поиск' },
    },
  },
];

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
            }}>{'<EmptyState />'}</code> component. Each variant rendered in both themes.
          </p>

          {/* Light / Dark reference matrix */}
          {VARIANTS.map(v => (
            <VariantRow key={v.caption} caption={v.caption} t={t} props={v.props} />
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
