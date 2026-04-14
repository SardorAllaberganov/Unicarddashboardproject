import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Search, MoreVertical,
  ArrowDownToLine, Clock, CheckCircle,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { DateRangePicker } from '../components/DateRangePicker';

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

const VARIANTS = {
  amber:  { icon: '#D97706', iconBg: '#FFFBEB', border: '#FDE68A' },
  blue:   { icon: C.blue,    iconBg: C.blueLt,  border: C.blueTint },
  green:  { icon: '#16A34A', iconBg: '#F0FDF4',  border: '#BBF7D0' },
} as const;

function StatCard({ icon: Icon, variant, label, value, subtitle }: {
  icon: React.ElementType;
  variant: keyof typeof VARIANTS;
  label: string;
  value: string;
  subtitle?: string;
}) {
  const v = VARIANTS[variant];
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px', flex: 1,
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: v.iconBg, border: `1px solid ${v.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={v.icon} strokeWidth={1.75} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text3, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: C.text1, lineHeight: 1.2 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4, marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
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
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          height: '40px', padding: '0 36px 0 12px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          fontFamily: F.inter, fontSize: '14px', color: C.text2,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s', minWidth: '160px',
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

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

type WdStatus = 'Выполнен' | 'В обработке' | 'Отклонён';

function StatusBadge({ status }: { status: WdStatus }) {
  const cfg: Record<WdStatus, { bg: string; color: string; dot: string }> = {
    'Выполнен':     { bg: C.successBg, color: '#15803D', dot: C.success },
    'В обработке':  { bg: C.warningBg, color: '#B45309', dot: C.warning },
    'Отклонён':     { bg: '#FEF2F2',   color: '#DC2626', dot: '#EF4444' },
  };
  const c = cfg[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: c.bg, color: c.color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AVATAR CELL
═══════════════════════════════════════════════════════════════════════════ */

function AvatarCell({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: C.blueLt, border: `1px solid ${C.blueTint}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ fontFamily: F.inter, fontSize: '10px', fontWeight: 700, color: C.blue }}>{initials}</span>
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2, whiteSpace: 'nowrap' }}>{name}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION DROPDOWN
═══════════════════════════════════════════════════════════════════════════ */

