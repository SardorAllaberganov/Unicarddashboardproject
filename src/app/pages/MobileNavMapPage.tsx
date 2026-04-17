import React, { useState } from 'react';
import {
  ChevronRight, LayoutDashboard, Building2, CreditCard, MoreHorizontal,
  Users, ArrowRight, X, Layers, Smartphone,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE NAVIGATION MAP — dev reference diagram
   Two-column layout: Bank Admin (left) · Org Admin (right).
   Annotated tree with arrows between screens.
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Presentation types ──────────────────────────────────────────────── */

type Presentation = 'push' | 'modal' | 'sheet' | 'tab';

const PRES_LIGHT: Record<Presentation, { bg: string; border: string; badge: string; badgeFg: string }> = {
  push:  { bg: '#FFFFFF', border: '#E5E7EB', badge: '#EFF6FF', badgeFg: '#2563EB' },
  modal: { bg: '#FFFFFF', border: '#D97706', badge: '#FFFBEB', badgeFg: '#B45309' },
  sheet: { bg: '#FFFFFF', border: '#7C3AED', badge: '#F3F0FF', badgeFg: '#7C3AED' },
  tab:   { bg: '#FFFFFF', border: '#2563EB', badge: '#EFF6FF', badgeFg: '#2563EB' },
};

const PRES_DARK: Record<Presentation, { bg: string; border: string; badge: string; badgeFg: string }> = {
  push:  { bg: '#1A1D27', border: '#2D3148', badge: 'rgba(59,130,246,0.15)',  badgeFg: '#3B82F6' },
  modal: { bg: '#1A1D27', border: '#FBBF24', badge: 'rgba(251,191,36,0.15)',  badgeFg: '#FBBF24' },
  sheet: { bg: '#1A1D27', border: '#A78BFA', badge: 'rgba(167,139,250,0.15)', badgeFg: '#A78BFA' },
  tab:   { bg: '#1A1D27', border: '#3B82F6', badge: 'rgba(59,130,246,0.15)',  badgeFg: '#3B82F6' },
};

const PRES_LABELS: Record<Presentation, string> = {
  push: 'Push',
  modal: 'Modal',
  sheet: 'Sheet',
  tab: 'Tab root',
};

/* ─── Node types ──────────────────────────────────────────────────────── */

type ScreenNode = {
  id: string;
  label: string;
  ref?: string;
  pres: Presentation;
  children?: ScreenNode[];
};

/* ─── Bank Admin tree ─────────────────────────────────────────────────── */

const BANK_TREE: ScreenNode[] = [
  {
    id: 'b-tab1', label: 'Дашборд', ref: 'Y-06', pres: 'tab',
    children: [
      { id: 'b-notif-bell', label: 'Уведомления', ref: '', pres: 'push' },
      { id: 'b-dash-card',  label: 'Карта (через стат)', ref: 'Y-10', pres: 'push' },
    ],
  },
  {
    id: 'b-tab2', label: 'Организации', ref: 'Y-07', pres: 'tab',
    children: [
      {
        id: 'b-org-detail', label: 'Организация', ref: 'Y-08', pres: 'push',
        children: [
          { id: 'b-org-seller', label: 'Продавец', pres: 'push' },
          { id: 'b-org-card',   label: 'Карта', ref: 'Y-10', pres: 'push' },
          { id: 'b-org-edit',   label: 'Ред. организации', pres: 'modal' },
        ],
      },
      { id: 'b-org-new', label: 'Новая организация', pres: 'modal' },
    ],
  },
  {
    id: 'b-tab3', label: 'Карты', ref: 'Y-09', pres: 'tab',
    children: [
      { id: 'b-card-detail', label: 'Карта', ref: 'Y-10', pres: 'push' },
      { id: 'b-card-filter', label: 'Фильтры', ref: '§7', pres: 'modal' },
    ],
  },
  {
    id: 'b-tab4', label: 'Ещё', ref: 'Y-03', pres: 'tab',
    children: [
      {
        id: 'b-batches', label: 'Партии карт', pres: 'push',
        children: [
          {
            id: 'b-batch-detail', label: 'Партия', pres: 'push',
            children: [
              { id: 'b-batch-edit', label: 'Ред. партию', pres: 'modal' },
            ],
          },
        ],
      },
      {
        id: 'b-kpi', label: 'KPI конфигурации', pres: 'push',
        children: [
          { id: 'b-kpi-edit', label: 'Редактирование', pres: 'push' },
        ],
      },
      { id: 'b-import', label: 'Импорт карт (3 шага)', pres: 'modal' },
      {
        id: 'b-reports', label: 'Отчёты', pres: 'push',
        children: [
          { id: 'b-report-preview', label: 'Предпросмотр', pres: 'push' },
        ],
      },
      { id: 'b-rewards', label: 'Вознаграждения', pres: 'push' },
      {
        id: 'b-rules', label: 'Правила уведомлений', pres: 'push',
        children: [
          { id: 'b-rule-detail', label: 'Правило', pres: 'push' },
          { id: 'b-rule-editor', label: 'Редактор', pres: 'modal' },
        ],
      },
      {
        id: 'b-announcements', label: 'Объявления', pres: 'push',
        children: [
          { id: 'b-announce-compose', label: 'Создать', pres: 'modal' },
          { id: 'b-announce-detail',  label: 'Детали', pres: 'push' },
        ],
      },
      { id: 'b-delivery-log', label: 'Лог доставки', pres: 'push' },
      {
        id: 'b-users', label: 'Пользователи', pres: 'push',
        children: [
          { id: 'b-user-detail', label: 'Пользователь', pres: 'push' },
          { id: 'b-user-edit', label: 'Ред. роль', pres: 'modal' },
        ],
      },
      { id: 'b-settings', label: 'Настройки', pres: 'push' },
      { id: 'b-profile', label: 'Профиль', pres: 'push' },
    ],
  },
];

/* ─── Org Admin tree ──────────────────────────────────────────────────── */

const ORG_TREE: ScreenNode[] = [
  {
    id: 'o-tab1', label: 'Дашборд', ref: 'Y-11', pres: 'tab',
  },
  {
    id: 'o-tab2', label: 'Продавцы', ref: 'Y-12', pres: 'tab',
    children: [
      {
        id: 'o-seller-detail', label: 'Продавец', ref: 'Y-13', pres: 'push',
        children: [
          { id: 'o-seller-edit', label: 'Ред. продавца', pres: 'modal' },
          { id: 'o-seller-reassign', label: 'Переназначение карт', pres: 'modal' },
        ],
      },
    ],
  },
  {
    id: 'o-tab3', label: 'Карты', pres: 'tab',
    children: [
      { id: 'o-card-detail', label: 'Карта', ref: 'Y-10', pres: 'push' },
    ],
  },
  {
    id: 'o-tab4', label: 'Ещё', ref: 'Y-04', pres: 'tab',
    children: [
      {
        id: 'o-assignment', label: 'Назначение карт', pres: 'push',
        children: [
          { id: 'o-bulk', label: 'Массовое назначение', pres: 'push' },
        ],
      },
      {
        id: 'o-messages', label: 'Сообщения', pres: 'push',
        children: [
          { id: 'o-msg-compose', label: 'Создать', pres: 'modal' },
          { id: 'o-msg-detail',  label: 'Детали', pres: 'push' },
        ],
      },
      { id: 'o-rewards', label: 'Вознаграждения', pres: 'push' },
      {
        id: 'o-withdrawals', label: 'Выводы', pres: 'push',
        children: [
          { id: 'o-wd-detail', label: 'Детали вывода', pres: 'push' },
        ],
      },
      { id: 'o-notif', label: 'Уведомления', pres: 'push' },
      { id: 'o-settings', label: 'Настройки', pres: 'push' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TREE RENDERING — recursive
═══════════════════════════════════════════════════════════════════════════ */

function ScreenCard({ node, dark, depth = 0 }: { node: ScreenNode; dark: boolean; depth?: number }) {
  const t = theme(dark);
  const pal = (dark ? PRES_DARK : PRES_LIGHT)[node.pres];
  const borderLeft = node.pres === 'tab' ? `3px solid ${pal.border}` : `2px solid ${pal.border}`;
  const isTab = node.pres === 'tab';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        background: pal.bg,
        border: `1px solid ${t.border}`,
        borderLeft,
        borderRadius: 10,
        minHeight: 40,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: F.inter, fontSize: isTab ? 14 : 13,
              fontWeight: isTab ? 600 : 500,
              color: t.text1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {node.label}
            </span>
            {node.ref && (
              <span style={{
                fontFamily: F.mono, fontSize: 10, fontWeight: 600,
                color: pal.badgeFg, background: pal.badge,
                padding: '1px 6px', borderRadius: 4,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {node.ref}
              </span>
            )}
          </div>
        </div>
        <span style={{
          fontFamily: F.mono, fontSize: 10, fontWeight: 500,
          color: pal.badgeFg,
          padding: '2px 6px', borderRadius: 4,
          background: pal.badge,
          flexShrink: 0,
        }}>
          {PRES_LABELS[node.pres]}
        </span>
      </div>

      {node.children && node.children.length > 0 && (
        <div style={{ marginLeft: 20, borderLeft: `1px solid ${t.border}`, paddingLeft: 16, paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {node.children.map(child => (
            <div key={child.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <ArrowRight size={12} color={t.text4} />
              </div>
              <ScreenCard node={child} dark={dark} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TreeColumn({ title, subtitle, tabs, tree, dark }: {
  title: string; subtitle: string;
  tabs: Array<{ icon: React.ElementType; label: string }>;
  tree: ScreenNode[];
  dark: boolean;
}) {
  const t = theme(dark);
  return (
    <div style={{ flex: 1, minWidth: 420, maxWidth: 600 }}>
      {/* Role header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: t.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Smartphone size={16} color="#FFFFFF" strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontFamily: F.dm, fontSize: 18, fontWeight: 600, color: t.text1 }}>{title}</div>
          <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3 }}>{subtitle}</div>
        </div>
      </div>

      {/* Tab bar representation */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10,
        padding: '10px 8px', marginBottom: 16, gap: 4,
      }}>
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <div key={tab.label} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '6px 0', borderRadius: 8,
              background: i === 0 ? t.blueLt : 'transparent',
            }}>
              <Icon size={16} color={i === 0 ? t.blue : t.text3} strokeWidth={2} />
              <span style={{
                fontFamily: F.inter, fontSize: 12,
                fontWeight: i === 0 ? 600 : 500,
                color: i === 0 ? t.blue : t.text3,
              }}>
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tree.map(node => (
          <ScreenCard key={node.id} node={node} dark={dark} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL RULES LEGEND
═══════════════════════════════════════════════════════════════════════════ */

const MODAL_RULES = [
  { pres: 'push' as Presentation,  label: 'Standard push', desc: 'Back chevron in header. Each tab has its own stack — deep pushes stay within the tab.' },
  { pres: 'modal' as Presentation, label: 'Full-screen modal', desc: 'X close + optional Save / Отправить text button. Used for: create flows (new org, batch, compose), edit flows, multi-step wizards (import), filter sheets.' },
  { pres: 'sheet' as Presentation, label: 'Bottom sheet', desc: 'Slide-up from bottom, handle bar, swipe-down dismiss. Used for: confirmation dialogs, quick action menus (⋯), single-field pickers.' },
  { pres: 'tab' as Presentation,   label: 'Tab root', desc: 'Root screen of each bottom tab. Not pushed — tab switch. Selecting an already-active tab pops its stack to root.' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════════════ */

const BANK_TABS = [
  { icon: LayoutDashboard, label: 'Дашборд' },
  { icon: Building2,       label: 'Организации' },
  { icon: CreditCard,      label: 'Карты' },
  { icon: MoreHorizontal,  label: 'Ещё' },
];

const ORG_TABS = [
  { icon: LayoutDashboard, label: 'Дашборд' },
  { icon: Users,           label: 'Продавцы' },
  { icon: CreditCard,      label: 'Карты' },
  { icon: MoreHorizontal,  label: 'Ещё' },
];

export default function MobileNavMapPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const t = theme(darkMode);
  const dark = darkMode;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank" collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Дизайн-система</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/mobile-design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Mobile</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Navigation Map</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: t.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={22} color={t.blue} strokeWidth={2} />
            </div>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Mobile Navigation Map
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, margin: '4px 0 0' }}>
                Dev reference — every screen in both roles, annotated with presentation type (push / modal / sheet / tab root).
              </p>
            </div>
          </div>

          {/* ── Legend ── */}
          <div style={{
            display: 'flex', gap: 10, flexWrap: 'wrap',
            margin: '16px 0 32px',
          }}>
            {MODAL_RULES.map(rule => {
              const pal = (dark ? PRES_DARK : PRES_LIGHT)[rule.pres];
              return (
                <div key={rule.pres} style={{
                  background: t.surface, border: `1px solid ${t.border}`,
                  borderLeft: `3px solid ${pal.border}`,
                  borderRadius: 10, padding: '10px 14px',
                  maxWidth: 280, flex: '1 1 220px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: F.mono, fontSize: 11, fontWeight: 600,
                      color: pal.badgeFg, background: pal.badge,
                      padding: '2px 8px', borderRadius: 4,
                    }}>
                      {PRES_LABELS[rule.pres]}
                    </span>
                    <span style={{ fontFamily: F.inter, fontSize: 13, fontWeight: 600, color: t.text1 }}>
                      {rule.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, lineHeight: 1.45 }}>
                    {rule.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Two-column tree ── */}
          <div style={{
            display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start',
          }}>
            <TreeColumn
              title="Bank Admin"
              subtitle="4 tabs · 26 screens · 9 modals"
              tabs={BANK_TABS}
              tree={BANK_TREE}
              dark={dark}
            />
            <TreeColumn
              title="Org Admin"
              subtitle="4 tabs · 14 screens · 3 modals"
              tabs={ORG_TABS}
              tree={ORG_TREE}
              dark={dark}
            />
          </div>

          {/* ── Screen count summary ── */}
          <div style={{
            marginTop: 40, background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 12, overflow: 'hidden', maxWidth: 700,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                  {['Metric', 'Bank Admin', 'Org Admin', 'Shared'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.text4,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Tab roots',              '4',  '4',  '—'],
                  ['Push screens',           '17', '8',  '1 (Card Detail Y-10)'],
                  ['Modal screens',          '9',  '3',  '—'],
                  ['Bottom sheets (est.)',   '6',  '3',  '—'],
                  ['Total unique screens',   '~30', '~15', '1'],
                  ['More menu tiles',        '9 (Y-03)',  '6 (Y-04)', '—'],
                ].map(([metric, bank, org, shared], i, arr) => (
                  <tr key={metric} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                    <td style={{ padding: '10px 16px', fontFamily: F.inter, fontSize: 13, fontWeight: 500, color: t.text1 }}>{metric}</td>
                    <td style={{ padding: '10px 16px', fontFamily: F.mono, fontSize: 13, color: t.text2 }}>{bank}</td>
                    <td style={{ padding: '10px 16px', fontFamily: F.mono, fontSize: 13, color: t.text2 }}>{org}</td>
                    <td style={{ padding: '10px 16px', fontFamily: F.mono, fontSize: 13, color: t.text3 }}>{shared}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Modal presentation rules ── */}
          <h2 style={{
            fontFamily: F.dm, fontSize: 18, fontWeight: 600, color: t.text1,
            margin: '48px 0 6px', display: 'flex', alignItems: 'baseline', gap: 10,
          }}>
            <span style={{
              fontFamily: F.mono, fontSize: 12, fontWeight: 600, color: t.text4,
              background: t.tableHeaderBg, border: `1px solid ${t.border}`, borderRadius: 4, padding: '2px 8px',
            }}>
              §
            </span>
            Presentation rules
          </h2>
          <div style={{ height: 1, background: t.border, margin: '8px 0 16px' }} />

          <div style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12,
            overflow: 'hidden', maxWidth: 920,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                  {['Flow Type', 'Presentation', 'Header Pattern', 'Ref'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.text4,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Create (new org, batch, compose)',      'Full-screen modal',  'X close + title + action text btn',  'Y-02 §4 / X-00 §7'],
                  ['Edit (org, batch, user role, seller)',   'Full-screen modal',  'X close + title + "Сохранить"',      'Y-02 §4'],
                  ['Multi-step wizard (card import)',        'Full-screen modal',  'X close + "Шаг N из M" + "Далее"',   'Y-02 §4'],
                  ['Filter picker',                         'Full-screen sheet',  'X close + "Фильтры" + "Сбросить"',   'X-00 §7'],
                  ['Confirmation dialog',                   'Bottom sheet',       'Handle bar + title + actions',        'X-00 §11'],
                  ['Quick action menu (⋯)',                 'Bottom sheet',       'Handle bar + action rows',            'X-00 §11'],
                  ['Single-field picker (date, select)',     'Bottom sheet',       'Handle bar + options list',           'X-00 §11'],
                  ['Standard drill-down (list → detail)',    'Push',               'Back chevron + title + ⋯',           'Y-02 §3'],
                ].map(([flow, pres, header, ref], i, arr) => (
                  <tr key={flow} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                    <td style={{ padding: '10px 16px', fontFamily: F.inter, fontSize: 13, fontWeight: 500, color: t.text1 }}>{flow}</td>
                    <td style={{ padding: '10px 16px' }}>
                      {(() => {
                        const p: Presentation = pres.includes('modal') ? 'modal' : pres.includes('sheet') ? 'sheet' : 'push';
                        const palEntry = (dark ? PRES_DARK : PRES_LIGHT)[p];
                        return (
                          <span style={{
                            fontFamily: F.mono, fontSize: 11, fontWeight: 600,
                            color: palEntry.badgeFg, background: palEntry.badge,
                            padding: '2px 8px', borderRadius: 4,
                          }}>
                            {pres}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: F.inter, fontSize: 13, color: t.text2 }}>{header}</td>
                    <td style={{ padding: '10px 16px', fontFamily: F.mono, fontSize: 12, color: t.text3 }}>{ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text4 }}>
              Mobile Navigation Map · Bank + Org · ~45 screens · Dev reference
            </span>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: t.textDisabled }}>© 2026 Moment Finance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
