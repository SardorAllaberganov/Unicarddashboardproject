import React, { useState } from 'react';
import { Sidebar, BankAdminSidebarDemo } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';

const inter = F.inter;
const dm    = F.dm;
const mono  = F.mono;

/* ─── Spec table ─────────────────────────────────────────────────────────── */

const SPEC_ROWS = [
  { token: 'Width · expanded',  value: '260px' },
  { token: 'Width · collapsed', value: '68px'  },
  { token: 'Background',        value: '#FFFFFF / #111827 (dark)' },
  { token: 'Right border',      value: '1px solid #E5E7EB' },
  { token: 'Nav item height',   value: '40px'  },
  { token: 'Active bg',         value: '#EFF6FF + left 2px #2563EB' },
  { token: 'Hover bg',          value: '#F9FAFB' },
  { token: 'Group label',       value: 'Inter 11px · 600 · uppercase · #9CA3AF' },
  { token: 'Nav label',         value: 'Inter 14px · active #2563EB / default #374151' },
  { token: 'Collapse toggle',   value: 'ChevronLeft/Right · 26×26px · border 1px' },
];

export default function SidebarShowcasePage() {
  const [liveCollapsed, setLiveCollapsed] = useState(false);
  const [liveDark, setLiveDark]           = useState(false);

  return (
    <div style={{
      background: '#F3F4F6',
      minHeight: '100vh',
      fontFamily: inter,
    }}>

      {/* ── Page header ── */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: C.blue,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: dm, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>M</span>
            </div>
            <h1 style={{ fontFamily: dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0 }}>
              Left Sidebar — Bank Admin
            </h1>
          </div>
          <p style={{ fontFamily: inter, fontSize: '13px', color: C.text3, margin: 0 }}>
            Prompt 0 §2 · Persistent Navigation · 260px expanded / 68px collapsed · 10 nav items · Dark theme support
          </p>
        </div>

        {/* Tag strip */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { label: 'Component',   value: 'BankAdminSidebar' },
            { label: 'Expanded',    value: '260px' },
            { label: 'Collapsed',   value: '68px' },
            { label: 'Nav items',   value: '10' },
          ].map(t => (
            <div key={t.label} style={{
              display: 'flex', gap: '6px', alignItems: 'center',
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '6px',
              padding: '4px 10px',
            }}>
              <span style={{ fontFamily: inter, fontSize: '12px', color: C.text4 }}>{t.label}:</span>
              <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 500, color: C.blue }}>{t.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '40px 48px', maxWidth: '1840px', margin: '0 auto' }}>

        {/* ──────────────────────────────────────────
            SECTION 1 · Live interactive demo
        ────────────────────────────────────────── */}
        <SectionTitle index="01" title="Live Interactive Demo" sub="Toggle collapse and dark mode in real time" />

        <div style={{
          background: liveDark ? '#0F172A' : '#EFF6FF',
          border: `1px solid ${liveDark ? '#1E293B' : C.blueTint}`,
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '48px',
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          {/* Live sidebar */}
          <div style={{
            height: '700px',
            borderRadius: '12px',
            overflow: 'visible',
            boxShadow: liveDark
              ? '0 4px 24px rgba(0,0,0,0.5)'
              : '0 4px 24px rgba(37,99,235,0.12)',
            border: `1px solid ${liveDark ? '#374151' : C.border}`,
          }}>
            <Sidebar role="bank"
              collapsed={liveCollapsed}
              onToggle={() => setLiveCollapsed(c => !c)}
              darkMode={liveDark}
              onDarkModeToggle={() => setLiveDark(d => !d)}
            />
          </div>

          {/* Instructions */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{
              fontFamily: dm,
              fontSize: '16px',
              fontWeight: 600,
              color: liveDark ? '#F9FAFB' : C.text1,
              marginBottom: '16px',
            }}>
              Попробуй сам
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { action: 'Нажми chevron-кнопку', result: 'Сворачивает/разворачивает сайдбар' },
                { action: 'Наведи на иконку (collapsed)', result: 'Показывает tooltip с названием' },
                { action: 'Нажми moon/sun кнопку', result: 'Переключает тёмную тему' },
                { action: 'Наведи на пункт меню', result: 'Hover-состояние (#F9FAFB / #1F2937)' },
              ].map(tip => (
                <div key={tip.action} style={{
                  background: liveDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
                  border: `1px solid ${liveDark ? '#1F2937' : 'rgba(37,99,235,0.15)'}`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}>
                  <div style={{ fontFamily: inter, fontSize: '13px', fontWeight: 500, color: liveDark ? '#93C5FD' : C.blue }}>
                    {tip.action}
                  </div>
                  <div style={{ fontFamily: inter, fontSize: '12px', color: liveDark ? '#6B7280' : C.text3, marginTop: '2px' }}>
                    {tip.result}
                  </div>
                </div>
              ))}
            </div>

            {/* State indicators */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <StateIndicator label="Collapse state" value={liveCollapsed ? 'Collapsed · 68px' : 'Expanded · 260px'} active={!liveCollapsed} dark={liveDark} />
              <StateIndicator label="Theme"          value={liveDark ? 'Dark mode' : 'Light mode'} active={liveDark} dark={liveDark} />
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────
            SECTION 2 · All 4 states side-by-side
        ────────────────────────────────────────── */}
        <SectionTitle index="02" title="All States · Side by Side" sub="Expanded + Collapsed × Light + Dark" />

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '48px',
          overflowX: 'auto',
        }}>
          <Sidebar role="bank"Demo />
        </div>

        {/* ──────────────────────────────────────────
            SECTION 3 · Nav items annotation
        ────────────────────────────────────────── */}
        <SectionTitle index="03" title="Navigation Map" sub="10 items across 4 groups · Bank Admin role" />

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '48px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}>
            {[
              {
                group: 'ОБЗОР', color: C.blue, bg: C.blueLt,
                items: [
                  { n: 1, label: 'Дашборд',          state: 'ACTIVE', icon: '□' },
                ],
              },
              {
                group: 'УПРАВЛЕНИЕ', color: '#D97706', bg: '#FFFBEB',
                items: [
                  { n: 2,  label: 'Организации',      state: 'default', icon: '⊞' },
                  { n: 3,  label: 'Партии карт',       state: 'badge:3', icon: '◳' },
                  { n: 4,  label: 'KPI конфигурации',  state: 'default', icon: '⚙' },
                  { n: 5,  label: 'Импорт карт',       state: 'default', icon: '↑' },
                  { n: 6,  label: 'Все карты',         state: 'default', icon: '≡' },
                ],
              },
              {
                group: 'ФИНАНСЫ', color: '#10B981', bg: '#F0FDF4',
                items: [
                  { n: 7,  label: 'Вознаграждения',   state: 'badge:12', icon: '◈' },
                  { n: 8,  label: 'Отчёты и экспорт', state: 'default', icon: '⊟' },
                ],
              },
              {
                group: 'СИСТЕМА', color: '#6B7280', bg: '#F3F4F6',
                items: [
                  { n: 9,  label: 'Пользователи',     state: 'default', icon: '◎' },
                  { n: 10, label: 'Настройки',         state: 'default', icon: '⚙' },
                ],
              },
            ].map(group => (
              <div key={group.group} style={{
                background: group.bg,
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                padding: '16px',
              }}>
                <div style={{
                  fontFamily: inter,
                  fontSize: '11px',
                  fontWeight: 700,
                  color: group.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: '10px',
                }}>
                  {group.group}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {group.items.map(item => (
                    <div key={item.n} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <span style={{
                        fontFamily: mono,
                        fontSize: '11px',
                        color: C.text4,
                        width: '18px',
                        flexShrink: 0,
                        textAlign: 'right',
                      }}>
                        {item.n}
                      </span>
                      <span style={{ fontFamily: inter, fontSize: '13px', color: C.text2, flex: 1 }}>
                        {item.label}
                      </span>
                      <span style={{
                        fontFamily: inter,
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: item.state === 'ACTIVE' ? C.blue : item.state.startsWith('badge') ? '#DBEAFE' : '#F3F4F6',
                        color: item.state === 'ACTIVE' ? '#FFF' : item.state.startsWith('badge') ? C.blue : C.text4,
                        whiteSpace: 'nowrap',
                      }}>
                        {item.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ──────────────────────────────────────────
            SECTION 4 · Token spec table
        ────────────────────────────────────────── */}
        <SectionTitle index="04" title="Design Tokens" sub="All sidebar-specific values from Prompt 0 §2" />

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '40px',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.pageBg, borderBottom: `1px solid ${C.border}` }}>
                {['Token / Property', 'Value'].map(h => (
                  <th key={h} style={{
                    padding: '10px 20px',
                    textAlign: 'left',
                    fontFamily: inter,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: C.text4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row, i) => (
                <tr key={row.token} style={{ borderBottom: i < SPEC_ROWS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ padding: '12px 20px', fontFamily: mono, fontSize: '13px', color: C.blue }}>{row.token}</td>
                  <td style={{ padding: '12px 20px', fontFamily: mono, fontSize: '13px', color: C.text2 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function SectionTitle({ index, title, sub }: { index: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
        <span style={{
          fontFamily: mono,
          fontSize: '11px',
          color: C.blue,
          background: C.blueLt,
          border: `1px solid ${C.blueTint}`,
          borderRadius: '4px',
          padding: '2px 7px',
        }}>
          §{index}
        </span>
        <h2 style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 700, color: C.text1, margin: 0 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontFamily: inter, fontSize: '13px', color: C.text3, margin: '0 0 0 0' }}>{sub}</p>
      <div style={{ height: '1px', background: C.border, marginTop: '12px' }} />
    </div>
  );
}

function StateIndicator({ label, value, active, dark }: { label: string; value: string; active: boolean; dark: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '7px 12px',
      borderRadius: '7px',
      background: dark ? 'rgba(255,255,255,0.04)' : C.pageBg,
      border: `1px solid ${dark ? '#1F2937' : C.border}`,
    }}>
      <span style={{ fontFamily: inter, fontSize: '12px', color: dark ? '#6B7280' : C.text3 }}>{label}</span>
      <span style={{
        fontFamily: mono,
        fontSize: '11px',
        fontWeight: 600,
        color: active ? C.blue : dark ? '#6B7280' : C.text4,
        background: active ? C.blueLt : 'transparent',
        padding: '1px 7px',
        borderRadius: '4px',
      }}>{value}</span>
    </div>
  );
}
