import React, { useState, useRef, useEffect } from 'react';
import { usePopoverPosition } from '../components/usePopoverPosition';
import {
  Search, ChevronDown, ChevronRight, Plus, MoreVertical, Eye, Settings2, Upload, Archive,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

type BatchStatus = 'Активна' | 'На паузе' | 'Завершена' | 'Черновик';

interface KpiConfig {
  label: string;
  reward: string;
}

interface BatchCard {
  id: number;
  title: string;
  org: string;
  totalCards: number;
  sold: number;
  kpiDone: number;
  rewarded: string;
  status: BatchStatus;
  created: string;
  kpiDays: number;
  kpi: [KpiConfig, KpiConfig, KpiConfig];
}

const BATCHES: BatchCard[] = [
  {
    id: 1,
    title: 'Партия Апрель 2026',
    org: 'Mysafar OOO',
    totalCards: 500,
    sold: 230,
    kpiDone: 45,
    rewarded: '1 825 000',
    status: 'Активна',
    created: '01.04.2026',
    kpiDays: 30,
    kpi: [
      { label: 'KPI 1: Регистрация', reward: '5 000' },
      { label: 'KPI 2: P2P',         reward: '5 000' },
      { label: 'KPI 3: Оплата 500K', reward: '10 000' },
    ],
  },
  {
    id: 2,
    title: 'Партия Апрель 2026',
    org: 'Unired Marketing',
    totalCards: 500,
    sold: 310,
    kpiDone: 78,
    rewarded: '2 740 000',
    status: 'Активна',
    created: '01.04.2026',
    kpiDays: 30,
    kpi: [
      { label: 'KPI 1: Регистрация', reward: '5 000' },
      { label: 'KPI 2: P2P',         reward: '5 000' },
      { label: 'KPI 3: Оплата 500K', reward: '10 000' },
    ],
  },
  {
    id: 3,
    title: 'Партия Март 2026',
    org: 'Express Finance',
    totalCards: 400,
    sold: 180,
    kpiDone: 32,
    rewarded: '1 370 000',
    status: 'Активна',
    created: '01.03.2026',
    kpiDays: 30,
    kpi: [
      { label: 'KPI 1: Регистрация', reward: '5 000' },
      { label: 'KPI 2: P2P',         reward: '5 000' },
      { label: 'KPI 3: Оплата 500K', reward: '10 000' },
    ],
  },
  {
    id: 4,
    title: 'Партия Март 2026',
    org: 'Digital Pay',
    totalCards: 300,
    sold: 120,
    kpiDone: 22,
    rewarded: '920 000',
    status: 'На паузе',
    created: '01.03.2026',
    kpiDays: 30,
    kpi: [
      { label: 'KPI 1: Регистрация', reward: '5 000' },
      { label: 'KPI 2: P2P',         reward: '5 000' },
      { label: 'KPI 3: Оплата 500K', reward: '10 000' },
    ],
  },
  {
    id: 5,
    title: 'Партия Февраль 2026',
    org: 'SmartCard Group',
    totalCards: 500,
    sold: 500,
    kpiDone: 290,
    rewarded: '5 800 000',
    status: 'Завершена',
    created: '01.02.2026',
    kpiDays: 30,
    kpi: [
      { label: 'KPI 1: Регистрация', reward: '5 000' },
      { label: 'KPI 2: P2P',         reward: '5 000' },
      { label: 'KPI 3: Оплата 500K', reward: '10 000' },
    ],
  },
  {
    id: 6,
    title: 'Партия Тест',
    org: 'CardPlus',
    totalCards: 50,
    sold: 0,
    kpiDone: 0,
    rewarded: '0',
    status: 'Черновик',
    created: '10.04.2026',
    kpiDays: 30,
    kpi: [
      { label: 'KPI 1: Регистрация', reward: '5 000' },
      { label: 'KPI 2: P2P',         reward: '5 000' },
      { label: 'KPI 3: Оплата 500K', reward: '10 000' },
    ],
  },
];

const ORGS = ['Mysafar OOO', 'Unired Marketing', 'Express Finance', 'Digital Pay', 'SmartCard Group', 'CardPlus'];

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS STYLES
═══════════════════════════════════════════════════════════════════════════ */

const STATUS_CFG: Record<BatchStatus, { bg: string; color: string; dot?: string; border?: string; dotBg?: string }> = {
  'Активна':   { bg: '#F0FDF4', color: '#15803D', dot: '#16A34A' },
  'На паузе':  { bg: '#FFFBEB', color: '#B45309', dot: '#D97706' },
  'Завершена': { bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' },
  'Черновик':  { bg: C.surface, color: C.text3,   dot: C.inputBorder, border: C.border },
};

function StatusBadge({ status }: { status: BatchStatus }) {
  const s = STATUS_CFG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: s.bg, color: s.color, whiteSpace: 'nowrap',
      border: s.border ? `1px solid ${s.border}` : '1px solid transparent',
      flexShrink: 0,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot ?? s.color, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI BADGE
═══════════════════════════════════════════════════════════════════════════ */

function KpiBadge({ label, reward }: { label: string; reward: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '8px',
      background: C.blueLt, color: C.blue,
      border: `1px solid ${C.blueTint}`,
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {label} — <span style={{ fontFamily: F.mono, fontSize: '11px' }}>{reward}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT ITEM
═══════════════════════════════════════════════════════════════════════════ */

function StatItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ fontFamily: mono ? F.mono : F.dm, fontSize: '15px', fontWeight: 600, color: C.text1 }}>
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION MENU
═══════════════════════════════════════════════════════════════════════════ */

function ActionMenuItem({ icon: Icon, label, danger, onClick }: {
  icon: React.ElementType; label: string; danger?: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: '8px 10px', borderRadius: '7px',
        border: 'none',
        background: hov ? (danger ? '#FEF2F2' : '#F9FAFB') : 'none',
        cursor: 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        color: hov ? (danger ? '#DC2626' : C.text1) : (danger ? C.text3 : C.text2),
        transition: 'all 0.1s',
      }}
    >
      <Icon size={14} strokeWidth={1.75} />
      {label}
    </button>
  );
}

function BatchActionMenu() {
  const pop = usePopoverPosition();

  return (
    <div ref={pop.rootRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={e => { e.stopPropagation(); pop.toggle(); }}
        style={{
          width: '32px', height: '32px',
          border: `1px solid ${pop.open ? C.blue : C.border}`,
          borderRadius: '7px',
          background: pop.open ? C.blueLt : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s',
        }}
        onMouseEnter={e => { if (!pop.open) { (e.currentTarget.style.background = '#F3F4F6'); } }}
        onMouseLeave={e => { if (!pop.open) { (e.currentTarget.style.background = 'transparent'); } }}
      >
        <MoreVertical size={15} color={pop.open ? C.blue : C.text3} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '10px', padding: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          minWidth: '180px',
        }}>
          <ActionMenuItem icon={Eye}       label="Карты"          onClick={pop.close} />
          <ActionMenuItem icon={Settings2} label="KPI настройки"  onClick={pop.close} />
          <ActionMenuItem icon={Upload}    label="Импорт"         onClick={pop.close} />
          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
          <ActionMenuItem icon={Archive}   label="Архивировать"   danger onClick={pop.close} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIVIDER
═══════════════════════════════════════════════════════════════════════════ */

function CardDivider() {
  return <div style={{ height: '1px', background: C.border, margin: '14px 0' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   BATCH CARD
═══════════════════════════════════════════════════════════════════════════ */

function BatchCardItem({ batch }: { batch: BatchCard }) {
  const [ghostHov, setGhostHov] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/card-batches/${batch.id}`)}
      style={{
        background: C.surface,
        border: `1px solid ${hovered ? '#D1D5DB' : C.border}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Top row: title + badge ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: F.dm, fontSize: '15px', fontWeight: 700, color: C.text1, lineHeight: 1.25, marginBottom: '4px' }}>
            {batch.title}
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
            {batch.org}
          </div>
        </div>
        <StatusBadge status={batch.status} />
      </div>

      <CardDivider />

      {/* ── Stats 2×2 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
        <StatItem label="Всего карт"     value={String(batch.totalCards)} mono />
        <StatItem label="Продано"        value={String(batch.sold)} mono />
        <StatItem label="KPI завершено"  value={String(batch.kpiDone)} mono />
        <StatItem label="Начислено"      value={`${batch.rewarded} UZS`} mono />
      </div>

      <CardDivider />

      {/* ── KPI config badges ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {batch.kpi.map(k => (
          <KpiBadge key={k.label} label={k.label} reward={k.reward} />
        ))}
      </div>

      <CardDivider />

      {/* ── Bottom meta ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4 }}>
            Создана:{' '}
            <span style={{ fontFamily: F.mono, color: C.text3 }}>{batch.created}</span>
          </span>
          <span style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4 }}>
            Срок KPI:{' '}
            <span style={{ fontFamily: F.mono, color: C.text3 }}>{batch.kpiDays} дней</span>
          </span>
        </div>
      </div>

      {/* ── Action row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
        {/* Ghost button */}
        <button
          onMouseEnter={() => setGhostHov(true)}
          onMouseLeave={() => setGhostHov(false)}
          onClick={e => { e.stopPropagation(); navigate(`/card-batches/${batch.id}`); }}
          style={{
            height: '32px', padding: '0 14px',
            border: `1px solid ${ghostHov ? C.blue : C.border}`,
            borderRadius: '7px',
            background: ghostHov ? C.blueLt : 'transparent',
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
            color: ghostHov ? C.blue : C.text2,
            cursor: 'pointer', transition: 'all 0.12s',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}
        >
          <Eye size={13} strokeWidth={1.75} />
          Подробнее
        </button>

        {/* Action dots */}
        <div onClick={e => e.stopPropagation()}>
          <BatchActionMenu />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: '40px', padding: '0 36px 0 12px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          fontFamily: F.inter, fontSize: '14px', color: C.text2,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: '160px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={C.text3} style={{
        position: 'absolute', right: '10px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════���════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function CardBatchesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [addHov, setAddHov] = useState(false);

  /* Filtered data */
  const visible = BATCHES.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.org.toLowerCase().includes(q);
    const matchOrg    = !orgFilter || b.org === orgFilter;
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchOrg && matchStatus;
  });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>

      {/* ── Sidebar ── */}
      <style>{`
        .cb-sidebar { flex-shrink: 0; }
        @media (max-width: 768px) { .cb-sidebar { display: none; } }
        .cb-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1100px) {
          .cb-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cb-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cb-sidebar">
        <Sidebar role="bank"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(d => !d)}
        />
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        {/* ── Content ── */}
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
              <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Партии карт</span>
            </div>

            {/* ── Top bar: title + primary button ── */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
            }}>
              <div>
                <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                  Партии карт
                </h1>
                <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                  Управление партиями выпущенных карт
                </p>
              </div>

              <button
                onMouseEnter={() => setAddHov(true)}
                onMouseLeave={() => setAddHov(false)}
                onClick={() => navigate('/card-batches/new')}
                style={{
                  height: '40px', padding: '0 18px',
                  background: addHov ? C.blueHover : C.blue,
                  border: 'none', borderRadius: '8px',
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#fff',
                  display: 'flex', alignItems: 'center', gap: '7px',
                  cursor: 'pointer', flexShrink: 0,
                  boxShadow: addHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
              >
                <Plus size={16} strokeWidth={2.25} />
                Создать партию
              </button>
            </div>

            {/* ── Filter bar ── */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '12px',
              alignItems: 'center', marginBottom: '24px',
            }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
                <Search
                  size={16}
                  color={searchFocused ? C.blue : C.text4}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color 0.12s' }}
                />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Поиск по названию партии..."
                  style={{
                    width: '100%', height: '40px', paddingLeft: '38px', paddingRight: '12px',
                    border: `1px solid ${searchFocused ? C.blue : C.inputBorder}`,
                    borderRadius: '8px', background: C.surface,
                    fontFamily: F.inter, fontSize: '14px', color: C.text1,
                    outline: 'none', boxSizing: 'border-box',
                    boxShadow: searchFocused ? `0 0 0 3px ${C.blueTint}` : 'none',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                />
              </div>

              <FilterSelect
                label="Организация: Все"
                options={ORGS}
                value={orgFilter}
                onChange={setOrgFilter}
              />

              <FilterSelect
                label="Статус: Все"
                options={['Активна', 'Завершена', 'Черновик', 'На паузе']}
                value={statusFilter}
                onChange={setStatusFilter}
              />

              {/* Clear */}
              {(search || orgFilter || statusFilter) && (
                <button
                  onClick={() => { setSearch(''); setOrgFilter(''); setStatusFilter(''); }}
                  style={{
                    border: 'none', background: 'none',
                    fontFamily: F.inter, fontSize: '13px', color: C.text3,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '4px 8px', borderRadius: '6px',
                    transition: 'color 0.12s, background 0.12s',
                  }}
                  onMouseEnter={e => { (e.currentTarget.style.color = C.text1); (e.currentTarget.style.background = '#F3F4F6'); }}
                  onMouseLeave={e => { (e.currentTarget.style.color = C.text3); (e.currentTarget.style.background = 'none'); }}
                >
                  <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                  Сбросить
                </button>
              )}

              {/* Result count */}
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text4, marginLeft: 'auto' }}>
                {visible.length} из {BATCHES.length} партий
              </span>
            </div>

            {/* ── Card grid ── */}
            {visible.length === 0 ? (
              <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: '12px', padding: '64px 24px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: F.inter, fontSize: '14px', color: C.text4 }}>
                  Ничего не найдено по заданным фильтрам
                </div>
                <button
                  onClick={() => { setSearch(''); setOrgFilter(''); setStatusFilter(''); }}
                  style={{
                    marginTop: '12px', height: '36px', padding: '0 16px',
                    border: `1px solid ${C.border}`, borderRadius: '8px',
                    background: C.surface, fontFamily: F.inter, fontSize: '13px',
                    color: C.text2, cursor: 'pointer',
                  }}
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="cb-grid">
                {visible.map(batch => (
                  <BatchCardItem key={batch.id} batch={batch} />
                ))}
              </div>
            )}

            <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}