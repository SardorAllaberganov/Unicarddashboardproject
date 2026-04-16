import React, { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Download, Search, Check, X,
  ShoppingBag, CheckCircle2,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

type CardStatus = 'Активна' | 'Зарег.' | 'У продавца' | 'На складе' | 'Продана';

interface CardRow {
  id: number;
  cardNumber: string;
  type: string;
  seller: string;
  client: string;
  phone: string;
  status: CardStatus;
  kpi1: boolean | null;
  kpi2: boolean | null;
  kpi3: number | boolean | null;
  topup: string;
  spent: string;
}

const CARDS: CardRow[] = [
  { id: 1,  cardNumber: '8600 1234 5678 1001', type: 'VISA SUM', seller: 'Абдуллох',  client: 'Алишер Н.',  phone: '+998 90 111 22 33', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: true,  topup: '800 000',   spent: '520 000' },
  { id: 2,  cardNumber: '8600 1234 5678 1002', type: 'VISA SUM', seller: 'Абдуллох',  client: 'Дилшод К.',  phone: '+998 91 222 33 44', status: 'Зарег.',     kpi1: true,  kpi2: true,  kpi3: 64,    topup: '500 000',   spent: '320 000' },
  { id: 3,  cardNumber: '8600 1234 5678 1003', type: 'VISA SUM', seller: 'Абдуллох',  client: '—',          phone: '—',                 status: 'У продавца', kpi1: null,  kpi2: null,  kpi3: null,  topup: '—',         spent: '—' },
  { id: 4,  cardNumber: '8600 1234 5678 1004', type: 'VISA USD', seller: 'Санжар',     client: 'Камол Т.',   phone: '+998 93 333 44 55', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: true,  topup: '1 200 000', spent: '680 000' },
  { id: 5,  cardNumber: '8600 1234 5678 1005', type: 'VISA SUM', seller: 'Санжар',     client: 'Шахзод Р.',  phone: '+998 94 444 55 66', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: 82,    topup: '700 000',   spent: '410 000' },
  { id: 6,  cardNumber: '8600 1234 5678 1006', type: 'VISA SUM', seller: 'Ислом',      client: 'Фарход М.',  phone: '+998 95 555 66 77', status: 'Зарег.',     kpi1: true,  kpi2: null,  kpi3: null,  topup: '50 000',    spent: '—' },
  { id: 7,  cardNumber: '8600 1234 5678 1007', type: 'VISA SUM', seller: 'Нилуфар',    client: 'Дилноза А.', phone: '+998 90 666 77 88', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: true,  topup: '600 000',   spent: '545 000' },
  { id: 8,  cardNumber: '8600 1234 5678 1008', type: 'VISA SUM', seller: '—',          client: '—',          phone: '—',                 status: 'На складе',  kpi1: null,  kpi2: null,  kpi3: null,  topup: '—',         spent: '—' },
  { id: 9,  cardNumber: '8600 1234 5678 1009', type: 'VISA USD', seller: 'Дарья',      client: 'Ислом С.',   phone: '+998 91 777 88 99', status: 'Продана',    kpi1: true,  kpi2: null,  kpi3: null,  topup: '50 000',    spent: '—' },
  { id: 10, cardNumber: '8600 1234 5678 1010', type: 'VISA SUM', seller: 'Камола',     client: 'Нодир Х.',   phone: '+998 93 888 99 00', status: 'Зарег.',     kpi1: true,  kpi2: true,  kpi3: 35,    topup: '200 000',   spent: '80 000' },
];

const SELLERS_LIST = ['Санжар', 'Абдуллох', 'Ислом', 'Нилуфар', 'Дарья', 'Камола'];
const STATUSES = ['На складе', 'У продавца', 'Продана', 'Зарегистрирована', 'Активна'];
const KPI_OPTIONS = ['Без KPI', 'KPI 1 ✅', 'KPI 2 ✅', 'KPI 3 ✅'];

/* ═══════════════════════════════════════════════════════════════════════════
   STAT PILL
═══════════════════════════════════════════════════════════════════════════ */

function StatPill({ label, value, variant = 'neutral', t, dark }: {
  label: string;
  value: string | number;
  variant?: 'neutral' | 'success';
  t: T;
  dark: boolean;
}) {
  const colors = {
    neutral: dark
      ? { bg: 'transparent', color: D.text2, border: D.border }
      : { bg: '#F3F4F6',     color: C.text2, border: C.border },
    success: dark
      ? { bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'transparent' }
      : { bg: C.successBg,             color: '#15803D', border: '#BBF7D0' },
  };
  const cfg = colors[variant];

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '6px 14px', borderRadius: '10px',
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>{label}:</span>
      <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: cfg.color }}>{value}</span>
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
   STATUS BADGE
