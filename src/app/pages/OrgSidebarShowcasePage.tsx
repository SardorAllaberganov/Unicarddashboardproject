import React, { useState } from 'react';
import { Sidebar, OrgAdminSidebarDemo } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';

const inter = F.inter;
const dm    = F.dm;
const mono  = F.mono;

/* ─── Spec rows ─────────────────────────────────────────────────────────── */

const SPEC_ROWS = [
  { token: 'Role',               value: 'Organization Admin' },
  { token: 'Width · expanded',   value: '260px' },
  { token: 'Width · collapsed',  value: '68px' },
  { token: 'Org badge',          value: 'Outline variant · Border #E5E7EB · dot #2563EB' },
  { token: 'Header height',      value: '72px (expanded) / 60px (collapsed)' },
  { token: 'Background',         value: '#FFFFFF / #111827 (dark)' },
  { token: 'Right border',       value: '1px solid #E5E7EB' },
  { token: 'Active bg',          value: '#EFF6FF + left 2px #2563EB' },
  { token: 'Hover bg',           value: '#F9FAFB' },
  { token: 'Avatar',             value: '"РА" · #F0FDF4 bg · 1.5px #10B981 ring' },
  { token: 'Nav items total',    value: '7 across 4 groups' },
];

const NAV_MAP = [
  {
    group: 'ОБЗОР', color: C.blue, bg: C.blueLt,
    items: [{ n: 1, label: 'Дашборд', state: 'ACTIVE' }],
  },
  {
    group: 'УПРАВЛЕНИЕ', color: '#D97706', bg: '#FFFBEB',
    items: [
      { n: 2, label: 'Продавцы',       state: 'default' },
      { n: 3, label: 'Карты',          state: 'default' },
      { n: 4, label: 'Назначение карт', state: 'default' },
    ],
  },
  {
    group: 'ФИНАНСЫ', color: '#10B981', bg: '#F0FDF4',
    items: [
      { n: 5, label: 'Вознаграждения', state: 'default' },
      { n: 6, label: 'Выводы',         state: 'default' },
    ],
  },
  {
    group: 'СИСТЕМА', color: '#6B7280', bg: '#F3F4F6',
    items: [{ n: 7, label: 'Настройки', state: 'default' }],
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function OrgSidebarShowcasePage() {
  const [liveCollapsed, setLiveCollapsed] = useState(false);
  const [liveDark,      setLiveDark]      = useState(false);

  return (
    <div style={{ background: '#F3F4F6', minHeight: '100vh', fontFamily: inter }}>

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
              Left Sidebar — Organization Admin
            </h1>
          </div>
          <p style={{ fontFamily: inter, fontSize: '13px', color: C.text3, margin: 0 }}>
            Prompt 0 §2 · Persistent Navigation · 260px / 68px · 7 nav items · Org badge "Mysafar OOO" · Dark theme
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { label: 'Component',  value: 'OrgAdminSidebar' },
            { label: 'Expanded',   value: '260px' },
            { label: 'Collapsed',  value: '68px'  },
            { label: 'Nav items',  value: '7'     },
            { label: 'Org badge',  value: 'Outline' },
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

        {/* ── §01 Live demo ── */}
        <SectionTitle index="01" title="Live Interactive Demo" sub="Toggle collapse and dark mode in real time" />

        <div style={{
          background: liveDark ? '#0F172A' : '#F0FDF4',
          border: `1px solid ${liveDark ? '#1E293B' : '#BBF7D0'}`,
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '48px',
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          {/* Sidebar */}
          <div style={{
            height: '640px',
            borderRadius: '12px',
            overflow: 'visible',
            boxShadow: liveDark
              ? '0 4px 24px rgba(0,0,0,0.5)'
              : '0 4px 24px rgba(16,185,129,0.1)',
            border: `1px solid ${liveDark ? '#374151' : C.border}`,
          }}>
            <Sidebar role="org"
              collapsed={liveCollapsed}
              onToggle={() => setLiveCollapsed(c => !c)}
              darkMode={liveDark}
              onDarkModeToggle={() => setLiveDark(d => !d)}
            />
          </div>

          {/* Info panel */}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[
                { action: 'Нажми chevron-кнопку',       result: 'Сворачивает / разворачивает' },
                { action: 'Наведи на иконку (collapsed)', result: 'Показывает tooltip' },
                { action: 'Нажми moon/sun',              result: 'Переключает тему' },
                { action: 'Expanded header',             result: 'Badge "Mysafar OOO" виден' },
              ].map(tip => (
                <div key={tip.action} style={{
                  background: liveDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${liveDark ? '#1F2937' : '#BBF7D0'}`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}>
                  <div style={{ fontFamily: inter, fontSize: '13px', fontWeight: 500, color: liveDark ? '#6EE7B7' : '#059669' }}>
                    {tip.action}
                  </div>
                  <div style={{ fontFamily: inter, fontSize: '12px', color: liveDark ? '#6B7280' : C.text3, marginTop: '2px' }}>
                    {tip.result}
                  </div>
                </div>
              ))}
            </div>

            {/* State pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <StatePill
                label="Collapse state"
                value={liveCollapsed ? 'Collapsed · 68px' : 'Expanded · 260px'}
                active={!liveCollapsed}
                dark={liveDark}
              />
              <StatePill
                label="Theme"
                value={liveDark ? 'Dark mode' : 'Light mode'}
                active={liveDark}
                dark={liveDark}
              />
            </div>

            {/* Org badge callout */}
            <div style={{
              marginTop: '24px',
              background: liveDark ? 'rgba(255,255,255,0.04)' : C.surface,
              border: `1px solid ${liveDark ? '#374151' : C.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
            }}>
              <div style={{ fontFamily: inter, fontSize: '11px', fontWeight: 600, color: C.text4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Org Badge (Expanded only)
              </div>
              {/* Visual replica */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 8px', borderRadius: '6px',
                border: `1px solid ${liveDark ? '#374151' : C.border}`,
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.blue }} />
                <span style={{ fontFamily: inter, fontSize: '11px', fontWeight: 500, color: liveDark ? '#9CA3AF' : C.text3 }}>
                  Mysafar OOO
                </span>
              </div>
              <p style={{ fontFamily: inter, fontSize: '12px', color: C.text4, margin: '8px 0 0' }}>
                Outline badge variant · скрывается в collapsed-режиме
              </p>
            </div>
          </div>
        </div>

        {/* ── §02 All 4 states ── */}
        <SectionTitle index="02" title="All States · Side by Side" sub="Expanded + Collapsed × Light + Dark" />

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '48px',
          overflowX: 'auto',
        }}>
          <Sidebar role="org"Demo />
        </div>

        {/* ── §03 Comparison: Bank vs Org ── */}
        <SectionTitle index="03" title="Role Comparison" sub="Bank Admin sidebar vs Org Admin sidebar — key differences" />

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '48px',
          overflowX: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.pageBg, borderBottom: `1px solid ${C.border}` }}>
                {['Property', 'Bank Admin (A-02)', 'Org Admin (A-03)'].map(h => (
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
              {[
                { prop: 'Nav items',    bank: '10 items · 4 groups',   org: '7 items · 4 groups' },
                { prop: 'Org badge',    bank: '—',                      org: 'Outline "Mysafar OOO"' },
                { prop: 'Header height',bank: '60px',                   org: '72px (expanded)' },
                { prop: 'Avatar',       bank: '"АК" · blue ring',       org: '"РА" · green ring' },
                { prop: 'User name',    bank: 'Админ Камолов',          org: 'Рустам Алиев' },
                { prop: 'User role',    bank: 'Банк-администратор',     org: 'Менеджер организации' },
                { prop: 'Scope',        bank: 'All organisations',      org: 'Own org only' },
              ].map((row, i, arr) => (
                <tr key={row.prop} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ padding: '12px 20px', fontFamily: mono, fontSize: '13px', color: C.blue }}>{row.prop}</td>
                  <td style={{ padding: '12px 20px', fontFamily: inter, fontSize: '13px', color: C.text3 }}>{row.bank}</td>
                  <td style={{ padding: '12px 20px', fontFamily: inter, fontSize: '13px', color: C.text2, fontWeight: 500 }}>{row.org}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── §04 Navigation map ── */}
        <SectionTitle index="04" title="Navigation Map" sub="7 items across 4 groups · Org Admin role" />

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '48px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            {NAV_MAP.map(group => (
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
                    <div key={item.n} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: mono, fontSize: '11px', color: C.text4, width: '18px', textAlign: 'right', flexShrink: 0 }}>
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
                        background: item.state === 'ACTIVE' ? C.blue : '#F3F4F6',
                        color: item.state === 'ACTIVE' ? '#FFF' : C.text4,
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

        {/* ── §05 Token spec ── */}
        <SectionTitle index="05" title="Design Tokens" sub="Org Admin sidebar–specific values" />

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
        <h2 style={{ fontFamily: dm, fontSize: '18px', fontWeight: 700, color: C.text1, margin: 0 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontFamily: inter, fontSize: '13px', color: C.text3, margin: '0 0 12px' }}>{sub}</p>
      <div style={{ height: '1px', background: C.border }} />
    </div>
  );
}

function StatePill({ label, value, active, dark }: { label: string; value: string; active: boolean; dark: boolean }) {
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
        color: active ? '#10B981' : dark ? '#6B7280' : C.text4,
        background: active ? '#F0FDF4' : 'transparent',
        padding: '1px 7px',
        borderRadius: '4px',
      }}>{value}</span>
    </div>
  );
}
