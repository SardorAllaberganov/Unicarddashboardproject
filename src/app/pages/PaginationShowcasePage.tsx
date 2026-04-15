import React, { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PaginationBar } from '../components/PaginationBar';

/* ═══════════════════════════════════════════════════════════════════════════
   PAGINATION SHOWCASE — Prompt 0 §4
   Demonstrates the enhanced PaginationBar in 3 canonical states.
═══════════════════════════════════════════════════════════════════════════ */

const TOTAL = 1284;

export default function PaginationShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const navigate = useNavigate();

  // Three independent state instances — each has its own storageKey
  const [s1, setS1] = useState({ page: 1, pageSize: 10 });
  const [s2, setS2] = useState({ page: 1, pageSize: 50 });
  const [s3, setS3] = useState({ page: 5, pageSize: 20 });

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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Pagination</span>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
            Pagination bar
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '6px 0 16px', lineHeight: 1.5 }}>
            Prompt 0 §4 — enhanced pagination с селектором размера страницы. Заменяет inline-пагинацию на всех табличных страницах.
          </p>

          {/* Dev note */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '12px 14px',
            background: C.blueLt, borderLeft: `3px solid ${C.blue}`,
            borderRadius: '8px', marginBottom: '20px',
          }}>
            <Info size={16} color={C.blue} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 500, color: C.text1 }}>Page size preference persists in localStorage across all tables.</span>
              {' '}Передай <code style={{
                fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
                background: C.surface, border: `1px solid ${C.blueTint}`,
                color: C.blue, borderRadius: '4px',
              }}>storageKey</code>{' '}
              (например <code style={{
                fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
                background: C.surface, border: `1px solid ${C.blueTint}`,
                color: C.blue, borderRadius: '4px',
              }}>"announcements"</code>) — значение сохраняется в{' '}
              <code style={{
                fontFamily: F.mono, fontSize: '12px', padding: '1px 6px',
                background: C.surface, border: `1px solid ${C.blueTint}`,
                color: C.blue, borderRadius: '4px',
              }}>pagesize:announcements</code>.
            </div>
          </div>

          {/* 3 states stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ContextFrame caption='State 1 — «10» выбрано, страница 1 из 129'>
              <TableShell>
                <PaginationBar
                  total={TOTAL}
                  page={s1.page}
                  pageSize={s1.pageSize}
                  onPageChange={p => setS1(s => ({ ...s, page: p }))}
                  onPageSizeChange={size => setS1({ page: 1, pageSize: size })}
                  storageKey="demo-1"
                />
              </TableShell>
            </ContextFrame>

            <ContextFrame caption='State 2 — «50» выбрано, страница 1 из 26'>
              <TableShell>
                <PaginationBar
                  total={TOTAL}
                  page={s2.page}
                  pageSize={s2.pageSize}
                  onPageChange={p => setS2(s => ({ ...s, page: p }))}
                  onPageSizeChange={size => setS2({ page: 1, pageSize: size })}
                  storageKey="demo-2"
                />
              </TableShell>
            </ContextFrame>

            <ContextFrame caption='State 3 — «20» выбрано, страница 5 из 65 (строки 81–100)'>
              <TableShell>
                <PaginationBar
                  total={TOTAL}
                  page={s3.page}
                  pageSize={s3.pageSize}
                  onPageChange={p => setS3(s => ({ ...s, page: p }))}
                  onPageSizeChange={size => setS3({ page: 1, pageSize: size })}
                  storageKey="demo-3"
                />
              </TableShell>
            </ContextFrame>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE SHELL — minimal visual context above the pagination bar
═══════════════════════════════════════════════════════════════════════════ */

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{
        height: '44px',
        background: '#F9FAFB',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', padding: '0 16px',
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        Пример таблицы (заголовок)
      </div>
      <div style={{
        height: '120px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.inter, fontSize: '12px', color: C.text4,
      }}>
        (строки таблицы)
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTEXT FRAME
═══════════════════════════════════════════════════════════════════════════ */

function ContextFrame({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        padding: '8px 4px',
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {caption}
      </div>
      {children}
    </div>
  );
}
