import React, { useState } from 'react';
import { usePopoverPosition } from '../components/usePopoverPosition';
import {
  Search, ChevronDown, ChevronRight, Plus, MoreVertical, Eye, Settings2, Upload, Archive,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

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
  { id: 1, title: 'Партия Апрель 2026',   org: 'Mysafar OOO',       totalCards: 500, sold: 230, kpiDone: 45,  rewarded: '1 825 000', status: 'Активна',   created: '01.04.2026', kpiDays: 30,
    kpi: [{ label: 'KPI 1: Регистрация', reward: '5 000' }, { label: 'KPI 2: P2P', reward: '5 000' }, { label: 'KPI 3: Оплата 500K', reward: '10 000' }] },
  { id: 2, title: 'Партия Апрель 2026',   org: 'Unired Marketing',  totalCards: 500, sold: 310, kpiDone: 78,  rewarded: '2 740 000', status: 'Активна',   created: '01.04.2026', kpiDays: 30,
    kpi: [{ label: 'KPI 1: Регистрация', reward: '5 000' }, { label: 'KPI 2: P2P', reward: '5 000' }, { label: 'KPI 3: Оплата 500K', reward: '10 000' }] },
  { id: 3, title: 'Партия Март 2026',     org: 'Express Finance',   totalCards: 400, sold: 180, kpiDone: 32,  rewarded: '1 370 000', status: 'Активна',   created: '01.03.2026', kpiDays: 30,
    kpi: [{ label: 'KPI 1: Регистрация', reward: '5 000' }, { label: 'KPI 2: P2P', reward: '5 000' }, { label: 'KPI 3: Оплата 500K', reward: '10 000' }] },
  { id: 4, title: 'Партия Март 2026',     org: 'Digital Pay',       totalCards: 300, sold: 120, kpiDone: 22,  rewarded: '920 000',   status: 'На паузе',  created: '01.03.2026', kpiDays: 30,
    kpi: [{ label: 'KPI 1: Регистрация', reward: '5 000' }, { label: 'KPI 2: P2P', reward: '5 000' }, { label: 'KPI 3: Оплата 500K', reward: '10 000' }] },
  { id: 5, title: 'Партия Февраль 2026',  org: 'SmartCard Group',   totalCards: 500, sold: 500, kpiDone: 290, rewarded: '5 800 000', status: 'Завершена', created: '01.02.2026', kpiDays: 30,
    kpi: [{ label: 'KPI 1: Регистрация', reward: '5 000' }, { label: 'KPI 2: P2P', reward: '5 000' }, { label: 'KPI 3: Оплата 500K', reward: '10 000' }] },
  { id: 6, title: 'Партия Тест',          org: 'CardPlus',          totalCards: 50,  sold: 0,   kpiDone: 0,   rewarded: '0',         status: 'Черновик',  created: '10.04.2026', kpiDays: 30,
    kpi: [{ label: 'KPI 1: Регистрация', reward: '5 000' }, { label: 'KPI 2: P2P', reward: '5 000' }, { label: 'KPI 3: Оплата 500K', reward: '10 000' }] },
];

const ORGS = ['Mysafar OOO', 'Unired Marketing', 'Express Finance', 'Digital Pay', 'SmartCard Group', 'CardPlus'];

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS STYLES (dark-aware)
═══════════════════════════════════════════════════════════════════════════ */