function ActionDropdown({ status, onAction }: { status: WdStatus; onAction: (action: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const actions = [
    { id: 'details', label: 'Подробнее' },
    ...(status === 'В обработке' ? [
      { id: 'approve', label: 'Подтвердить' },
      { id: 'reject', label: 'Отклонить', danger: true },
    ] : []),
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{
          width: '28px', height: '28px',
          border: `1px solid ${open ? C.blue : C.border}`,
          borderRadius: '6px',
          background: open ? C.blueLt : C.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s',
        }}
      >
        <MoreVertical size={14} color={open ? C.blue : C.text3} strokeWidth={1.75} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '10px', padding: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.09)', zIndex: 50, minWidth: '180px',
        }}>
          {actions.map((action, idx) => (
            <React.Fragment key={action.id}>
              {action.danger && <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />}
              <button
                onMouseEnter={() => setHovered(action.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={e => { e.stopPropagation(); onAction(action.id); setOpen(false); }}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '7px', border: 'none',
                  background: hovered === action.id ? (action.danger ? '#FEF2F2' : '#F9FAFB') : 'none',
                  cursor: 'pointer', fontFamily: F.inter, fontSize: '13px',
                  color: hovered === action.id && action.danger ? '#DC2626' : C.text2,
                  transition: 'all 0.1s',
                }}
              >
                {action.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface WdRow {
  id: number;
  date: string;
  seller: string;
  amount: string;
  method: string;
  details: string;
  ucoinTx: string;
  status: WdStatus;
}

const WITHDRAWALS: WdRow[] = [
  { id: 1, date: '13.04 14:00', seller: 'Абдуллох Р.',  amount: '120 000', method: 'UZCARD', details: '8600 •••• 4455', ucoinTx: 'UCN-8832', status: 'Выполнен' },
  { id: 2, date: '13.04 10:30', seller: 'Санжар М.',    amount: '200 000', method: 'HUMO',   details: '9860 •••• 7788', ucoinTx: 'UCN-8835', status: 'Выполнен' },
  { id: 3, date: '12.04 16:00', seller: 'Нилуфар К.',   amount: '80 000',  method: 'UZCARD', details: '8600 •••• 1122', ucoinTx: 'UCN-8829', status: 'Выполнен' },
  { id: 4, date: '12.04 12:00', seller: 'Ислом Т.',     amount: '100 000', method: 'VISA',   details: '4278 •••• 9900', ucoinTx: 'UCN-8828', status: 'Выполнен' },
  { id: 5, date: '11.04 18:00', seller: 'Камола Р.',    amount: '60 000',  method: 'UZCARD', details: '8600 •••• 3344', ucoinTx: 'UCN-8825', status: 'Выполнен' },
  { id: 6, date: '11.04 09:00', seller: 'Дарья Н.',     amount: '50 000',  method: 'HUMO',   details: '9860 •••• 5566', ucoinTx: 'UCN-8824', status: 'Выполнен' },
  { id: 7, date: '13.04 15:30', seller: 'Санжар М.',    amount: '50 000',  method: 'UZCARD', details: '8600 •••• 7788', ucoinTx: 'UCN-8836', status: 'В обработке' },
  { id: 8, date: '13.04 11:00', seller: 'Ислом Т.',     amount: '35 000',  method: 'HUMO',   details: '9860 •••• 2233', ucoinTx: 'UCN-8837', status: 'В обработке' },
];

const SELLERS_LIST = ['Санжар', 'Абдуллох', 'Ислом', 'Нилуфар', 'Дарья', 'Камола'];
const STATUS_OPTIONS = ['Выполнен', 'В обработке', 'Отклонён'];

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE STYLES
═══════════════════════════════════════════════════════════════════════════ */

const hCell: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left',
  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.text4,
  textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
};

const dCell: React.CSSProperties = {
  padding: '14px 16px', whiteSpace: 'nowrap',
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrgWithdrawalsPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });

  const [search, setSearch] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="org"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Выводы средств</span>
          </div>

          {/* Top Bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Выводы средств
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                Запросы на вывод вознаграждений продавцами Mysafar OOO
              </p>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* 3× Stat Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px', marginBottom: '24px',
          }}>
            <StatCard icon={ArrowDownToLine} variant="amber" label="Всего выведено" value="1 200 000" />
            <StatCard icon={Clock}           variant="blue"  label="В обработке"    value="85 000" subtitle="2 запроса" />
            <StatCard icon={CheckCircle}     variant="green" label="Баланс в кошельках" value="625 000" subtitle="6 продавцов" />
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            alignItems: 'center', marginBottom: '24px',
          }}>
            <div style={{ position: 'relative', width: '340px', flexShrink: 0 }}>
              <Search size={16} color={searchFocused ? C.blue : C.text4} style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                placeholder="Поиск по продавцу или номеру транзакции..."
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
            <FilterSelect label="Продавец: Все" options={SELLERS_LIST} value={sellerFilter} onChange={setSellerFilter} />
            <FilterSelect label="Статус: Все" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />

            {(search || sellerFilter || statusFilter) && (
              <button
                onClick={() => { setSearch(''); setSellerFilter(''); setStatusFilter(''); }}
                style={{
                  border: 'none', background: 'none',
                  fontFamily: F.inter, fontSize: '13px', color: C.text3,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 8px', borderRadius: '6px',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.text1; e.currentTarget.style.background = '#F3F4F6'; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.text3; e.currentTarget.style.background = 'none'; }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                Сбросить
              </button>
            )}
          </div>

          {/* Data Table */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', overflowX: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
              <thead>
                <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
                  <th style={hCell}>#</th>
                  <th style={hCell}>Дата</th>
                  <th style={hCell}>Продавец</th>
                  <th style={hCell}>Сумма</th>
                  <th style={hCell}>Метод</th>
                  <th style={hCell}>Реквизиты</th>
                  <th style={hCell}>UCOIN TX</th>
                  <th style={hCell}>Статус</th>
                  <th style={hCell}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {WITHDRAWALS.map((wd, i) => {
                  const hov = hovRow === i;
                  const isPending = wd.status === 'В обработке';
                  return (
                    <tr key={wd.id}
                      onMouseEnter={() => setHovRow(i)}
                      onMouseLeave={() => setHovRow(null)}
                      style={{
                        borderBottom: i < WITHDRAWALS.length - 1 ? `1px solid ${C.border}` : 'none',
                        background: hov ? '#FAFBFC' : C.surface,
                        borderLeft: isPending ? `3px solid ${C.warning}` : '3px solid transparent',
                        transition: 'background 0.1s',
                      }}
                    >
                      <td style={dCell}>
                        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{wd.id}</span>
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{wd.date}</span>
                      </td>
                      <td style={dCell}>
                        <AvatarCell name={wd.seller} />
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: C.text1 }}>
                          {wd.amount}
                        </span>
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{wd.method}</span>
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text3 }}>{wd.details}</span>
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text4 }}>{wd.ucoinTx}</span>
                      </td>
                      <td style={dCell}>
                        <StatusBadge status={wd.status} />
                      </td>
                      <td style={dCell}>
                        <ActionDropdown
                          status={wd.status}
                          onAction={action => console.log(action, wd.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            marginTop: '16px', fontFamily: F.inter, fontSize: '13px',
            color: C.text3, textAlign: 'center',
          }}>
            Показано 1–8 из 8
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
