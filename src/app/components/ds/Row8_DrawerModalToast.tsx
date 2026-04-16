import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info, Check } from 'lucide-react';
import { F, C, theme } from './tokens';
import { useDarkMode } from '../useDarkMode';

type T = ReturnType<typeof theme>;

function Badge({ label, bg, color, border }: any) {
  return (
    <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, padding: '2px 10px', borderRadius: '10px', background: bg, color, border: border || 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

// ─── DETAIL DRAWER ────────────────────────────────────────────────────────

const drawerTabs = ['Сводка', 'Карты', 'Финансы'];

function KeyValueRow({ label, value, mono, last, t }: any) {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: last ? 'none' : `1px solid ${t.border}` }}>
      <div style={{ width: '160px', flexShrink: 0, fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>{label}</div>
      <div style={{ flex: 1, fontFamily: mono ? F.mono : F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>{value}</div>
    </div>
  );
}

function DetailDrawer({ t, dark }: { t: T; dark: boolean }) {
  const [activeTab, setActiveTab] = useState('Сводка');

  const badgeSuccess = dark
    ? { bg: 'rgba(52,211,153,0.12)', color: '#34D399' }
    : { bg: '#F0FDF4', color: '#15803D' };
  const badgeBlue = dark
    ? { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' }
    : { bg: '#EFF6FF', color: '#1D4ED8' };

  return (
    <div style={{
      width: '560px',
      background: t.surface,
      borderRadius: '12px',
      border: `1px solid ${t.border}`,
      boxShadow: dark ? '-8px 0 32px rgba(0,0,0,0.45)' : '-8px 0 32px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '700px',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 0', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: F.dm, fontSize: '20px', fontWeight: 600, color: t.text1, marginBottom: '8px' }}>
              Карта •••• 1001
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="VISA SUM" bg="transparent" color={t.text2} border={`1px solid ${t.border}`} />
              <Badge label="Активна" bg={badgeSuccess.bg} color={badgeSuccess.color} />
              <Badge label="KPI 2 / 3" bg={badgeBlue.bg} color={badgeBlue.color} />
            </div>
          </div>
          <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${t.border}`, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <X size={16} color={t.text3} />
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
                color: activeTab === tab ? t.blue : t.text3,
                cursor: 'pointer',
                borderBottom: activeTab === tab ? `2px solid ${t.blue}` : '2px solid transparent',
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
            <KeyValueRow label="ID карты" value="CARD-20260401-001" mono t={t} />
            <KeyValueRow label="Номер карты" value="•••• •••• •••• 1001" mono t={t} />
            <KeyValueRow label="Продавец" value="Абдуллох Рашидов" t={t} />
            <KeyValueRow label="Организация" value="Mysafar OOO" t={t} />
            <KeyValueRow label="Партия" value="Апрель 2026" t={t} />
            <KeyValueRow label="Дата выдачи" value="01.04.2026, 09:00" t={t} />
            <KeyValueRow label="Дата продажи" value="01.04.2026, 11:32" t={t} />
            <KeyValueRow label="Дата активации" value="01.04.2026, 12:01" t={t} />
            <KeyValueRow label="UCOIN кошелёк" value="UCOIN-ABD-20240115" mono t={t} />
            <KeyValueRow label="Начислено итого" value="20 000 UZS" last t={t} />
          </div>
        )}
        {activeTab === 'Карты' && (
          <div style={{ padding: '24px 0', fontFamily: F.inter, fontSize: '14px', color: t.text3 }}>
            Информация о KPI прогрессе отображается здесь...
          </div>
        )}
        {activeTab === 'Финансы' && (
          <div style={{ padding: '24px 0', fontFamily: F.inter, fontSize: '14px', color: t.text3 }}>
            История транзакций и начислений...
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 24px', borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button style={{ height: '36px', padding: '0 14px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text2, cursor: 'pointer' }}>
          Закрыть
        </button>
        <button style={{ height: '36px', padding: '0 14px', border: 'none', borderRadius: '8px', background: t.blue, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer' }}>
          Редактировать
        </button>
      </div>
    </div>
  );
}

// ─── FORM DIALOG ─────────────────────────────────────────────────────────

function FormDialog({ t, dark }: { t: T; dark: boolean }) {
  return (
    <div style={{
      width: '480px',
      background: t.surface,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.15)',
      border: `1px solid ${t.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1 }}>Добавить продавца</div>
          <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text3, marginTop: '4px' }}>Введите данные нового продавца</div>
        </div>
        <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${t.border}`, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={14} color={t.text3} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Полное имя', placeholder: 'Абдуллох Рашидов' },
          { label: 'Телефон', placeholder: '+998 90 123 45 67' },
          { label: 'UCOIN кошелёк', placeholder: 'UCOIN-...' },
        ].map(field => (
          <div key={field.label}>
            <label style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text2, display: 'block', marginBottom: '6px' }}>{field.label}</label>
            <input
              placeholder={field.placeholder}
              style={{ width: '100%', height: '40px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontFamily: F.inter, fontSize: '14px', color: t.text1, background: t.surface, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}
        <div>
          <label style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text2, display: 'block', marginBottom: '6px' }}>Организация</label>
          <div style={{ position: 'relative' }}>
            <select style={{ width: '100%', height: '40px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', padding: '0 36px 0 12px', fontFamily: F.inter, fontSize: '14px', color: t.text2, background: t.surface, outline: 'none', appearance: 'none', boxSizing: 'border-box' }}>
              <option>Mysafar OOO</option>
              <option>Alif Group</option>
            </select>
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} fill="none">
              <path d="M3 5l4 4 4-4" stroke={t.text3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button style={{ height: '40px', padding: '0 16px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text2, cursor: 'pointer' }}>
          Отмена
        </button>
        <button style={{ height: '40px', padding: '0 16px', border: 'none', borderRadius: '8px', background: t.blue, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer' }}>
          Добавить продавца
        </button>
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────

function ConfirmDialog({ t, dark }: { t: T; dark: boolean }) {
  const errorTint = dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2';
  return (
    <div style={{
      width: '400px',
      background: t.surface,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.15)',
      border: `1px solid ${t.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: errorTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <XCircle size={20} color={t.error} />
          </div>
          <div>
            <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1 }}>Удалить продавца</div>
            <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text3, marginTop: '4px' }}>Это действие нельзя отменить</div>
          </div>
        </div>
        <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${t.border}`, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={14} color={t.text3} />
        </button>
      </div>

      <p style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2, lineHeight: 1.6, marginBottom: '24px' }}>
        Вы уверены, что хотите удалить продавца <strong>Абдуллох Рашидов</strong>? Все связанные карты и история начислений будут сохранены, но доступ продавца будет прекращён.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button style={{ height: '40px', padding: '0 16px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text2, cursor: 'pointer' }}>
          Отмена
        </button>
        <button style={{ height: '40px', padding: '0 16px', border: 'none', borderRadius: '8px', background: t.error, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer' }}>
          Удалить
        </button>
      </div>
    </div>
  );
}

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────────────────

function toastConfig(t: T) {
  return [
    { icon: CheckCircle,    accent: t.success, title: 'KPI начислен',          message: 'Абдуллох Рашидов получил 15 000 UZS за выполнение KPI 2' },
    { icon: XCircle,        accent: t.error,   title: 'Ошибка импорта',         message: 'Файл не соответствует формату. Проверьте шаблон .xlsx' },
    { icon: AlertTriangle,  accent: t.warning, title: 'Срок KPI истекает',      message: '89 карт не завершат KPI до 30.04.2026' },
    { icon: Info,           accent: t.blue,    title: 'Новая партия создана',   message: 'Партия «Апрель 2026» успешно создана. 500 карт добавлено.' },
  ];
}

function ToastItem({ toast, t, dark }: { toast: ReturnType<typeof toastConfig>[0]; t: T; dark: boolean }) {
  const Icon = toast.icon;
  return (
    <div style={{
      width: '360px',
      background: t.surface,
      borderRadius: '8px',
      boxShadow: dark ? '0 4px 16px rgba(0,0,0,0.35)' : '0 4px 16px rgba(0,0,0,0.12)',
      padding: '16px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      borderLeft: `3px solid ${toast.accent}`,
    }}>
      <Icon size={20} color={toast.accent} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: t.text1, marginBottom: '4px' }}>{toast.title}</div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, lineHeight: 1.5 }}>{toast.message}</div>
      </div>
      <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
        <X size={16} color={t.text4} />
      </button>
    </div>
  );
}

export function Row8DrawerModalToast() {
  const [darkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const toasts = toastConfig(t);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Drawer + Modals */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '24px' }}>
          Detail Drawer + Modal Dialogs
        </div>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Detail Drawer (560px) — Карта с вкладками
            </div>
            <DetailDrawer t={t} dark={dark} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Form Dialog — Добавить продавца
              </div>
              <FormDialog t={t} dark={dark} />
            </div>
            <div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Confirm Dialog — Деструктивное действие
              </div>
              <ConfirmDialog t={t} dark={dark} />
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '20px' }}>
          Toast Notifications — 4 variants
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {toasts.map((tt, i) => (
            <ToastItem key={i} toast={tt} t={t} dark={dark} />
          ))}
        </div>
      </div>
    </div>
  );
}