function statusCfg(status: BatchStatus, t: T, dark: boolean) {
  if (status === 'Активна')   return dark
    ? { bg: 'rgba(52,211,153,0.12)', color: '#34D399', dot: '#34D399', border: 'transparent' }
    : { bg: '#F0FDF4',               color: '#15803D', dot: '#16A34A', border: 'transparent' };
  if (status === 'На паузе')  return dark
    ? { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24', dot: '#FBBF24', border: 'transparent' }
    : { bg: '#FFFBEB',               color: '#B45309', dot: '#D97706', border: 'transparent' };
  if (status === 'Завершена') return dark
    ? { bg: D.tableAlt, color: D.text2, dot: D.text4, border: 'transparent' }
    : { bg: '#F3F4F6',  color: '#374151', dot: '#9CA3AF', border: 'transparent' };
  return dark
    ? { bg: t.surface, color: t.text3, dot: t.inputBorder, border: t.border }
    : { bg: t.surface, color: t.text3, dot: t.inputBorder, border: t.border };
}

function StatusBadge({ status, t, dark }: { status: BatchStatus; t: T; dark: boolean }) {
  const s = statusCfg(status, t, dark);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: s.bg, color: s.color, whiteSpace: 'nowrap',
      border: s.border !== 'transparent' ? `1px solid ${s.border}` : '1px solid transparent',
      flexShrink: 0,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI BADGE
═══════════════════════════════════════════════════════════════════════════ */

function KpiBadge({ label, reward, t }: { label: string; reward: string; t: T }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '8px',
      background: t.blueLt, color: t.blue,
      border: `1px solid ${t.blueTint}`,
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {label} — <span style={{ fontFamily: F.mono, fontSize: '11px' }}>{reward}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT ITEM
═══════════════════════════════════════════════════════════════════════════ */

function StatItem({ label, value, mono, t }: { label: string; value: string; mono?: boolean; t: T }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ fontFamily: mono ? F.mono : F.dm, fontSize: '15px', fontWeight: 600, color: t.text1 }}>
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION MENU
═══════════════════════════════════════════════════════════════════════════ */

function ActionMenuItem({ icon: Icon, label, danger, onClick, t, dark }: {
  icon: React.ElementType; label: string; danger?: boolean; onClick: () => void; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const dangerHoverBg = dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2';
  const dangerText    = dark ? '#F87171' : '#DC2626';
  const safeHoverBg   = dark ? D.tableHover : '#F9FAFB';
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
        background: hov ? (danger ? dangerHoverBg : safeHoverBg) : 'transparent',
        cursor: 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        color: hov ? (danger ? dangerText : t.text1) : (danger ? t.text3 : t.text2),
        transition: 'all 0.1s',
      }}
    >
      <Icon size={14} strokeWidth={1.75} />
      {label}
    </button>
  );
}

function BatchActionMenu({ t, dark }: { t: T; dark: boolean }) {
  const pop = usePopoverPosition();
  const btnHoverBg = dark ? D.tableHover : '#F3F4F6';

  return (
    <div ref={pop.rootRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={e => { e.stopPropagation(); pop.toggle(); }}
        style={{
          width: '32px', height: '32px',
          border: `1px solid ${pop.open ? t.blue : t.border}`,
          borderRadius: '7px',
          background: pop.open ? t.blueLt : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s',
        }}
        onMouseEnter={e => { if (!pop.open) { (e.currentTarget.style.background = btnHoverBg); } }}
        onMouseLeave={e => { if (!pop.open) { (e.currentTarget.style.background = 'transparent'); } }}
      >
        <MoreVertical size={15} color={pop.open ? t.blue : t.text3} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '10px', padding: '6px',
          boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.10)',
          minWidth: '180px',
        }}>
          <ActionMenuItem icon={Eye}       label="Карты"          onClick={pop.close} t={t} dark={dark} />
          <ActionMenuItem icon={Settings2} label="KPI настройки"  onClick={pop.close} t={t} dark={dark} />
          <ActionMenuItem icon={Upload}    label="Импорт"         onClick={pop.close} t={t} dark={dark} />
          <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />
          <ActionMenuItem icon={Archive}   label="Архивировать"   danger onClick={pop.close} t={t} dark={dark} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIVIDER
═══════════════════════════════════════════════════════════════════════════ */

