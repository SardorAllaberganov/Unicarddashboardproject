import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Search, Plus, MoreVertical, X,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';
import { usePopoverPosition } from '../components/usePopoverPosition';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

interface SellerRow {
  id: number;
  name: string;
  phone: string;
  assigned: number;
  sold: number;
  percentSold: number;
  kpi1: number;
  kpi2: number;
  kpi3: number;
  earned: string;
  withdrawn: string;
  balance: string;
  status: 'Активен' | 'Неактивен';
}

const SELLERS: SellerRow[] = [
  { id: 1, name: 'Санжар Мирзаев',    phone: '+998 91 111 22 33', assigned: 100, sold: 62, percentSold: 62, kpi1: 55, kpi2: 41, kpi3: 15, earned: '555 000', withdrawn: '400 000', balance: '155 000', status: 'Активен' },
  { id: 2, name: 'Абдуллох Рахимов',   phone: '+998 90 222 33 44', assigned: 100, sold: 45, percentSold: 45, kpi1: 38, kpi2: 22, kpi3: 8,  earned: '330 000', withdrawn: '250 000', balance: '80 000',  status: 'Активен' },
  { id: 3, name: 'Ислом Тошматов',     phone: '+998 93 333 44 55', assigned: 80,  sold: 42, percentSold: 52, kpi1: 35, kpi2: 20, kpi3: 10, earned: '350 000', withdrawn: '200 000', balance: '150 000', status: 'Активен' },
  { id: 4, name: 'Нилуфар Каримова',   phone: '+998 94 444 55 66', assigned: 100, sold: 33, percentSold: 33, kpi1: 28, kpi2: 18, kpi3: 5,  earned: '255 000', withdrawn: '180 000', balance: '75 000',  status: 'Активен' },
  { id: 5, name: 'Дарья Нам',          phone: '+998 95 555 66 77', assigned: 70,  sold: 30, percentSold: 43, kpi1: 15, kpi2: 10, kpi3: 5,  earned: '210 000', withdrawn: '150 000', balance: '60 000',  status: 'Активен' },
  { id: 6, name: 'Камола Расулова',    phone: '+998 90 666 77 88', assigned: 50,  sold: 18, percentSold: 36, kpi1: 14, kpi2: 9,  kpi3: 2,  earned: '125 000', withdrawn: '60 000',  balance: '65 000',  status: 'Активен' },
];

