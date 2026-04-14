import React, { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Download, Search, Check, X,
  ShoppingBag, CheckCircle2,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';

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

function StatPill({ label, value, variant = 'neutral' }: {
  label: string;
  value: string | number;
  variant?: 'neutral' | 'success';
}) {
  const colors = {
    neutral: { bg: '#F3F4F6', color: C.text2, border: C.border },
    success: { bg: C.successBg, color: '#15803D', border: '#BBF7D0' },
  };
  const cfg = colors[variant];

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '6px 14px', borderRadius: '10px',
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{label}:</span>
      <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: cfg.color }}>{value}</span>
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

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: CardStatus }) {
  const configs: Record<CardStatus, { bg: string; color: string; dot: string }> = {
    'Активна':    { bg: C.successBg, color: '#15803D', dot: C.success },
    'Зарег.':     { bg: C.infoBg,    color: '#0E7490', dot: C.info },
    'У продавца': { bg: C.warningBg, color: '#B45309', dot: C.warning },
    'На складе':  { bg: '#F3F4F6',   color: '#374151', dot: '#9CA3AF' },
    'Продана':    { bg: C.infoBg,    color: '#0E7490', dot: C.info },
  };
  const cfg = configs[status];

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

function TypeBadge({ type }: { type: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '8px',
      background: 'transparent', border: `1px solid ${C.border}`,
      color: C.text2, whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {type}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CHECK CELL
═══════════════════════════════════════════════════════════════════════════ */

function KPICheckCell({ value }: { value: boolean | number | null }) {
  if (value === null) {
    return <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text4 }}>—</span>;
  }
  if (value === true) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{
          width: '16px', height: '16px', borderRadius: '4px', background: C.success,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={10} color="#FFFFFF" strokeWidth={3} />
        </div>
      </div>
    );
  }
  const pct = value as number;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: '#E5E7EB', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: C.blue, borderRadius: '3px' }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.text3, flexShrink: 0 }}>{pct}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA TABLE
═══════════════════════════════════════════════════════════════════════════ */

