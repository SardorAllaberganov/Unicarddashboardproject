import React, { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { ExportToast } from '../components/useExportToast';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   EXPORT TOAST SHOWCASE — L-05

   Displays all three variants (processing, success, error) stacked in the
   dark theme. Every export button platform-wide routes through
   useExportToast() so this fix auto-themes each export flow.
═══════════════════════════════════════════════════════════════════════════ */

export default function ExportToastShowcasePage() {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span
              onClick={() => navigate('/design-system')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}
            >
              Дизайн-система
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Export toast</span>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
            Export toast — processing → success / error
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '6px 0 20px', lineHeight: 1.5 }}>
            L-05 — shared <code style={inlineCode(t)}>useExportToast()</code> hook used by every export button
            (Bank Admin reports, Org Admin reports, individual list exports). Auto-themes via{' '}
            <code style={inlineCode(t)}>useDarkMode()</code>.
          </p>

          {/* Dev note */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '12px 14px',
            background: t.blueLt, borderLeft: `3px solid ${t.blue}`,
            borderRadius: '8px', marginBottom: '20px',
          }}>
            <Info size={16} color={t.blue} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2, lineHeight: 1.5 }}>
              <b style={{ color: t.text1, fontWeight: 600 }}>One fix themes every export flow.</b>
              {' '}The 3 variants below render as a pinned dark preview so both themes are visible on one page.
              In production the toast appears fixed top-right (24/24) and dismisses automatically after 8s on success.
            </div>
          </div>

          {/* 3 dark variants stacked */}
          <ContextFrame caption="Dark — all 3 variants stacked" t={t}>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '14px',
              alignItems: 'flex-start',
            }}>
              <ExportToast
                phase="processing"
                params={{
                  title: 'Формирование отчёта...',
                  subtitle: 'Отчёт по организациям за 01.04–13.04.2026',
                }}
                onClose={() => { /* static preview */ }}
                inline
                dark
              />

              <ExportToast
                phase="success"
                params={{
                  title: 'Отчёт готов',
                  fileName: 'orgs-2026-04-01_2026-04-13.xlsx',
                  fileSize: '245 KB',
                }}
                onClose={() => { /* static preview */ }}
                inline
                dark
              />

              <ExportToast
                phase="error"
                params={{
                  title: 'Ошибка экспорта',
                  subtitle: 'Не удалось сформировать отчёт. Попробуйте снова.',
                }}
                onClose={() => { /* static preview */ }}
                onRetry={() => { /* static preview */ }}
                inline
                dark
              />
            </div>
          </ContextFrame>

          {/* Light variants for comparison */}
          <ContextFrame caption="Light — all 3 variants stacked" t={t}>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '14px',
              alignItems: 'flex-start',
            }}>
              <ExportToast
                phase="processing"
                params={{
                  title: 'Формирование отчёта...',
                  subtitle: 'Отчёт по организациям за 01.04–13.04.2026',
                }}
                onClose={() => { /* static preview */ }}
                inline
                dark={false}
              />
              <ExportToast
                phase="success"
                params={{
                  title: 'Отчёт готов',
                  fileName: 'orgs-2026-04-01_2026-04-13.xlsx',
                  fileSize: '245 KB',
                }}
                onClose={() => { /* static preview */ }}
                inline
                dark={false}
              />
              <ExportToast
                phase="error"
                params={{
                  title: 'Ошибка экспорта',
                  subtitle: 'Не удалось сформировать отчёт. Попробуйте снова.',
                }}
                onClose={() => { /* static preview */ }}
                onRetry={() => { /* static preview */ }}
                inline
                dark={false}
              />
            </div>
          </ContextFrame>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

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

function inlineCode(t: T): React.CSSProperties {
  return {
    fontFamily: F.mono, fontSize: '11px',
    padding: '1px 6px', borderRadius: '4px',
    background: t.surface, border: `1px solid ${t.border}`,
    color: t.text1,
  };
}
