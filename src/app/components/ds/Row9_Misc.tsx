import React, { useState } from 'react';
import { Upload, FileText, X, Check, CreditCard, Package, ChevronRight } from 'lucide-react';
import { F, C } from './tokens';

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────

function FileUpload({ state }: { state: 'default' | 'hover' | 'uploaded' }) {
  const isHover = state === 'hover';
  const isUploaded = state === 'uploaded';

  return (
    <div>
      <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
        {state === 'default' ? 'Default' : state === 'hover' ? 'Hover / Drag Over' : 'Uploaded'}
      </div>
      <div style={{
        border: `2px dashed ${isHover ? '#2563EB' : '#D1D5DB'}`,
        borderRadius: '12px',
        height: '180px',
        background: isHover ? '#EFF6FF' : '#FFFFFF',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F9FAFB', borderRadius: '8px', border: `1px solid #E5E7EB` }}>
              <FileText size={20} color="#6B7280" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#111827' }}>cards_april_2026.xlsx</div>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: '#9CA3AF' }}>2.4 MB · 500 карт</div>
              </div>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </div>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', fontFamily: F.inter, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <X size={14} /> Удалить
              </button>
            </div>
          </div>
        ) : (
          <>
            <Upload size={48} color={isHover ? '#2563EB' : '#9CA3AF'} strokeWidth={1.5} />
            <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: isHover ? '#2563EB' : '#374151', marginTop: '12px', textAlign: 'center' }}>
              Перетащите файл сюда
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: '#9CA3AF', margin: '4px 0 12px' }}>или</div>
            <button style={{ height: '36px', padding: '0 16px', border: `1px solid ${isHover ? '#2563EB' : '#D1D5DB'}`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: isHover ? '#2563EB' : '#374151', cursor: 'pointer' }}>
              Выбрать файл
            </button>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
              Форматы: .xlsx, .xls, .csv
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────

function EmptyState({ withCTA }: { withCTA: boolean }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: `1px solid #E5E7EB`,
      borderRadius: '12px',
      padding: '48px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <CreditCard size={48} color="#D1D5DB" strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
        Карты не найдены
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '14px', color: '#6B7280', lineHeight: 1.6, maxWidth: '280px', marginBottom: withCTA ? '24px' : '0' }}>
        Попробуйте изменить фильтры или импортировать новую партию карт
      </div>
      {withCTA && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ height: '40px', padding: '0 16px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
            Сбросить фильтры
          </button>
          <button style={{ height: '40px', padding: '0 16px', border: 'none', borderRadius: '8px', background: '#2563EB', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={16} /> Импорт партии
          </button>
        </div>
      )}
    </div>
  );
}

// ─── CARD STATUS FLOW ────────────────────────────────────────────────────

const statusFlow = [
  { label: 'На складе', badge: { bg: '#F3F4F6', color: '#4B5563' }, desc: 'Карта получена на склад' },
  { label: 'У продавца', badge: { bg: '#FFFBEB', color: '#B45309' }, desc: 'Выдана продавцу' },
  { label: 'Продана', badge: { bg: '#ECFEFF', color: '#0E7490' }, desc: 'Клиент получил карту' },
  { label: 'Зарег.', badge: { bg: '#EFF6FF', color: '#1D4ED8' }, desc: 'Клиент зарегистрирован' },
  { label: 'Активна', badge: { bg: '#F0FDF4', color: '#15803D' }, desc: 'Карта активирована' },
];

function Badge({ label, bg, color }: any) {
  return (
    <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, padding: '3px 10px', borderRadius: '10px', background: bg, color, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function CardStatusFlow() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', flexWrap: 'nowrap', overflowX: 'auto' }}>
      {statusFlow.map((status, i) => (
        <React.Fragment key={status.label}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
            <Badge label={status.label} bg={status.badge.bg} color={status.badge.color} />
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: '#9CA3AF', textAlign: 'center', maxWidth: '90px', lineHeight: 1.4 }}>
              {status.desc}
            </div>
          </div>
          {i < statusFlow.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '8px', paddingBottom: '24px', margin: '0 4px' }}>
              <div style={{ height: '1px', width: '24px', background: '#D1D5DB' }} />
              <ChevronRight size={12} color="#D1D5DB" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── ACTIVITY TIMELINE ───────────────────────────────────────────────────

const events = [
  { color: '#10B981', text: 'KPI 2 выполнен', detail: 'Камола Юсупова — карта •••• 1002', time: 'сегодня, 14:32' },
  { color: '#2563EB', text: 'Партия «Май 2026» создана', detail: '1 000 карт добавлено в систему', time: 'сегодня, 12:01' },
  { color: '#D97706', text: 'KPI 1 в процессе', detail: 'Дилноза Алиева — 12% выполнения', time: 'сегодня, 10:45' },
  { color: '#2563EB', text: 'Карта •••• 1003 активирована', detail: 'Клиент успешно прошёл регистрацию', time: 'вчера, 18:22' },
  { color: '#6B7280', text: 'Экспорт данных выполнен', detail: 'Администратор bank_admin', time: 'вчера, 16:00' },
];

function ActivityTimeline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {events.map((ev, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px' }}>
          {/* Left dot + line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
            <div style={{ marginTop: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ev.color }} />
            </div>
            {i < events.length - 1 && (
              <div style={{ width: '1px', flex: 1, background: '#E5E7EB', margin: '4px 0' }} />
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, paddingBottom: i < events.length - 1 ? '16px' : '0', display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '2px' }}>
            <div>
              <div style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151', fontWeight: 500 }}>{ev.text}</div>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{ev.detail}</div>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: '#9CA3AF', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {ev.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Row9Misc() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* File Upload */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>File Upload / Drop Zone — 3 states</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          <FileUpload state="default" />
          <FileUpload state="hover" />
          <FileUpload state="uploaded" />
        </div>
      </div>

      {/* Empty States */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Empty State — 2 variants</div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <EmptyState withCTA={true} />
          <EmptyState withCTA={false} />
        </div>
      </div>

      {/* Card Status Flow */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Card Status Flow</div>
        <CardStatusFlow />
      </div>

      {/* Activity Timeline */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Activity Timeline</div>
        <ActivityTimeline />
      </div>
    </div>
  );
}