import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Search, Plus, MoreVertical, X,
  Pencil, CreditCard,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';
import { usePopoverPosition } from '../components/usePopoverPosition';

type T = ReturnType<typeof theme>;

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

function FilterSelect({ label, options, value, onChange, t }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  t: T;
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
          border: `1px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: '8px',
          background: t.surface,
          fontFamily: F.inter,
          fontSize: '14px',
          color: t.text2,
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: '160px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={t.text3} style={{
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

const STATUS_STYLE_LIGHT: Record<SellerRow['status'], { bg: string; color: string; dot: string }> = {
  'Активен':   { bg: C.successBg, color: '#15803D', dot: C.success },
  'Неактивен': { bg: '#F3F4F6',   color: '#374151', dot: '#9CA3AF' },
};

const STATUS_STYLE_DARK: Record<SellerRow['status'], { bg: string; color: string; dot: string }> = {
  'Активен':   { bg: 'rgba(52,211,153,0.12)', color: '#34D399', dot: '#34D399' },
  'Неактивен': { bg: D.tableAlt,              color: D.text2,   dot: D.text4 },
};

function StatusBadge({ status, dark }: { status: SellerRow['status']; dark: boolean }) {
  const cfg = (dark ? STATUS_STYLE_DARK : STATUS_STYLE_LIGHT)[status];

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

function ProgressCell({ value, t, dark }: { value: number; t: T; dark: boolean }) {
  const barColor = value >= 60 ? t.success : value >= 40 ? t.warning : t.error;
  const trackBg = dark ? t.tableAlt : '#E5E7EB';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
      <div style={{
        flex: 1,
        height: '6px',
        borderRadius: '3px',
        background: trackBg,
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
        color: t.text3,
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

function ActionDropdown({ sellerId, t, dark }: { sellerId: number; t: T; dark: boolean }) {
  const pop = usePopoverPosition();
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  const actions = [
    { id: 'details', label: 'Подробнее' },
    { id: 'assign-cards', label: 'Назначить карты' },
    { id: 'edit', label: 'Редактировать' },
    { id: 'deactivate', label: 'Деактивировать', danger: true },
  ];

  const dangerHoverBg = dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2';
  const dangerText    = dark ? '#F87171' : '#DC2626';
  const safeHoverBg   = dark ? t.tableHover : '#F9FAFB';

  return (
    <div ref={pop.rootRef} style={{ position: 'relative' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={pop.toggle}
        style={{
          width: '28px',
          height: '28px',
          border: `1px solid ${pop.open ? t.blue : t.border}`,
          borderRadius: '6px',
          background: pop.open ? t.blueLt : t.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.12s',
        }}
      >
        <MoreVertical size={14} color={pop.open ? t.blue : t.text3} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: '10px',
          padding: '6px',
          boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: '200px',
        }}>
          {actions.map((action, idx) => (
            <React.Fragment key={action.id}>
              {idx === actions.length - 1 && <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />}
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
                  background: hovered === action.id ? (action.danger ? dangerHoverBg : safeHoverBg) : 'none',
                  cursor: 'pointer',
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: hovered === action.id && action.danger ? dangerText : t.text2,
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

function DataTable({ sellers, t, dark }: { sellers: SellerRow[]; t: T; dark: boolean }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const navigate = useNavigate();

  const headerCellStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontFamily: F.inter,
    fontSize: '12px',
    fontWeight: 600,
    color: t.text3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  };

  const dataCellStyle: React.CSSProperties = {
    padding: '14px 16px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  };

  const headerBg = dark ? t.tableHeaderBg : '#FAFBFC';
  const rowHoverBg = dark ? t.tableHover : '#FAFBFC';

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
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
            background: headerBg,
            borderBottom: `1px solid ${t.border}`,
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
                borderBottom: `1px solid ${t.border}`,
                background: hoveredRow === seller.id ? rowHoverBg : t.surface,
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
            >
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
                  {seller.id}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {seller.name}
                </span>
              </td>
              <td style={{ ...dataCellStyle, ...responsivePhone }}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {seller.phone}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {seller.assigned}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {seller.sold}
                </span>
              </td>
              <td style={dataCellStyle}>
                <ProgressCell value={seller.percentSold} t={t} dark={dark} />
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {seller.kpi1}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {seller.kpi2}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {seller.kpi3}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {seller.earned}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {seller.withdrawn}
                </span>
              </td>
              <td style={{ ...dataCellStyle, ...responsiveBalance }}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
                  {seller.balance}
                </span>
              </td>
              <td style={dataCellStyle}>
                <StatusBadge status={seller.status} dark={dark} />
              </td>
              <td style={dataCellStyle}>
                <ActionDropdown sellerId={seller.id} t={t} dark={dark} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const responsivePhone: React.CSSProperties = {};
const responsiveBalance: React.CSSProperties = {};

/* ═══════════════════════════════════════════════════════════════════════════
   ADD SELLER MODAL
═══════════════════════════════════════════════════════════════════════════ */

function AddSellerModal({ open, onClose, t, dark }: { open: boolean; onClose: () => void; t: T; dark: boolean }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wallet, setWallet] = useState('');
  const [cardsCount, setCardsCount] = useState(0);

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  if (!open) return null;

  const handleCreate = () => {
    console.log('Creating seller:', { fullName, phone, wallet, cardsCount });
    onClose();
  };

  const overlay = dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)';
  const modalShadow = dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.15)';
  const closeHovBg = dark ? t.tableHover : '#F3F4F6';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        width: '500px',
        maxWidth: '90vw',
        boxShadow: modalShadow,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: `1px solid ${t.border}`,
        }}>
          <h2 style={{
            fontFamily: F.dm,
            fontSize: '18px',
            fontWeight: 700,
            color: t.text1,
            margin: 0,
          }}>
            Новый продавец
          </h2>
          <button
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: `1px solid ${t.border}`,
              borderRadius: '8px',
              background: closeHover ? closeHovBg : t.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={closeHover ? t.text1 : t.text3} strokeWidth={1.75} />
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
                color: t.text2,
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
                  border: `1px solid ${t.inputBorder}`,
                  borderRadius: '8px',
                  background: t.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: t.text1,
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
                color: t.text2,
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
                  border: `1px solid ${t.inputBorder}`,
                  borderRadius: '8px',
                  background: t.surface,
                  fontFamily: F.mono,
                  fontSize: '14px',
                  color: t.text1,
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
                color: t.text2,
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
                  border: `1px solid ${t.inputBorder}`,
                  borderRadius: '8px',
                  background: t.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: t.text1,
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
                color: t.text2,
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
                  border: `1px solid ${t.inputBorder}`,
                  borderRadius: '8px',
                  background: t.surface,
                  fontFamily: F.mono,
                  fontSize: '14px',
                  color: t.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{
                fontFamily: F.inter,
                fontSize: '12px',
                color: t.text4,
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
          borderTop: `1px solid ${t.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
            onClick={onClose}
            style={{
              height: '40px',
              padding: '0 20px',
              border: `1px solid ${cancelHover ? t.blue : t.border}`,
              borderRadius: '8px',
              background: cancelHover ? (dark ? t.tableHover : t.blueLt) : 'transparent',
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: cancelHover ? t.blue : t.text2,
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
              background: saveHover ? t.blueHover : t.blue,
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
   MOBILE — Sellers list (Y-12 Org Tab 2)
═══════════════════════════════════════════════════════════════════════════ */

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function earnedShort(amount: string): string {
  // "555 000" -> "555K", "1 250 000" -> "1.25M"
  const digits = parseInt(amount.replace(/\s/g, ''), 10);
  if (!isFinite(digits)) return amount;
  if (digits >= 1_000_000) return (digits / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (digits >= 1_000) return Math.round(digits / 1000) + 'K';
  return String(digits);
}

/* ─── Mobile seller row with swipe-left reveal ───────────────────────── */

function MobileSellerRow({
  seller, isLast, t, dark, navigate,
  swipedId, setSwipedId,
}: {
  seller: SellerRow;
  isLast: boolean;
  t: T;
  dark: boolean;
  navigate: (p: string) => void;
  swipedId: number | null;
  setSwipedId: (id: number | null) => void;
}) {
  const startX = useRef<number | null>(null);
  const movedX = useRef(0);
  const actionsW = 180;
  const revealed = swipedId === seller.id;

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    movedX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    movedX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd = () => {
    if (movedX.current < -40) setSwipedId(seller.id);
    else if (movedX.current > 40) setSwipedId(null);
    startX.current = null;
    movedX.current = 0;
  };

  const onTap = () => {
    if (revealed) { setSwipedId(null); return; }
    navigate(`/sellers/${seller.id}`);
  };

  const trackBg = dark ? D.progressTrack : '#EFF6FF';

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderBottom: isLast ? 'none' : `1px solid ${t.border}` }}>
      {/* Swipe-revealed actions */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'stretch',
        width: actionsW,
      }}>
        <button
          onClick={() => { setSwipedId(null); console.log('Edit', seller.id); }}
          style={{
            flex: 1, border: 'none', background: dark ? '#3A3F50' : '#E5E7EB',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, cursor: 'pointer',
          }}
        >
          <Pencil size={18} color={t.text1} strokeWidth={1.75} />
          <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 500, color: t.text1 }}>Редакт.</span>
        </button>
        <button
          onClick={() => { setSwipedId(null); navigate('/card-assignment'); }}
          style={{
            flex: 1, border: 'none', background: t.blue,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, cursor: 'pointer',
          }}
        >
          <CreditCard size={18} color="#FFFFFF" strokeWidth={1.75} />
          <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 500, color: '#FFFFFF' }}>Карты</span>
        </button>
      </div>

      {/* Row foreground */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onTap}
        style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px',
          background: t.surface,
          transform: `translateX(${revealed ? -actionsW : 0}px)`,
          transition: 'transform 0.18s ease',
          cursor: 'pointer',
        }}
      >
        {/* Avatar 32 */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: t.blueLt,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontFamily: F.inter, fontSize: 13, fontWeight: 600, color: t.blue }}>
            {initials(seller.name)}
          </span>
        </div>

        {/* Middle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {seller.name}
          </div>
          <div style={{
            fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {seller.assigned} карт · {seller.sold} продано · {earnedShort(seller.earned)} UZS
          </div>
          {/* Mini progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <div style={{
              flex: 1, height: 4, borderRadius: 2, background: trackBg, overflow: 'hidden',
            }}>
              <div style={{
                width: `${seller.percentSold}%`, height: '100%',
                background: t.blue, borderRadius: 2,
              }} />
            </div>
            <span style={{ fontFamily: F.mono, fontSize: 11, color: t.text4, flexShrink: 0 }}>
              {seller.percentSold}%
            </span>
          </div>
        </div>

        <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
}

/* ─── Mobile-only form primitives (scrollIntoView on focus) ───────────── */

function MFormInput({
  label, value, onChange, placeholder, type = 'text', t,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  t: T;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setFocused(true);
    setTimeout(() => {
      wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }, []);
  return (
    <div ref={wrapRef}>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: 13, fontWeight: 500,
        color: t.text2, marginBottom: 8,
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%', height: 48,
          padding: '0 14px',
          border: `1.5px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: 12,
          background: t.surface,
          fontFamily: F.inter, fontSize: 15, color: t.text1,
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.12s',
        }}
      />
    </div>
  );
}

function MFormStepper({ label, value, onChange, t }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  t: T;
}) {
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: 13, fontWeight: 500,
        color: t.text2, marginBottom: 8,
      }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'stretch',
        border: `1.5px solid ${t.inputBorder}`, borderRadius: 12,
        overflow: 'hidden', background: t.surface,
      }}>
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          style={{
            width: 48, border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 20, color: t.text1,
            cursor: 'pointer',
          }}
        >−</button>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F.mono, fontSize: 16, fontWeight: 600, color: t.text1,
          borderLeft: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`,
        }}>
          {value}
        </div>
        <button
          onClick={() => onChange(value + 1)}
          style={{
            width: 48, border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 20, color: t.text1,
            cursor: 'pointer',
          }}
        >+</button>
      </div>
    </div>
  );
}

