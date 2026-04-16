import React, { useState } from 'react';
import { Upload, FileText, X, Check, CreditCard, Package, ChevronRight } from 'lucide-react';
import { F, C, theme } from './tokens';
import { useDarkMode } from '../useDarkMode';

type T = ReturnType<typeof theme>;

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────

function FileUpload({ state, t, dark }: { state: 'default' | 'hover' | 'uploaded'; t: T; dark: boolean }) {
  const isHover = state === 'hover';
  const isUploaded = state === 'uploaded';

  return (
    <div>
      <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
        {state === 'default' ? 'Default' : state === 'hover' ? 'Hover / Drag Over' : 'Uploaded'}
      </div>
      <div style={{
        border: `2px dashed ${isHover ? t.blue : t.inputBorder}`,
        borderRadius: '12px',
        height: '180px',
        background: isHover ? t.blueLt : t.surface,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        transition: 'border-color 0.15s, background 0.15s',
        boxSizing: 'border-box',
      }}>
        {isUploaded ? (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: t.pageBg, borderRadius: '8px', border: `1px solid ${t.border}` }}>
              <FileText size={20} color={t.text3} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>cards_april_2026.xlsx</div>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>2.4 MB · 500 карт</div>
              </div>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </div>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.error, fontFamily: F.inter, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <X size={14} /> Удалить
              </button>
            </div>
          </div>
        ) : (
          <>
            <Upload size={48} color={isHover ? t.blue : t.text4} strokeWidth={1.5} />
            <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: isHover ? t.blue : t.text2, marginTop: '12px', textAlign: 'center' }}>
              Перетащите файл сюда
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4, margin: '4px 0 12px' }}>или</div>
            <button style={{ height: '36px', padding: '0 16px', border: `1px solid ${isHover ? t.blue : t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: isHover ? t.blue : t.text2, cursor: 'pointer' }}>
              Выбрать файл
            </button>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4, marginTop: '8px' }}>
              Форматы: .xlsx, .xls, .csv
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────

function EmptyState({ withCTA, t }: { withCTA: boolean; t: T }) {
  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '48px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <CreditCard size={48} color={t.textDisabled} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text2, marginBottom: '8px' }}>
        Карты не найдены
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text3, lineHeight: 1.6, maxWidth: '280px', marginBottom: withCTA ? '24px' : '0' }}>
        Попробуйте изменить фильтры или импортировать новую партию карт
      </div>
      {withCTA && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ height: '40px', padding: '0 16px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text2, cursor: 'pointer' }}>
            Сбросить фильтры
          </button>
          <button style={{ height: '40px', padding: '0 16px', border: 'none', borderRadius: '8px', background: t.blue, fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={16} /> Импорт партии
          </button>
        </div>
      )}
    </div>
  );
}

// ─── CARD STATUS FLOW ────────────────────────────────────────────────────

type FlowKey = 'stock' | 'seller' | 'sold' | 'registered' | 'active';

const FLOW_LIGHT: Record<FlowKey, { bg: string; color: string }> = {
  stock:      { bg: '#F3F4F6', color: '#4B5563' },
  seller:     { bg: '#FFFBEB', color: '#B45309' },
  sold:       { bg: '#ECFEFF', color: '#0E7490' },
  registered: { bg: '#EFF6FF', color: '#1D4ED8' },
  active:     { bg: '#F0FDF4', color: '#15803D' },
};

const FLOW_DARK: Record<FlowKey, { bg: string; color: string }> = {
  stock:      { bg: 'rgba(160,165,184,0.12)', color: '#A0A5B8' },
  seller:     { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24' },
  sold:       { bg: 'rgba(34,211,238,0.12)',  color: '#22D3EE' },
  registered: { bg: 'rgba(59,130,246,0.12)',  color: '#3B82F6' },
  active:     { bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
};

const statusFlow: Array<{ key: FlowKey; label: string; desc: string }> = [
  { key: 'stock',      label: 'На складе',   desc: 'Карта получена на склад' },
  { key: 'seller',     label: 'У продавца',  desc: 'Выдана продавцу' },
  { key: 'sold',       label: 'Продана',     desc: 'Клиент получил карту' },
  { key: 'registered', label: 'Зарег.',      desc: 'Клиент зарегистрирован' },
  { key: 'active',     label: 'Активна',     desc: 'Карта активирована' },
];

function Badge({ label, bg, color }: any) {
  return (
    <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, padding: '3px 10px', borderRadius: '10px', background: bg, color, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function CardStatusFlow({ t, dark }: { t: T; dark: boolean }) {
  const palette = dark ? FLOW_DARK : FLOW_LIGHT;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', flexWrap: 'nowrap', overflowX: 'auto' }}>
      {statusFlow.map((status, i) => {
        const p = palette[status.key];
        return (
          <React.Fragment key={status.label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
              <Badge label={status.label} bg={p.bg} color={p.color} />
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4, textAlign: 'center', maxWidth: '90px', lineHeight: 1.4 }}>
                {status.desc}
              </div>
            </div>
            {i < statusFlow.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '8px', paddingBottom: '24px', margin: '0 4px' }}>
                <div style={{ height: '1px', width: '24px', background: t.inputBorder }} />
                <ChevronRight size={12} color={t.inputBorder} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── ACTIVITY TIMELINE ───────────────────────────────────────────────────

const eventsLight = [
  { color: '#10B981', text: 'KPI 2 выполнен',                     detail: 'Камола Юсупова — карта •••• 1002',       time: 'сегодня, 14:32' },
  { color: '#2563EB', text: 'Партия «Май 2026» создана',           detail: '1 000 карт добавлено в систему',         time: 'сегодня, 12:01' },
  { color: '#D97706', text: 'KPI 1 в процессе',                   detail: 'Дилноза Алиева — 12% выполнения',         time: 'сегодня, 10:45' },
  { color: '#2563EB', text: 'Карта •••• 1003 активирована',        detail: 'Клиент успешно прошёл регистрацию',      time: 'вчера, 18:22' },
  { color: '#6B7280', text: 'Экспорт данных выполнен',             detail: 'Администратор bank_admin',                time: 'вчера, 16:00' },
];

const eventsDark = [
  { color: '#34D399' },
  { color: '#3B82F6' },
  { color: '#FBBF24' },
  { color: '#3B82F6' },
  { color: '#A0A5B8' },
];

function ActivityTimeline({ t, dark }: { t: T; dark: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {eventsLight.map((ev, i) => {
        const markerColor = dark ? eventsDark[i].color : ev.color;
        return (
          <div key={i} style={{ display: 'flex', gap: '12px' }}>
            {/* Left dot + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
              <div style={{ marginTop: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: markerColor }} />
              </div>
              {i < eventsLight.length - 1 && (
                <div style={{ width: '1px', flex: 1, background: t.border, margin: '4px 0' }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: i < eventsLight.length - 1 ? '16px' : '0', display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '2px' }}>
              <div>
                <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2, fontWeight: 500 }}>{ev.text}</div>
                <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '2px' }}>{ev.detail}</div>
              </div>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {ev.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Row9Misc() {
  const [darkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* File Upload */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '20px' }}>File Upload / Drop Zone — 3 states</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          <FileUpload state="default" t={t} dark={dark} />
          <FileUpload state="hover" t={t} dark={dark} />
          <FileUpload state="uploaded" t={t} dark={dark} />
        </div>
      </div>

      {/* Empty States */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '20px' }}>Empty State — 2 variants</div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <EmptyState withCTA={true} t={t} />
          <EmptyState withCTA={false} t={t} />
        </div>
      </div>

      {/* Card Status Flow */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '20px' }}>Card Status Flow</div>
        <CardStatusFlow t={t} dark={dark} />
      </div>

      {/* Activity Timeline */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '20px' }}>Activity Timeline</div>
        <ActivityTimeline t={t} dark={dark} />
      </div>
    </div>
  );
}