function CardDivider({ t }: { t: T }) {
  return <div style={{ height: '1px', background: t.border, margin: '14px 0' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   BATCH CARD
═══════════════════════════════════════════════════════════════════════════ */

function BatchCardItem({ batch, t, dark }: { batch: BatchCard; t: T; dark: boolean }) {
  const [ghostHov, setGhostHov] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const hoverBorder = hovered ? (dark ? t.blue : '#D1D5DB') : t.border;
  const hoverShadow = hovered
    ? (dark ? 'none' : '0 4px 16px rgba(0,0,0,0.07)')
    : (dark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)');

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/card-batches/${batch.id}`)}
      style={{
        background: t.surface,
        border: `1px solid ${hoverBorder}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hoverShadow,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: F.dm, fontSize: '15px', fontWeight: 700, color: t.text1, lineHeight: 1.25, marginBottom: '4px' }}>
            {batch.title}
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
            {batch.org}
          </div>
        </div>
        <StatusBadge status={batch.status} t={t} dark={dark} />
      </div>

      <CardDivider t={t} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
        <StatItem label="Всего карт"     value={String(batch.totalCards)} mono t={t} />
        <StatItem label="Продано"        value={String(batch.sold)}       mono t={t} />
        <StatItem label="KPI завершено"  value={String(batch.kpiDone)}    mono t={t} />
        <StatItem label="Начислено"      value={`${batch.rewarded} UZS`}  mono t={t} />
      </div>

      <CardDivider t={t} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {batch.kpi.map(k => (
          <KpiBadge key={k.label} label={k.label} reward={k.reward} t={t} />
        ))}
      </div>

      <CardDivider t={t} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4 }}>
            Создана:{' '}
            <span style={{ fontFamily: F.mono, color: t.text3 }}>{batch.created}</span>
          </span>
          <span style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4 }}>
            Срок KPI:{' '}
            <span style={{ fontFamily: F.mono, color: t.text3 }}>{batch.kpiDays} дней</span>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
        <button
          onMouseEnter={() => setGhostHov(true)}
          onMouseLeave={() => setGhostHov(false)}
          onClick={e => { e.stopPropagation(); navigate(`/card-batches/${batch.id}`); }}
          style={{
            height: '32px', padding: '0 14px',
            border: `1px solid ${ghostHov ? t.blue : t.border}`,
            borderRadius: '7px',
            background: ghostHov ? t.blueLt : 'transparent',
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
            color: ghostHov ? t.blue : t.text2,
            cursor: 'pointer', transition: 'all 0.12s',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}
        >
          <Eye size={13} strokeWidth={1.75} />
          Подробнее
        </button>

        <div onClick={e => e.stopPropagation()}>
          <BatchActionMenu t={t} dark={dark} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange, t }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; t: T;
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
          border: `1px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '14px', color: t.text2,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: '160px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={t.text3} style={{
        position: 'absolute', right: '10px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function CardBatchesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [addHov, setAddHov] = useState(false);

  const visible = BATCHES.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.org.toLowerCase().includes(q);
    const matchOrg    = !orgFilter || b.org === orgFilter;
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchOrg && matchStatus;
  });

  const clearChipHover = dark ? D.tableHover : '#F3F4F6';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>

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

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
              <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Партии карт</span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
            }}>
              <div>
                <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                  Партии карт
                </h1>
                <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                  Управление партиями выпущенных карт
                </p>
              </div>

              <button
                onMouseEnter={() => setAddHov(true)}
                onMouseLeave={() => setAddHov(false)}
                onClick={() => navigate('/card-batches/new')}
                style={{
                  height: '40px', padding: '0 18px',
                  background: addHov ? t.blueHover : t.blue,
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

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '12px',
              alignItems: 'center', marginBottom: '24px',
            }}>
              <div style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
                <Search
                  size={16}
                  color={searchFocused ? t.blue : t.text4}
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
                    border: `1px solid ${searchFocused ? t.blue : t.inputBorder}`,
                    borderRadius: '8px', background: t.surface,
                    fontFamily: F.inter, fontSize: '14px', color: t.text1,
                    outline: 'none', boxSizing: 'border-box',
                    boxShadow: searchFocused ? `0 0 0 3px ${t.focusRing}` : 'none',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                />
              </div>

              <FilterSelect label="Организация: Все" options={ORGS} value={orgFilter} onChange={setOrgFilter} t={t} />
              <FilterSelect label="Статус: Все"      options={['Активна', 'Завершена', 'Черновик', 'На паузе']} value={statusFilter} onChange={setStatusFilter} t={t} />

              {(search || orgFilter || statusFilter) && (
                <button
                  onClick={() => { setSearch(''); setOrgFilter(''); setStatusFilter(''); }}
                  style={{
                    border: 'none', background: 'transparent',
                    fontFamily: F.inter, fontSize: '13px', color: t.text3,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '4px 8px', borderRadius: '6px',
                    transition: 'color 0.12s, background 0.12s',
                  }}
                  onMouseEnter={e => { (e.currentTarget.style.color = t.text1); (e.currentTarget.style.background = clearChipHover); }}
                  onMouseLeave={e => { (e.currentTarget.style.color = t.text3); (e.currentTarget.style.background = 'transparent'); }}
                >
                  <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                  Сбросить
                </button>
              )}

              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4, marginLeft: 'auto' }}>
                {visible.length} из {BATCHES.length} партий
              </span>
            </div>

            {visible.length === 0 ? (
              <div style={{
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: '12px', padding: '64px 24px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text4 }}>
                  Ничего не найдено по заданным фильтрам
                </div>
                <button
                  onClick={() => { setSearch(''); setOrgFilter(''); setStatusFilter(''); }}
                  style={{
                    marginTop: '12px', height: '36px', padding: '0 16px',
                    border: `1px solid ${t.border}`, borderRadius: '8px',
                    background: 'transparent', fontFamily: F.inter, fontSize: '13px',
                    color: t.text2, cursor: 'pointer',
                  }}
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="cb-grid">
                {visible.map(batch => (
                  <BatchCardItem key={batch.id} batch={batch} t={t} dark={dark} />
                ))}
              </div>
            )}

            <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