/* ─── Mobile full-screen Add Seller modal ────────────────────────────── */

function MobileAddSellerModal({
  open, onClose, t, dark,
}: { open: boolean; onClose: () => void; t: T; dark: boolean }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wallet, setWallet] = useState('');
  const [cardsCount, setCardsCount] = useState(0);

  useEffect(() => {
    if (open) {
      setFullName(''); setPhone(''); setWallet(''); setCardsCount(0);
    }
  }, [open]);

  if (!open) return null;

  const canSubmit = fullName.trim().length > 0 && phone.trim().length > 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 70,
      background: t.pageBg,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header Y-02 V4 */}
      <div style={{
        height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <button
          onClick={onClose}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={22} color={t.text1} strokeWidth={2} />
        </button>
        <span style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Новый продавец
        </span>
        <button
          disabled={!canSubmit}
          onClick={() => { console.log('Create seller', { fullName, phone, wallet, cardsCount }); onClose(); }}
          style={{
            height: 40, padding: '0 12px', borderRadius: 10,
            border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 14, fontWeight: 600,
            color: canSubmit ? t.blue : t.textDisabled,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          Создать
        </button>
      </div>

      {/* Scrollable form */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 16px calc(96px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        <MFormInput label="ФИО"          value={fullName}   onChange={setFullName}  placeholder="Фамилия Имя Отчество" t={t} />
        <MFormInput label="Телефон"      value={phone}      onChange={setPhone}     placeholder="+998 __ ___ __ __" type="tel" t={t} />
        <MFormInput label="UCOIN кошелёк" value={wallet}    onChange={setWallet}    placeholder="UCOIN0001234567" t={t} />
        <MFormStepper label="Количество карт" value={cardsCount} onChange={setCardsCount} t={t} />
      </div>

      {/* Sticky footer action */}
      <div style={{
        flexShrink: 0,
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        background: t.surface, borderTop: `1px solid ${t.border}`,
      }}>
        <button
          disabled={!canSubmit}
          onClick={() => { console.log('Create seller', { fullName, phone, wallet, cardsCount }); onClose(); }}
          style={{
            width: '100%', height: 52, borderRadius: 12,
            border: 'none', background: canSubmit ? t.blue : (dark ? '#3A3F50' : '#D1D5DB'),
            fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: '#FFFFFF',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          Создать продавца
        </button>
      </div>
    </div>
  );
}

/* ─── Mobile Sellers main content ─────────────────────────────────────── */

function MobileSellers({
  t, dark, navigate,
}: { t: T; dark: boolean; navigate: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [swipedId, setSwipedId] = useState<number | null>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const onSearchFocus = () => {
    setSearchFocused(true);
    setTimeout(() => {
      searchWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  const filtered = SELLERS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const totalSold = SELLERS.reduce((acc, s) => acc + s.sold, 0);
  const totalEarnedNum = SELLERS.reduce((acc, s) => acc + parseInt(s.earned.replace(/\s/g, ''), 10), 0);
  const totalEarnedShort = totalEarnedNum >= 1_000_000
    ? (totalEarnedNum / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M'
    : Math.round(totalEarnedNum / 1000) + 'K';

  const pills: Array<{ label: string; val: string; variant: 'neutral' | 'success' }> = [
    { label: 'Всего',      val: String(SELLERS.length), variant: 'neutral' },
    { label: 'Активных',   val: String(SELLERS.filter(s => s.status === 'Активен').length), variant: 'success' },
    { label: 'Продано',    val: String(totalSold), variant: 'neutral' },
    { label: 'Заработано', val: totalEarnedShort, variant: 'neutral' },
  ];

  return (
    <>
      {/* Header Y-02 V1 (title + Plus button) */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <span style={{ fontFamily: F.dm, fontSize: 20, fontWeight: 700, color: t.text1 }}>
          Продавцы
        </span>
        <button
          onClick={() => setAddOpen(true)}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: t.blue, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      <div
        onClick={() => swipedId !== null && setSwipedId(null)}
        style={{ padding: '12px 0 96px', boxSizing: 'border-box', width: '100%' }}
      >
        {/* Search */}
        <div ref={searchWrapRef} style={{ padding: '0 16px 14px' }}>
          <div style={{
            height: 44, borderRadius: 12,
            background: dark ? '#2D3148' : '#F3F4F6',
            padding: '0 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            boxSizing: 'border-box',
            border: searchFocused ? `1.5px solid ${t.blue}` : '1.5px solid transparent',
            transition: 'border-color 0.12s',
          }}>
            <Search size={18} color={t.text3} strokeWidth={2} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={onSearchFocus}
              onBlur={() => setSearchFocused(false)}
              placeholder="Поиск продавцов..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: F.inter, fontSize: 15, color: t.text1,
              }}
            />
          </div>
        </div>

        {/* Stat pills */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          padding: '0 16px 4px', scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          {pills.map(p => {
            const cfg = p.variant === 'success'
              ? (dark
                  ? { bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'transparent' }
                  : { bg: C.successBg, color: '#15803D', border: '#BBF7D0' })
              : (dark
                  ? { bg: 'transparent', color: D.text2, border: D.border }
                  : { bg: '#F3F4F6', color: C.text2, border: C.border });
            return (
              <div key={p.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 10,
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                <span style={{ fontFamily: F.inter, fontSize: 12, color: t.text3 }}>{p.label}:</span>
                <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 600, color: cfg.color }}>
                  {p.val}
                </span>
              </div>
            );
          })}
        </div>

        {/* List */}
        <div style={{
          margin: '16px 16px 0',
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
          overflow: 'hidden',
        }}>
          {filtered.length === 0 && (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text2, marginBottom: 4 }}>
                Ничего не найдено
              </div>
              <div style={{ fontFamily: F.inter, fontSize: 14, color: t.text3 }}>
                Попробуйте другой запрос
              </div>
            </div>
          )}
          {filtered.map((seller, i) => (
            <MobileSellerRow
              key={seller.id}
              seller={seller}
              isLast={i === filtered.length - 1}
              t={t}
              dark={dark}
              navigate={navigate}
              swipedId={swipedId}
              setSwipedId={setSwipedId}
            />
          ))}
        </div>

        <div style={{
          fontFamily: F.inter, fontSize: 12, color: t.text4,
          textAlign: 'center', marginTop: 14, padding: '0 16px',
        }}>
          Проведите строку влево для действий
        </div>
      </div>

      <MobileAddSellerModal open={addOpen} onClose={() => setAddOpen(false)} t={t} dark={dark} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function SellersManagementPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const mobile = useIsMobile();
  const t = theme(darkMode);
  const dark = darkMode;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addBtnHover, setAddBtnHover] = useState(false);
  const [clearHover, setClearHover] = useState(false);

  const clearHoverBg = dark ? t.tableHover : '#F3F4F6';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg }}>
      <Sidebar role="org"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        {mobile ? (
          <MobileSellers t={t} dark={dark} navigate={navigate} />
        ) : (
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Продавцы</span>
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
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Продавцы
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
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
                background: addBtnHover ? t.blueHover : t.blue,
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
                color={searchFocused ? t.blue : t.text4}
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
                  border: `1px solid ${searchFocused ? t.blue : t.inputBorder}`,
                  borderRadius: '8px',
                  background: t.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: t.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: searchFocused ? `0 0 0 3px ${t.focusRing}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              />
            </div>

            <FilterSelect
              label="Статус: Все"
              options={STATUSES}
              value={statusFilter}
              onChange={setStatusFilter}
              t={t}
            />

            <FilterSelect
              label="Сортировка: По имени"
              options={SORT_OPTIONS}
              value={sortFilter}
              onChange={setSortFilter}
              t={t}
            />

            {/* Clear filters */}
            {(search || statusFilter || sortFilter) && (
              <button
                onMouseEnter={() => setClearHover(true)}
                onMouseLeave={() => setClearHover(false)}
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setSortFilter('');
                }}
                style={{
                  border: 'none',
                  background: clearHover ? clearHoverBg : 'none',
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: clearHover ? t.text1 : t.text3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'color 0.12s, background 0.12s',
                }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                Сбросить
              </button>
            )}
          </div>

          {/* Data Table */}
          <DataTable sellers={SELLERS} t={t} dark={dark} />

          {/* Pagination */}
          <div style={{
            marginTop: '16px',
            fontFamily: F.inter,
            fontSize: '13px',
            color: t.text3,
            textAlign: 'center',
          }}>
            Показано 1–6 из 6
          </div>

          <div style={{ height: '48px' }} />
        </div>
        )}
      </div>

      {/* Add Seller Modal (desktop) */}
      {!mobile && (
        <AddSellerModal open={addModalOpen} onClose={() => setAddModalOpen(false)} t={t} dark={dark} />
      )}

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