═══════════════════════════════════════════════════════════════════════════ */

const STATUS_BADGE_LIGHT: Record<CardStatus, { bg: string; color: string; dot: string }> = {
  'Активна':    { bg: C.successBg, color: '#15803D', dot: C.success },
  'Зарег.':     { bg: C.infoBg,    color: '#0E7490', dot: C.info },
  'У продавца': { bg: C.warningBg, color: '#B45309', dot: C.warning },
  'На складе':  { bg: '#F3F4F6',   color: '#374151', dot: '#9CA3AF' },
  'Продана':    { bg: C.infoBg,    color: '#0E7490', dot: C.info },
};

const STATUS_BADGE_DARK: Record<CardStatus, { bg: string; color: string; dot: string }> = {
  'Активна':    { bg: 'rgba(52,211,153,0.12)',  color: '#34D399', dot: '#34D399' },
  'Зарег.':     { bg: 'rgba(34,211,238,0.12)',  color: '#22D3EE', dot: '#22D3EE' },
  'У продавца': { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24', dot: '#FBBF24' },
  'На складе':  { bg: D.tableAlt,               color: D.text2,   dot: D.text4 },
  'Продана':    { bg: 'rgba(34,211,238,0.12)',  color: '#22D3EE', dot: '#22D3EE' },
};

function StatusBadge({ status, dark }: { status: CardStatus; dark: boolean }) {
  const cfg = (dark ? STATUS_BADGE_DARK : STATUS_BADGE_LIGHT)[status];

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPE BADGE
═══════════════════════════════════════════════════════════════════════════ */

function TypeBadge({ type, t }: { type: string; t: T }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '8px',
      background: 'transparent', border: `1px solid ${t.border}`,
      color: t.text2, whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {type}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CHECK CELL
═══════════════════════════════════════════════════════════════════════════ */

function KPICheckCell({ value, t, dark }: { value: boolean | number | null; t: T; dark: boolean }) {
  if (value === null) {
    return <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>—</span>;
  }
  if (value === true) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{
          width: '16px', height: '16px', borderRadius: '4px',
          background: dark ? '#34D399' : C.success,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={10} color="#FFFFFF" strokeWidth={3} />
        </div>
      </div>
    );
  }
  const pct = value as number;
  const trackBg = dark ? D.progressTrack : '#E5E7EB';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: trackBg, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: t.blue, borderRadius: '3px' }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '11px', color: t.text3, flexShrink: 0 }}>{pct}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA TABLE
═══════════════════════════════════════════════════════════════════════════ */