function DataTable({ cards, onRowClick, onRecordSale }: {
  cards: CardRow[];
  onRowClick: (id: number) => void;
  onRecordSale: (card: CardRow) => void;
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', overflowX: 'auto',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
        <thead>
          <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
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
                borderBottom: `1px solid ${C.border}`,
                background: hoveredRow === card.id ? '#FAFBFC' : C.surface,
                cursor: 'pointer', transition: 'background 0.12s',
              }}
            >
              <td style={dCell}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>
                  ...{card.cardNumber.slice(-4)}
                </span>
              </td>
              <td style={dCell}><TypeBadge type={card.type} /></td>
              <td style={dCell}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{card.seller}</span>
              </td>
              <td style={dCell}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{card.client}</span>
              </td>
              <td style={dCell}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text3 }}>{card.phone}</span>
              </td>
              <td style={dCell}><StatusBadge status={card.status} /></td>
              <td style={dCell}><KPICheckCell value={card.kpi1} /></td>
              <td style={dCell}><KPICheckCell value={card.kpi2} /></td>
              <td style={dCell}><KPICheckCell value={card.kpi3} /></td>
              <td style={dCell}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{card.topup}</span>
              </td>
              <td style={dCell}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{card.spent}</span>
              </td>
              <td style={{ ...dCell, textAlign: 'right' }}>
                {card.status === 'У продавца' ? (
                  <RecordSaleBtn onClick={e => { e.stopPropagation(); onRecordSale(card); }} />
                ) : (
                  <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const hCell: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left',
  fontFamily: F.inter, fontSize: '12px', fontWeight: 600,
  color: C.text3, textTransform: 'uppercase',
  letterSpacing: '0.04em', whiteSpace: 'nowrap',
};

function RecordSaleBtn({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      aria-label="Зафиксировать продажу"
      style={{
        height: '30px', padding: '0 12px',
        border: `1px solid ${hov ? C.success : '#BBF7D0'}`,
        borderRadius: '7px',
        background: hov ? C.success : C.successBg,
        fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
        color: hov ? '#FFFFFF' : '#15803D',
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      <ShoppingBag size={12} strokeWidth={1.75} />
      Зафиксировать
    </button>
  );
}

const dCell: React.CSSProperties = {
  padding: '14px 16px', textAlign: 'left', whiteSpace: 'nowrap',
};

/* ═══════════════════════════════════════════════════════════════════════════
   RECORD SALE MODAL
═══════════════════════════════════════════════════════════════════════════ */

function OutlineBadge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '2px 8px', borderRadius: '8px',
      border: `1px solid ${C.border}`, background: C.surface,
      color: C.text2, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function RecordSaleModal({ open, card, onClose, onConfirm }: {
  open: boolean;
  card: CardRow | null;
  onClose: () => void;
  onConfirm: (phone: string) => void;
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

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <ShoppingBag size={22} color={C.success} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '17px', fontWeight: 700, color: C.text1,
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
              background: closeHov ? '#F3F4F6' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* Card info strip */}
          <div style={{
            background: C.blueLt,
            borderRadius: '8px', padding: '12px',
            display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: C.text1,
            }}>
              Карта ...{card.cardNumber.slice(-4)}
            </span>
            <OutlineBadge>{card.type}</OutlineBadge>
            <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              Продавец: <span style={{ color: C.text1, fontWeight: 500 }}>{card.seller}</span>
            </span>
          </div>

          {/* Phone */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Телефон клиента<span style={{ color: C.error, marginLeft: '3px' }}>*</span>
            </label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
              placeholder="+998 __ ___ __ __"
              style={{
                width: '100%', height: '40px', padding: '0 12px',
                border: `1px solid ${phoneFocus ? C.blue : C.inputBorder}`,
                borderRadius: '8px', background: C.surface,
                fontFamily: F.mono, fontSize: '14px', color: C.text1,
                outline: 'none', boxSizing: 'border-box',
                boxShadow: phoneFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
            <div style={{
              fontFamily: F.inter, fontSize: '11px', color: C.text4,
              marginTop: '6px',
            }}>
              Номер для привязки и уведомлений
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
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
                border: `1px solid ${nameFocus ? C.blue : C.inputBorder}`,
                borderRadius: '8px', background: C.surface,
                fontFamily: F.inter, fontSize: '14px', color: C.text1,
                outline: 'none', boxSizing: 'border-box',
                boxShadow: nameFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
            <div style={{
              fontFamily: F.inter, fontSize: '11px', color: C.text4,
              marginTop: '6px',
            }}>
              Опционально — будет отображаться в отчётах
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: C.border, margin: '2px 0' }} />

          {/* Outcome list */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: C.text4,
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
                  fontFamily: F.inter, fontSize: '12px', color: C.text2, lineHeight: 1.5,
                }}>
                  <span style={{ color: C.text4, flexShrink: 0 }}>•</span>
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
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: cancelHov ? '#F9FAFB' : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text1, cursor: 'pointer',
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
              background: !canConfirm ? '#93C5FD' : confirmHov ? C.blueHover : C.blue,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.85,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: canConfirm && confirmHov ? '0 2px 8px rgba(37,99,235,0.28)' : canConfirm ? '0 1px 3px rgba(37,99,235,0.16)' : 'none',
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

function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', bottom: '24px', right: '24px',
        maxWidth: '420px',
        background: C.surface, border: `1px solid #BBF7D0`,
        borderLeft: `3px solid ${C.success}`,
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
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
        background: C.successBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        <CheckCircle2 size={14} color={C.success} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 600,
          color: C.text1, marginBottom: '2px',
        }}>
          Продажа зафиксирована
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: C.text3, lineHeight: 1.4,
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
        <X size={13} color={C.text4} strokeWidth={1.75} />
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
  const [darkMode, setDarkMode] = useState(false);

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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Карты</span>
          </div>

          {/* Top Bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Карты
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
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
                  background: bulkHov ? C.blueHover : C.blue,
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                  color: '#FFFFFF',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
                  boxShadow: bulkHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
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
                  border: `1px solid ${exportHover ? C.blue : C.border}`,
                  borderRadius: '8px',
                  background: exportHover ? C.blueLt : C.surface,
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                  color: exportHover ? C.blue : C.text2,
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
            <StatPill label="Всего" value="500" />
            <StatPill label="На складе" value="140" />
            <StatPill label="У продавцов" value="130" />
            <StatPill label="Продано" value="230" variant="success" />
            <StatPill label="KPI 3 ✅" value="45" />
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            alignItems: 'center', marginBottom: '24px',
          }}>
            <div style={{ position: 'relative', width: '340px', flexShrink: 0 }}>
              <Search
                size={16}
                color={searchFocused ? C.blue : C.text4}
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
            <FilterSelect label="Статус: Все" options={STATUSES} value={statusFilter} onChange={setStatusFilter} />
            <FilterSelect label="KPI: Все" options={KPI_OPTIONS} value={kpiFilter} onChange={setKpiFilter} />

            {(search || sellerFilter || statusFilter || kpiFilter) && (
              <button
                onClick={() => { setSearch(''); setSellerFilter(''); setStatusFilter(''); setKpiFilter(''); }}
                style={{
                  border: 'none', background: 'none',
                  fontFamily: F.inter, fontSize: '13px', color: C.text3,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 8px', borderRadius: '6px',
                  transition: 'color 0.12s, background 0.12s',
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
          <DataTable cards={CARDS} onRowClick={handleRowClick} onRecordSale={setSaleCard} />

          {/* Pagination */}
          <div style={{
            marginTop: '16px', fontFamily: F.inter, fontSize: '13px',
            color: C.text3, textAlign: 'center',
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
      />

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