const STATUSES = ['Активен', 'Неактивен'];
const SORT_OPTIONS = ['По имени', 'По продажам', 'По заработку'];

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
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
          height: '40px',
          padding: '0 36px 0 12px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px',
          background: C.surface,
          fontFamily: F.inter,
          fontSize: '14px',
          color: C.text2,
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: '160px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={C.text3} style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: SellerRow['status'] }) {
  const configs: Record<SellerRow['status'], { bg: string; color: string; dot: string }> = {
    'Активен': { bg: C.successBg, color: '#15803D', dot: C.success },
    'Неактивен': { bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' },
  };

  const cfg = configs[status];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontFamily: F.inter,
      fontSize: '12px',
      fontWeight: 500,
      padding: '3px 10px',
      borderRadius: '10px',
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS CELL
═══════════════════════════════════════════════════════════════════════════ */

function ProgressCell({ value }: { value: number }) {
  const barColor = value >= 60 ? C.success : value >= 40 ? C.warning : C.error;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
      <div style={{
        flex: 1,
        height: '6px',
        borderRadius: '3px',
        background: '#E5E7EB',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          background: barColor,
          borderRadius: '3px',
        }} />
      </div>
      <span style={{
        fontFamily: F.mono,
        fontSize: '11px',
        color: C.text3,
        flexShrink: 0,
      }}>
        {value}%
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION DOTS DROPDOWN
═══════════════════════════════════════════════════════════════════════════ */

function ActionDropdown({ sellerId }: { sellerId: number }) {
  const pop = usePopoverPosition();
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  const actions = [
    { id: 'details', label: 'Подробнее' },
    { id: 'assign-cards', label: 'Назначить карты' },
    { id: 'edit', label: 'Редактировать' },
    { id: 'deactivate', label: 'Деактивировать', danger: true },
  ];

  return (
    <div ref={pop.rootRef} style={{ position: 'relative' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={pop.toggle}
        style={{
          width: '28px',
          height: '28px',
          border: `1px solid ${pop.open ? C.blue : C.border}`,
          borderRadius: '6px',
          background: pop.open ? C.blueLt : C.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.12s',
        }}
      >
        <MoreVertical size={14} color={pop.open ? C.blue : C.text3} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          padding: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: '200px',
        }}>
          {actions.map((action, idx) => (
            <React.Fragment key={action.id}>
              {idx === actions.length - 1 && <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />}
              <button
                onMouseEnter={() => setHovered(action.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (action.id === 'details') navigate(`/sellers/${sellerId}`);
                  pop.close();
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  background: hovered === action.id ? (action.danger ? '#FEF2F2' : '#F9FAFB') : 'none',
                  cursor: 'pointer',
                  fontFamily: F.inter,
                  fontSize: '13px',
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
   DATA TABLE
═══════════════════════════════════════════════════════════════════════════ */

function DataTable({ sellers }: { sellers: SellerRow[] }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflowX: 'auto',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1400px',
      }}>
        <thead>
          <tr style={{
            background: '#FAFBFC',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <th style={headerCellStyle}>#</th>
            <th style={headerCellStyle}>Продавец</th>
            <th style={{ ...headerCellStyle, ...responsivePhone }}>Телефон</th>
            <th style={headerCellStyle}>Карт назн.</th>
            <th style={headerCellStyle}>Продано</th>
            <th style={{ ...headerCellStyle, minWidth: '120px' }}>% продано</th>
            <th style={headerCellStyle}>KPI 1</th>
            <th style={headerCellStyle}>KPI 2</th>
            <th style={headerCellStyle}>KPI 3</th>
            <th style={headerCellStyle}>Заработано</th>
            <th style={headerCellStyle}>Выведено</th>
            <th style={{ ...headerCellStyle, ...responsiveBalance }}>Баланс</th>
            <th style={headerCellStyle}>Статус</th>
            <th style={headerCellStyle}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map(seller => (
            <tr
              key={seller.id}
              onMouseEnter={() => setHoveredRow(seller.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => navigate(`/sellers/${seller.id}`)}
              style={{
                borderBottom: `1px solid ${C.border}`,
                background: hoveredRow === seller.id ? '#FAFBFC' : C.surface,
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
            >
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
                  {seller.id}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {seller.name}
                </span>
              </td>
              <td style={{ ...dataCellStyle, ...responsivePhone }}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {seller.phone}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {seller.assigned}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {seller.sold}
                </span>
              </td>
              <td style={dataCellStyle}>
                <ProgressCell value={seller.percentSold} />
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {seller.kpi1}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {seller.kpi2}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {seller.kpi3}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {seller.earned}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {seller.withdrawn}
                </span>
              </td>
              <td style={{ ...dataCellStyle, ...responsiveBalance }}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text1 }}>
                  {seller.balance}
                </span>
              </td>
              <td style={dataCellStyle}>
                <StatusBadge status={seller.status} />
              </td>
              <td style={dataCellStyle}>
                <ActionDropdown sellerId={seller.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontFamily: F.inter,
  fontSize: '12px',
  fontWeight: 600,
  color: C.text3,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

const dataCellStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const responsivePhone: React.CSSProperties = {};
const responsiveBalance: React.CSSProperties = {};

/* ═══════════════════════════════════════════════════════════════════════════
   ADD SELLER MODAL
═══════════════════════════════════════════════════════════════════════════ */

function AddSellerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wallet, setWallet] = useState('');
  const [cardsCount, setCardsCount] = useState(0);

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  if (!open) return null;

  const handleCreate = () => {
    console.log('Creating seller:', { fullName, phone, wallet, cardsCount });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        width: '500px',
        maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <h2 style={{
            fontFamily: F.dm,
            fontSize: '18px',
            fontWeight: 700,
            color: C.text1,
            margin: 0,
          }}>
            Новый продавец
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: `1px solid ${C.border}`,
              borderRadius: '8px',
              background: C.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Full Name */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                marginBottom: '8px',
              }}>
                ФИО
              </label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Фамилия Имя Отчество"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: `1px solid ${C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                marginBottom: '8px',
              }}>
                Телефон
              </label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+998 __ ___ __ __"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: `1px solid ${C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.mono,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* UCOIN Wallet */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                marginBottom: '8px',
              }}>
                UCOIN кошелёк (опционально)
              </label>
              <input
                value={wallet}
                onChange={e => setWallet(e.target.value)}
                placeholder="Будет создан автоматически"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: `1px solid ${C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Cards Count */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                marginBottom: '8px',
              }}>
                Карт назначить
              </label>
              <input
                type="number"
                min={0}
                value={cardsCount}
                onChange={e => setCardsCount(Math.max(0, parseInt(e.target.value) || 0))}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: `1px solid ${C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.mono,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{
                fontFamily: F.inter,
                fontSize: '12px',
                color: C.text4,
                marginTop: '6px',
                display: 'block',
              }}>
                Можно назначить позже
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '16px 24px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
            onClick={onClose}
            style={{
              height: '40px',
              padding: '0 20px',
              border: `1px solid ${cancelHover ? C.blue : C.border}`,
              borderRadius: '8px',
              background: cancelHover ? C.blueLt : C.surface,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: cancelHover ? C.blue : C.text2,
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setSaveHover(true)}
            onMouseLeave={() => setSaveHover(false)}
            onClick={handleCreate}
            style={{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              borderRadius: '8px',
              background: saveHover ? C.blueHover : C.blue,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function SellersManagementPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addBtnHover, setAddBtnHover] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="org"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Продавцы</span>
          </div>

          {/* Top Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Продавцы
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                Управление продавцами Mysafar OOO
              </p>
            </div>

            <button
              onMouseEnter={() => setAddBtnHover(true)}
              onMouseLeave={() => setAddBtnHover(false)}
              onClick={() => setAddModalOpen(true)}
              style={{
                height: '40px',
                padding: '0 18px',
                border: 'none',
                borderRadius: '8px',
                background: addBtnHover ? C.blueHover : C.blue,
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 500,
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                flexShrink: 0,
                transition: 'all 0.12s',
              }}
            >
              <Plus size={16} strokeWidth={2} />
              Добавить продавца
            </button>
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '300px', flexShrink: 0 }}>
              <Search
                size={16}
                color={searchFocused ? C.blue : C.text4}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  transition: 'color 0.12s',
                }}
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Поиск по имени или телефону..."
                style={{
                  width: '100%',
                  height: '40px',
                  paddingLeft: '38px',
                  paddingRight: '12px',
                  border: `1px solid ${searchFocused ? C.blue : C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: searchFocused ? `0 0 0 3px ${C.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              />
            </div>

            <FilterSelect
              label="Статус: Все"
              options={STATUSES}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            <FilterSelect
              label="Сортировка: По имени"
              options={SORT_OPTIONS}
              value={sortFilter}
              onChange={setSortFilter}
            />

            {/* Clear filters */}
            {(search || statusFilter || sortFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setSortFilter('');
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: C.text3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'color 0.12s, background 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget.style.color = C.text1);
                  (e.currentTarget.style.background = '#F3F4F6');
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style.color = C.text3);
                  (e.currentTarget.style.background = 'none');
                }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                Сбросить
              </button>
            )}
          </div>

          {/* Data Table */}
          <DataTable sellers={SELLERS} />

          {/* Pagination */}
          <div style={{
            marginTop: '16px',
            fontFamily: F.inter,
            fontSize: '13px',
            color: C.text3,
            textAlign: 'center',
          }}>
            Показано 1–6 из 6
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {/* Add Seller Modal */}
      <AddSellerModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1280px) {
          .hide-tablet { display: none !important; }
        }
        @media (max-width: 768px) {
          table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        }
      `}</style>
    </div>
  );
}
