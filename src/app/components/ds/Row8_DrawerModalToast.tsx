import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info, Check } from 'lucide-react';
import { F, C } from './tokens';

function Badge({ label, bg, color, border }: any) {
  return (
    <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, padding: '2px 10px', borderRadius: '10px', background: bg, color, border: border || 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

// ─── DETAIL DRAWER ────────────────────────────────────────────────────────

const drawerTabs = ['Сводка', 'Карты', 'Финансы'];

function KeyValueRow({ label, value, mono, last }: any) {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: last ? 'none' : `1px solid #E5E7EB` }}>
      <div style={{ width: '160px', flexShrink: 0, fontFamily: F.inter, fontSize: '13px', color: '#6B7280' }}>{label}</div>
      <div style={{ flex: 1, fontFamily: mono ? F.mono : F.inter, fontSize: '14px', fontWeight: 500, color: '#111827' }}>{value}</div>
    </div>
  );
}

function DetailDrawer() {
  const [activeTab, setActiveTab] = useState('Сводка');

  return (
    <div style={{
      width: '560px',
      background: '#FFFFFF',
      borderRadius: '12px',
      border: `1px solid #E5E7EB`,
      boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '700px',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 0', borderBottom: `1px solid #E5E7EB` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: F.dm, fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
              Карта •••• 1001
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="VISA SUM" bg="transparent" color="#374151" border="1px solid #E5E7EB" />
              <Badge label="Активна" bg="#F0FDF4" color="#15803D" />
              <Badge label="KPI 2 / 3" bg="#EFF6FF" color="#1D4ED8" />
            </div>
          </div>
          <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid #E5E7EB`, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: 'none' }}>
          {drawerTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px',
                border: 'none',
                background: 'transparent',
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 500,
                color: activeTab === tab ? '#2563EB' : '#6B7280',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? `2px solid #2563EB` : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
        {activeTab === 'Сводка' && (
          <div>
            <KeyValueRow label="ID карты" value="CARD-20260401-001" mono />
            <KeyValueRow label="Номер карты" value="•••• •••• •••• 1001" mono />
            <KeyValueRow label="Продавец" value="Абдуллох Рашидов" />
            <KeyValueRow label="Организация" value="Mysafar OOO" />
            <KeyValueRow label="Партия" value="Апрель 2026" />
            <KeyValueRow label="Дата выдачи" value="01.04.2026, 09:00" />
            <KeyValueRow label="Дата продажи" value="01.04.2026, 11:32" />
            <KeyValueRow label="Дата активации" value="01.04.2026, 12:01" />
            <KeyValueRow label="UCOIN кошелёк" value="UCOIN-ABD-20240115" mono />
            <KeyValueRow label="Начислено итого" value="20 000 UZS" last />
          </div>
        )}
        {activeTab === 'Карты' && (
          <div style={{ padding: '24px 0', fontFamily: F.inter, fontSize: '14px', color: '#6B7280' }}>
            Информация о KPI прогрессе отображается здесь...
          </div>
        )}
        {activeTab === 'Финансы' && (
          <div style={{ padding: '24px 0', fontFamily: F.inter, fontSize: '14px', color: '#6B7280' }}>
            История транзакций и начислений...
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 24px', borderTop: `1px solid #E5E7EB`, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button style={{ height: '36px', padding: '0 14px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
          Закрыть
        </button>
        <button style={{ height: '36px', padding: '0 14px', border: 'none', borderRadius: '8px', background: '#2563EB', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer' }}>
          Редактировать
        </button>
      </div>
    </div>
  );
}

// ─── FORM DIALOG ─────────────────────────────────────────────────────────

function FormDialog() {
  return (
    <div style={{
      width: '480px',
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      border: `1px solid #E5E7EB`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827' }}>Добавить продавца</div>
          <div style={{ fontFamily: F.inter, fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Введите данные нового продавца</div>
        </div>
        <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid #E5E7EB`, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={14} color="#6B7280" />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Полное имя', placeholder: 'Абдуллох Рашидов' },
          { label: 'Телефон', placeholder: '+998 90 123 45 67' },
          { label: 'UCOIN кошелёк', placeholder: 'UCOIN-...' },
        ].map(field => (
          <div key={field.label}>
            <label style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>{field.label}</label>
            <input
              placeholder={field.placeholder}
              style={{ width: '100%', height: '40px', border: `1px solid #D1D5DB`, borderRadius: '8px', padding: '0 12px', fontFamily: F.inter, fontSize: '14px', color: '#374151', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}
        <div>
          <label style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Организация</label>
          <div style={{ position: 'relative' }}>
            <select style={{ width: '100%', height: '40px', border: `1px solid #D1D5DB`, borderRadius: '8px', padding: '0 36px 0 12px', fontFamily: F.inter, fontSize: '14px', color: '#374151', background: '#FFFFFF', outline: 'none', appearance: 'none', boxSizing: 'border-box' }}>
              <option>Mysafar OOO</option>
              <option>Alif Group</option>
            </select>
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} fill="none">
              <path d="M3 5l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button style={{ height: '40px', padding: '0 16px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
          Отмена
        </button>
        <button style={{ height: '40px', padding: '0 16px', border: 'none', borderRadius: '8px', background: '#2563EB', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer' }}>
          Добавить продавца
        </button>
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────

function ConfirmDialog() {
  return (
    <div style={{
      width: '400px',
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      border: `1px solid #E5E7EB`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <XCircle size={20} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827' }}>Удалить продавца</div>
            <div style={{ fontFamily: F.inter, fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Это действие нельзя отменить</div>
          </div>
        </div>
        <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid #E5E7EB`, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={14} color="#6B7280" />
        </button>
      </div>

      <p style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '24px' }}>
        Вы уверены, что хотите удалить продавца <strong>Абдуллох Рашидов</strong>? Все связанные карты и история начислений будут сохранены, но доступ продавца будет прекращён.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button style={{ height: '40px', padding: '0 16px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
          Отмена
        </button>
        <button style={{ height: '40px', padding: '0 16px', border: 'none', borderRadius: '8px', background: '#EF4444', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer' }}>
          Удалить
        </button>
      </div>
    </div>
  );
}

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────────────────

const toasts = [
  { type: 'success', icon: CheckCircle, borderColor: '#10B981', iconColor: '#10B981', title: 'KPI начислен', message: 'Абдуллох Рашидов получил 15 000 UZS за выполнение KPI 2' },
  { type: 'error', icon: XCircle, borderColor: '#EF4444', iconColor: '#EF4444', title: 'Ошибка импорта', message: 'Файл не соответствует формату. Проверьте шаблон .xlsx' },
  { type: 'warning', icon: AlertTriangle, borderColor: '#D97706', iconColor: '#D97706', title: 'Срок KPI истекает', message: '89 карт не завершат KPI до 30.04.2026' },
  { type: 'info', icon: Info, borderColor: '#2563EB', iconColor: '#2563EB', title: 'Новая партия создана', message: 'Партия «Апрель 2026» успешно создана. 500 карт добавлено.' },
];

function ToastItem({ toast: t }: { toast: typeof toasts[0] }) {
  const Icon = t.icon;
  return (
    <div style={{
      width: '360px',
      background: '#FFFFFF',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      padding: '16px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      borderLeft: `3px solid ${t.borderColor}`,
    }}>
      <Icon size={20} color={t.iconColor} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{t.title}</div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>{t.message}</div>
      </div>
      <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
        <X size={16} color="#9CA3AF" />
      </button>
    </div>
  );
}

export function Row8DrawerModalToast() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Drawer + Modals */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>
          Detail Drawer + Modal Dialogs
        </div>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Detail Drawer (560px) — Карта с вкладками
            </div>
            <DetailDrawer />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Form Dialog — Добавить продавца
              </div>
              <FormDialog />
            </div>
            <div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Confirm Dialog — Деструктивное действие
              </div>
              <ConfirmDialog />
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>
          Toast Notifications — 4 variants
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {toasts.map((t, i) => (
            <ToastItem key={i} toast={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