function DataTable({ cards, onRowClick, onRecordSale, t, dark }: {
  cards: CardRow[];
  onRowClick: (id: number) => void;
  onRecordSale: (card: CardRow) => void;
  t: T;
  dark: boolean;
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const hCell: React.CSSProperties = {
    padding: '12px 16px', textAlign: 'left',
    fontFamily: F.inter, fontSize: '12px', fontWeight: 600,
    color: t.text3, textTransform: 'uppercase',
    letterSpacing: '0.04em', whiteSpace: 'nowrap',
  };

  const dCell: React.CSSProperties = {
    padding: '14px 16px', textAlign: 'left', whiteSpace: 'nowrap',
  };

  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: '12px', overflowX: 'auto',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
        <thead>
          <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
            <th style={hCell}>Карта</th>
            <th style={hCell}>Тип</th>
            <th style={hCell}>Продавец</th>
            <th style={hCell}>Клиент</th>
            <th style={hCell}>Телефон</th>
            <th style={hCell}>Статус</th>
            <th style={hCell}>KPI 1</th>
            <th style={hCell}>KPI 2</th>
            <th style={hCell}>KPI 3</th>
            <th style={hCell}>Пополнено</th>
            <th style={hCell}>Расход</th>
            <th style={{ ...hCell, textAlign: 'right' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr
              key={card.id}
              onMouseEnter={() => setHoveredRow(card.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => onRowClick(card.id)}
              style={{
                borderBottom: `1px solid ${t.border}`,
                background: hoveredRow === card.id ? t.tableHover : t.surface,
                cursor: 'pointer', transition: 'background 0.12s',
              }}
            >
              <td style={dCell}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text1 }}>
                  ...{card.cardNumber.slice(-4)}
                </span>
              </td>
              <td style={dCell}><TypeBadge type={card.type} t={t} /></td>
              <td style={dCell}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{card.seller}</span>
              </td>
              <td style={dCell}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{card.client}</span>
              </td>
              <td style={dCell}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text3 }}>{card.phone}</span>
              </td>
              <td style={dCell}><StatusBadge status={card.status} dark={dark} /></td>
              <td style={dCell}><KPICheckCell value={card.kpi1} t={t} dark={dark} /></td>
              <td style={dCell}><KPICheckCell value={card.kpi2} t={t} dark={dark} /></td>
              <td style={dCell}><KPICheckCell value={card.kpi3} t={t} dark={dark} /></td>
              <td style={dCell}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{card.topup}</span>
              </td>
              <td style={dCell}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{card.spent}</span>
              </td>
              <td style={{ ...dCell, textAlign: 'right' }}>
                {card.status === 'У продавца' ? (
                  <RecordSaleBtn onClick={e => { e.stopPropagation(); onRecordSale(card); }} t={t} dark={dark} />
                ) : (
                  <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordSaleBtn({ onClick, t, dark }: { onClick: (e: React.MouseEvent) => void; t: T; dark: boolean }) {
  const [hov, setHov] = useState(false);
  const idleBg = dark ? 'rgba(52,211,153,0.12)' : C.successBg;
  const idleBorder = dark ? 'rgba(52,211,153,0.35)' : '#BBF7D0';
  const idleColor = dark ? '#34D399' : '#15803D';
  const hoverBg = dark ? '#10B981' : C.success;
  const hoverBorder = dark ? '#10B981' : C.success;
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      aria-label="Зафиксировать продажу"
      style={{
        height: '30px', padding: '0 12px',
        border: `1px solid ${hov ? hoverBorder : idleBorder}`,
        borderRadius: '7px',
        background: hov ? hoverBg : idleBg,
        fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
        color: hov ? '#FFFFFF' : idleColor,
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      <ShoppingBag size={12} strokeWidth={1.75} />
      Зафиксировать
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RECORD SALE MODAL
═══════════════════════════════════════════════════════════════════════════ */

function OutlineBadge({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '2px 8px', borderRadius: '8px',
      border: `1px solid ${t.border}`, background: t.surface,
      color: t.text2, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function RecordSaleModal({ open, card, onClose, onConfirm, t, dark }: {
  open: boolean;
  card: CardRow | null;
  onClose: () => void;
  onConfirm: (phone: string) => void;
  t: T;
  dark: boolean;
}) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) { setPhone(''); setName(''); return; }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open || !card) return null;

  const canConfirm = phone.trim().length >= 9;

  const closeHovBg = dark ? t.tableAlt : '#F3F4F6';
  const cancelHovBg = dark ? t.tableHover : '#F9FAFB';
  const disabledConfirmBg = dark ? 'rgba(59,130,246,0.35)' : '#93C5FD';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: dark ? 'rgba(0,0,0,0.6)' : 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '16px',
          boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`,
        }}>
          <ShoppingBag size={22} color={t.success} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '17px', fontWeight: 700, color: t.text1,
          }}>
            Фиксация продажи
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? closeHovBg : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={closeHov ? t.text1 : t.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* Card info strip */}
          <div style={{
            background: t.blueLt,
            borderLeft: `3px solid ${t.blue}`,
            borderRadius: '8px', padding: '12px',
            display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: t.text1,
            }}>
              Карта ...{card.cardNumber.slice(-4)}
            </span>
            <OutlineBadge t={t}>{card.type}</OutlineBadge>
            <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Продавец: <span style={{ color: t.text1, fontWeight: 500 }}>{card.seller}</span>
            </span>
          </div>

          {/* Phone */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              Телефон клиента<span style={{ color: t.error, marginLeft: '3px' }}>*</span>
            </label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
              placeholder="+998 __ ___ __ __"
              style={{
                width: '100%', height: '40px', padding: '0 12px',
                border: `1px solid ${phoneFocus ? t.blue : t.inputBorder}`,
                borderRadius: '8px', background: t.surface,
                fontFamily: F.mono, fontSize: '14px', color: t.text1,
                outline: 'none', boxSizing: 'border-box',
                boxShadow: phoneFocus ? `0 0 0 3px ${t.blueTint}` : 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
            <div style={{
              fontFamily: F.inter, fontSize: '11px', color: t.text4,
              marginTop: '6px',
            }}>
              Номер для привязки и уведомлений
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              ФИО клиента
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              placeholder="Фамилия Имя"
              style={{
                width: '100%', height: '40px', padding: '0 12px',
                border: `1px solid ${nameFocus ? t.blue : t.inputBorder}`,
                borderRadius: '8px', background: t.surface,
                fontFamily: F.inter, fontSize: '14px', color: t.text1,
                outline: 'none', boxSizing: 'border-box',
                boxShadow: nameFocus ? `0 0 0 3px ${t.blueTint}` : 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
            <div style={{
              fontFamily: F.inter, fontSize: '11px', color: t.text4,
              marginTop: '6px',
            }}>
              Опционально — будет отображаться в отчётах
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: t.border, margin: '2px 0' }} />

          {/* Outcome list */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: t.text4,
              marginBottom: '8px',
            }}>
              После фиксации:
            </div>
            <ul style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              {[
                'Карта перейдёт в статус «Продана»',
                'Начнётся отслеживание KPI (срок: 30 дней)',
                'KPI 1 (Регистрация) будет отслеживаться автоматически',
              ].map((txt, i) => (
                <li key={i} style={{
                  display: 'flex', gap: '8px',
                  fontFamily: F.inter, fontSize: '12px', color: t.text2, lineHeight: 1.5,
                }}>
                  <span style={{ color: t.text4, flexShrink: 0 }}>•</span>
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${t.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${t.border}`, borderRadius: '8px',
              background: cancelHov ? cancelHovBg : 'transparent',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={() => { if (canConfirm) onConfirm(phone); }}
            disabled={!canConfirm}
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: !canConfirm ? disabledConfirmBg : confirmHov ? t.blueHover : t.blue,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.5,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: dark
                ? 'none'
                : canConfirm && confirmHov ? '0 2px 8px rgba(37,99,235,0.28)' : canConfirm ? '0 1px 3px rgba(37,99,235,0.16)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Зафиксировать продажу
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUCCESS TOAST
═══════════════════════════════════════════════════════════════════════════ */

function SuccessToast({ message, onClose, t, dark }: { message: string; onClose: () => void; t: T; dark: boolean }) {
  useEffect(() => {
    const tm = setTimeout(onClose, 4000);
    return () => clearTimeout(tm);
  }, [onClose]);

  const border = dark ? 'rgba(52,211,153,0.35)' : '#BBF7D0';
  const iconBg = dark ? 'rgba(52,211,153,0.15)' : C.successBg;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', bottom: '24px', right: '24px',
        maxWidth: '420px',
        background: t.surface, border: `1px solid ${border}`,
        borderLeft: `3px solid ${t.success}`,
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.12)',
        zIndex: 200,
        animation: 'toastIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        <CheckCircle2 size={14} color={t.success} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 600,
          color: t.text1, marginBottom: '2px',
        }}>
          Продажа зафиксирована
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: t.text3, lineHeight: 1.4,
        }}>
          {message}
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label="Закрыть"
        style={{
          width: '22px', height: '22px', border: 'none',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '5px', flexShrink: 0,
        }}
      >
        <X size={13} color={t.text4} strokeWidth={1.75} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrgCardsPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const [search, setSearch] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kpiFilter, setKpiFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [exportHover, setExportHover] = useState(false);
  const [bulkHov, setBulkHov] = useState(false);
  const [saleCard, setSaleCard] = useState<CardRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleRowClick = (id: number) => {
    navigate(`/card-detail/${id}?from=org`);
  };

  const handleConfirmSale = (phone: string) => {
    if (!saleCard) return;
    const last4 = saleCard.cardNumber.slice(-4);
    setToast(`Карта •••• ${last4} → ${phone}`);
    setSaleCard(null);
  };

  const resetHovBg = dark ? t.tableHover : '#F3F4F6';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg }}>
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
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Карты</span>
          </div>

          {/* Top Bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Карты
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Карты организации Mysafar OOO
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                onMouseEnter={() => setBulkHov(true)}
                onMouseLeave={() => setBulkHov(false)}
                onClick={() => navigate('/card-assignment/bulk')}
                style={{
                  height: '40px', padding: '0 18px',
                  border: 'none',
                  borderRadius: '8px',
                  background: bulkHov ? t.blueHover : t.blue,
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                  color: '#FFFFFF',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
                  boxShadow: dark
                    ? 'none'
                    : bulkHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
                  transition: 'all 0.15s',
                }}
              >
                Массовое назначение
              </button>
              <button
                onMouseEnter={() => setExportHover(true)}
                onMouseLeave={() => setExportHover(false)}
                style={{
                  height: '40px', padding: '0 18px',
                  border: `1px solid ${exportHover ? t.blue : t.border}`,
                  borderRadius: '8px',
                  background: exportHover ? t.blueLt : t.surface,
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                  color: exportHover ? t.blue : t.text2,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
                  transition: 'all 0.12s',
                }}
              >
                <Download size={16} strokeWidth={1.75} />
                Экспорт
              </button>
            </div>
          </div>

          {/* Stat Pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <StatPill label="Всего" value="500" t={t} dark={dark} />
            <StatPill label="На складе" value="140" t={t} dark={dark} />
            <StatPill label="У продавцов" value="130" t={t} dark={dark} />
            <StatPill label="Продано" value="230" variant="success" t={t} dark={dark} />
            <StatPill label="KPI 3 ✅" value="45" t={t} dark={dark} />
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            alignItems: 'center', marginBottom: '24px',
          }}>
            <div style={{ position: 'relative', width: '340px', flexShrink: 0 }}>
              <Search
                size={16}
                color={searchFocused ? t.blue : t.text4}
                style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                  transition: 'color 0.12s',
                }}
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Поиск по номеру карты, клиенту, продавцу..."
                style={{
                  width: '100%', height: '40px',
                  paddingLeft: '38px', paddingRight: '12px',
                  border: `1px solid ${searchFocused ? t.blue : t.inputBorder}`,
                  borderRadius: '8px', background: t.surface,
                  fontFamily: F.inter, fontSize: '14px', color: t.text1,
                  outline: 'none', boxSizing: 'border-box',
                  boxShadow: searchFocused ? `0 0 0 3px ${t.focusRing}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              />
            </div>

            <FilterSelect label="Продавец: Все" options={SELLERS_LIST} value={sellerFilter} onChange={setSellerFilter} t={t} />
            <FilterSelect label="Статус: Все" options={STATUSES} value={statusFilter} onChange={setStatusFilter} t={t} />
            <FilterSelect label="KPI: Все" options={KPI_OPTIONS} value={kpiFilter} onChange={setKpiFilter} t={t} />

            {(search || sellerFilter || statusFilter || kpiFilter) && (
              <button
                onClick={() => { setSearch(''); setSellerFilter(''); setStatusFilter(''); setKpiFilter(''); }}
                style={{
                  border: 'none', background: 'none',
                  fontFamily: F.inter, fontSize: '13px', color: t.text3,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 8px', borderRadius: '6px',
                  transition: 'color 0.12s, background 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = t.text1; e.currentTarget.style.background = resetHovBg; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.text3; e.currentTarget.style.background = 'none'; }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                Сбросить
              </button>
            )}
          </div>

          {/* Data Table */}
          <DataTable cards={CARDS} onRowClick={handleRowClick} onRecordSale={setSaleCard} t={t} dark={dark} />

          {/* Pagination */}
          <div style={{
            marginTop: '16px', fontFamily: F.inter, fontSize: '13px',
            color: t.text3, textAlign: 'center',
          }}>
            Показано 1–10 из 500
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <RecordSaleModal
        open={!!saleCard}
        card={saleCard}
        onClose={() => setSaleCard(null)}
        onConfirm={handleConfirmSale}
        t={t}
        dark={dark}
      />

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} t={t} dark={dark} />}
    </div>
  );
}
