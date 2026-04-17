import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell, ChevronRight, Check, X,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { renderMarkdown, FormatToolbar } from '../components/renderMarkdown';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════════════ */

interface SellerOption {
  id: number;
  name: string;
  cardsSold: number;
}

const SELLERS: SellerOption[] = [
  { id: 1, name: 'Санжар Мирзаев',    cardsSold: 62 },
  { id: 2, name: 'Абдуллох Рахимов',  cardsSold: 45 },
  { id: 3, name: 'Ислом Тошматов',    cardsSold: 42 },
  { id: 4, name: 'Нилуфар Каримова',  cardsSold: 33 },
  { id: 5, name: 'Дарья Нам',         cardsSold: 30 },
  { id: 6, name: 'Камола Расулова',   cardsSold: 18 },
];

interface Template {
  id: string;
  emoji: string;
  title: string;
  body: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'plan',
    emoji: '📊',
    title: 'Напоминание о плане',
    body: 'Коллеги, напоминаю о необходимости выполнить план продаж в этом месяце. Проверьте прогресс по вашим KPI и держите связь с клиентами.',
  },
  {
    id: 'congrats',
    emoji: '🎉',
    title: 'Поздравление',
    body: 'Поздравляем с выполнением KPI! Отличная работа — вы лидируете по показателям месяца. Спасибо за качественную работу с клиентами.',
  },
  {
    id: 'cards',
    emoji: '📋',
    title: 'Новые карты доступны',
    body: 'На склад поступили новые карты. Обратитесь к менеджеру для назначения партий и уточнения условий. Не теряйте темп продаж.',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   FORM STATE
═══════════════════════════════════════════════════════════════════════════ */

type RecipientMode = 'all' | 'selected';

interface FormState {
  title: string;
  body: string;
  mode: RecipientMode;
  selectedIds: number[];
  channels: { inapp: true; push: boolean };
}

const EMPTY_FORM: FormState = {
  title: '',
  body: '',
  mode: 'all',
  selectedIds: [1, 2],
  channels: { inapp: true, push: false },
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — Seller Message Compose (N-01)
═══════════════════════════════════════════════════════════════════════════ */

function MSectionHeader({ text, t }: { text: string; t: T }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: 11, fontWeight: 600,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '20px 4px 10px',
    }}>
      {text}
    </div>
  );
}

function MCard({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

function MTitleInput({
  label, value, onChange, placeholder, t,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; t: T;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setFocused(true);
    setTimeout(() => wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }, []);
  return (
    <div ref={wrapRef} style={{ padding: 16 }}>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: 13, fontWeight: 500,
        color: t.text2, marginBottom: 8,
      }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        maxLength={80}
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

function MBodyField({
  label, value, onChange, placeholder, t, dark,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; t: T; dark: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setFocused(true);
    setTimeout(() => wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }, []);
  const max = 500;
  const count = value.length;
  const near = count >= max * 0.8;
  return (
    <div ref={wrapRef} style={{ padding: 16, borderTop: `1px solid ${t.border}` }}>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: 13, fontWeight: 500,
        color: t.text2, marginBottom: 8,
      }}>{label}</label>
      <div style={{ marginBottom: 6 }}>
        <FormatToolbar textareaRef={textRef} value={value} onChange={onChange} dark={dark} />
      </div>
      <textarea
        ref={textRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        maxLength={max}
        style={{
          width: '100%', minHeight: 120,
          padding: '12px 14px',
          border: `1.5px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: 12,
          background: t.surface,
          fontFamily: F.inter, fontSize: 15, color: t.text1,
          outline: 'none', boxSizing: 'border-box', resize: 'vertical',
          lineHeight: 1.5, transition: 'border-color 0.12s',
        }}
      />
      <div style={{
        display: 'flex', justifyContent: 'flex-end', marginTop: 6,
        fontFamily: F.mono, fontSize: 11,
        color: near ? t.warning : t.text4,
      }}>
        {count} / {max}
      </div>
    </div>
  );
}

function MCheckboxRow({
  label, sub, checked, onChange, disabled, hint, isLast, t,
}: {
  label: string; sub?: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean;
  hint?: React.ReactNode; isLast?: boolean; t: T;
}) {
  return (
    <div
      onClick={() => !disabled && onChange?.(!checked)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: 15, color: t.text1 }}>{label}</div>
        {sub && <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 3 }}>{sub}</div>}
        {hint && <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 3 }}>{hint}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
        background: checked ? t.blue : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.12s',
      }}>
        {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
      </div>
    </div>
  );
}

/* ─── Seller picker (full-screen) ─────────────────────────────────────── */

function MSellerPicker({
  open, onClose, t, dark, mode, setMode, selectedIds, setSelectedIds,
}: {
  open: boolean;
  onClose: () => void;
  t: T; dark: boolean;
  mode: RecipientMode;
  setMode: (m: RecipientMode) => void;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
}) {
  if (!open) return null;
  const toggle = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(x => x !== id));
    else setSelectedIds([...selectedIds, id]);
  };
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 80,
      background: t.pageBg,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <button
          onClick={onClose}
          style={{
            width: 40, height: 40, borderRadius: 10, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <X size={22} color={t.text1} strokeWidth={2} />
        </button>
        <span style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Продавцы
        </span>
        <button
          onClick={onClose}
          style={{
            height: 40, padding: '0 12px', borderRadius: 10, border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 14, fontWeight: 600, color: t.blue, cursor: 'pointer',
          }}
        >
          Готово
        </button>
      </div>

      {/* Segmented all / selected */}
      <div style={{ padding: '16px' }}>
        <div style={{
          display: 'flex', padding: 4, borderRadius: 999,
          background: dark ? '#2D3148' : '#F3F4F6',
          height: 36, boxSizing: 'border-box',
        }}>
          {(['all', 'selected'] as RecipientMode[]).map(m => {
            const label = m === 'all' ? `Все (${SELLERS.length})` : `Выбранные (${selectedIds.length})`;
            const isActive = mode === m;
            return (
              <div
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, borderRadius: 999,
                  background: isActive ? t.surface : 'transparent',
                  boxShadow: isActive ? (dark ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(17,24,39,0.08)') : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: F.inter, fontSize: 13, fontWeight: 500,
                  color: isActive ? t.text1 : t.text3,
                  cursor: 'pointer',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px calc(16px + env(safe-area-inset-bottom))' }}>
        {mode === 'all' ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: F.inter, fontSize: 14, color: t.text3 }}>
              Сообщение будет отправлено всем {SELLERS.length} продавцам организации
            </div>
          </div>
        ) : (
          <MCard t={t}>
            {SELLERS.map((s, i) => (
              <MCheckboxRow
                key={s.id}
                label={s.name}
                sub={`${s.cardsSold} карт продано`}
                checked={selectedIds.includes(s.id)}
                onChange={() => toggle(s.id)}
                isLast={i === SELLERS.length - 1}
                t={t}
              />
            ))}
          </MCard>
        )}
      </div>
    </div>
  );
}

/* ─── Preview sheet ────────────────────────────────────────────────────── */

function MSellerPreviewSheet({
  open, onClose, title, body, t, dark,
}: { open: boolean; onClose: () => void; title: string; body: string; t: T; dark: boolean }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)' }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: t.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          boxShadow: dark ? '0 -4px 24px rgba(0,0,0,0.6)' : '0 -4px 24px rgba(17,24,39,0.15)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
          maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
        </div>
        <div style={{ padding: '4px 20px 12px', fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Предпросмотр
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: 14,
            border: `1px solid ${t.border}`, borderRadius: 14, background: t.surface,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: t.blueLt,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Bell size={20} color={t.blue} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: t.text1, lineHeight: 1.3 }}>
                {title.trim() || <span style={{ color: t.text4, fontWeight: 500 }}>Заголовок</span>}
              </div>
              <div style={{ marginTop: 6, lineHeight: 1.5 }}>
                {body.trim() ? renderMarkdown(body, dark) : <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text4 }}>Текст сообщения появится здесь</span>}
              </div>
              <div style={{ fontFamily: F.inter, fontSize: 11, color: t.text4, marginTop: 8 }}>Только что</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', height: 48, borderRadius: 12,
              background: dark ? 'rgba(160,165,184,0.12)' : '#F3F4F6',
              border: 'none', fontFamily: F.inter, fontSize: 16, fontWeight: 600, color: t.text2,
              cursor: 'pointer',
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main mobile compose ─────────────────────────────────────────────── */

function MobileSellerMessageCompose({
  form, patch, onSend, onClose, t, dark,
}: {
  form: FormState;
  patch: (p: Partial<FormState>) => void;
  onSend: () => void;
  onClose: () => void;
  t: T; dark: boolean;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const recipientCount = form.mode === 'all' ? SELLERS.length : form.selectedIds.length;
  const recipientLabel = form.mode === 'all'
    ? `Все продавцы (${SELLERS.length})`
    : `${form.selectedIds.length} выбранных`;

  const valid = form.title.trim().length > 0 && form.body.trim().length > 0 && recipientCount > 0;

  const applyTemplate = (tpl: typeof TEMPLATES[number]) => {
    patch({ title: tpl.title, body: tpl.body });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
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
            width: 40, height: 40, borderRadius: 10, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <X size={22} color={t.text1} strokeWidth={2} />
        </button>
        <span style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Сообщение продавцам
        </span>
        <button
          onClick={valid ? onSend : undefined}
          disabled={!valid}
          style={{
            height: 40, padding: '0 12px', borderRadius: 10, border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 14, fontWeight: 600,
            color: valid ? t.blue : t.textDisabled,
            cursor: valid ? 'pointer' : 'not-allowed',
          }}
        >
          Отправить
        </button>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '0 16px calc(88px + env(safe-area-inset-bottom))',
      }}>
        {/* БЫСТРЫЕ ШАБЛОНЫ */}
        <MSectionHeader text="Быстрые шаблоны" t={t} />
        <div style={{
          display: 'flex', gap: 10, overflowX: 'auto',
          padding: '2px 0 6px', margin: '0 -16px',
          paddingLeft: 16, paddingRight: 16,
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          {TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl)}
              style={{
                flexShrink: 0,
                width: 200, height: 92,
                background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
                padding: '10px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 22, lineHeight: 1 }}>{tpl.emoji}</div>
              <div style={{
                fontFamily: F.inter, fontSize: 13, fontWeight: 600, color: t.text1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                width: '100%',
              }}>
                {tpl.title}
              </div>
              <div style={{
                fontFamily: F.inter, fontSize: 11, color: t.text3,
                lineHeight: 1.35,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {tpl.body}
              </div>
            </button>
          ))}
        </div>

        {/* СОДЕРЖАНИЕ */}
        <MSectionHeader text="Содержание" t={t} />
        <MCard t={t}>
          <MTitleInput
            label="Заголовок"
            value={form.title}
            onChange={v => patch({ title: v })}
            placeholder="Краткий заголовок сообщения"
            t={t}
          />
          <MBodyField
            label="Текст сообщения"
            value={form.body}
            onChange={v => patch({ body: v })}
            placeholder="Сообщение для продавцов..."
            t={t} dark={dark}
          />
        </MCard>

        {/* ПОЛУЧАТЕЛИ */}
        <MSectionHeader text="Получатели" t={t} />
        <MCard t={t}>
          <div
            onClick={() => setPickerOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontFamily: F.inter, fontSize: 15, color: t.text1 }}>Аудитория</span>
            <span style={{
              flex: 1, textAlign: 'right',
              fontFamily: F.inter, fontSize: 14, color: t.text2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {recipientLabel}
            </span>
            <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} />
          </div>
        </MCard>
        <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, padding: '8px 4px 0' }}>
          {recipientCount} {recipientCount === 1 ? 'продавец' : 'продавцов'}
        </div>

        {/* КАНАЛЫ */}
        <MSectionHeader text="Каналы" t={t} />
        <MCard t={t}>
          <MCheckboxRow label="In-app" checked={true} disabled hint="Всегда включено" t={t} />
          <MCheckboxRow
            label="Push-уведомление"
            checked={form.channels.push}
            onChange={v => patch({ channels: { ...form.channels, push: v } })}
            isLast
            t={t}
          />
        </MCard>

        <div style={{ height: 24 }} />
      </div>

      {/* Sticky footer */}
      <div style={{
        flexShrink: 0,
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        background: t.surface, borderTop: `1px solid ${t.border}`,
        display: 'flex', gap: 10,
      }}>
        <button
          onClick={() => setPreviewOpen(true)}
          style={{
            flex: 1, height: 48, borderRadius: 12,
            border: `1.5px solid ${t.inputBorder}`, background: 'transparent',
            fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1,
            cursor: 'pointer',
          }}
        >
          Предпросмотр
        </button>
        <button
          onClick={valid ? onSend : undefined}
          disabled={!valid}
          style={{
            flex: 2, height: 48, borderRadius: 12, border: 'none',
            background: valid ? t.blue : (dark ? '#3A3F50' : '#D1D5DB'),
            fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: '#FFFFFF',
            cursor: valid ? 'pointer' : 'not-allowed',
          }}
        >
          Отправить
        </button>
      </div>

      <MSellerPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        t={t} dark={dark}
        mode={form.mode}
        setMode={m => patch({ mode: m })}
        selectedIds={form.selectedIds}
        setSelectedIds={v => patch({ selectedIds: v })}
      />
      <MSellerPreviewSheet
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={form.title}
        body={form.body}
        t={t} dark={dark}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function SellerMessageComposePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const mobile = useIsMobile();
  const t = theme(darkMode);
  const dark = darkMode;
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();

  const patch = (p: Partial<FormState>) => setForm(s => ({ ...s, ...p }));

  const recipientsCount = useMemo(() => {
    return form.mode === 'all' ? SELLERS.length : form.selectedIds.length;
  }, [form.mode, form.selectedIds]);

  const canSend = form.title.trim() !== '' && form.body.trim() !== '' && recipientsCount > 0;

  const applyTemplate = (tpl: Template) =>
    patch({ title: tpl.title, body: tpl.body });

  const toggleSeller = (id: number) => {
    const has = form.selectedIds.includes(id);
    patch({ selectedIds: has ? form.selectedIds.filter(x => x !== id) : [...form.selectedIds, id] });
  };

  const cardStyle: React.CSSProperties = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: '12px',
    padding: '24px',
  };

  const crumbLink: React.CSSProperties = {
    fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer',
  };

  if (mobile) {
    return (
      <MobileSellerMessageCompose
        form={form}
        patch={patch}
        onSend={() => { console.log('send seller message', form); navigate('/seller-messages'); }}
        onClose={() => navigate('/seller-messages')}
        t={t}
        dark={dark}
      />
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg }}>
      <Sidebar
        role="org"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/org-dashboard')} style={crumbLink}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Сообщение продавцам</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              Сообщение продавцам
            </h1>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
              Отправьте уведомление вашим продавцам
            </div>
          </div>

          {/* Two-column grid */}
          <div className="smc-grid" style={{
            display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px',
          }}>
            {/* ── LEFT: compose ── */}
            <div style={cardStyle}>
              {/* § Содержание */}
              <FormSection title="Содержание" t={t}>
                <FieldLabel required t={t}>Заголовок</FieldLabel>
                <TextInput
                  value={form.title}
                  placeholder="Тема сообщения..."
                  onChange={v => patch({ title: v })}
                  t={t}
                />

                <FieldLabel required style={{ marginTop: '14px' }} t={t}>Текст</FieldLabel>
                <FormatToolbar
                  textareaRef={bodyRef}
                  value={form.body}
                  onChange={v => patch({ body: v })}
                />
                <TextArea
                  ref={bodyRef}
                  value={form.body}
                  placeholder="Текст сообщения для продавцов..."
                  onChange={v => patch({ body: v })}
                  height={120}
                  t={t}
                />
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '6px' }}>
                  Поддерживается простое форматирование: **жирный**, _курсив_, • списки
                </div>
              </FormSection>

              <Divider t={t} />

              {/* § Получатели */}
              <FormSection title="Получатели" t={t}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'stretch' }}>
                  <RadioRow
                    label="Все мои продавцы"
                    sub={`${SELLERS.length} активных продавцов`}
                    checked={form.mode === 'all'}
                    onSelect={() => patch({ mode: 'all' })}
                    t={t}
                  />
                  <RadioRow
                    label="Выбранные продавцы"
                    sub="Отправить списку ниже"
                    checked={form.mode === 'selected'}
                    onSelect={() => patch({ mode: 'selected' })}
                    t={t}
                  />
                </div>

                {form.mode === 'selected' && (
                  <div style={{
                    marginTop: '12px',
                    border: `1px solid ${t.border}`, borderRadius: '8px',
                    overflow: 'hidden',
                  }}>
                    {SELLERS.map((s, i) => (
                      <SellerRow
                        key={s.id}
                        seller={s}
                        checked={form.selectedIds.includes(s.id)}
                        onToggle={() => toggleSeller(s.id)}
                        last={i === SELLERS.length - 1}
                        t={t}
                      />
                    ))}
                    <div style={{
                      padding: '10px 14px', borderTop: `1px solid ${t.border}`,
                      background: t.tableHeaderBg,
                      fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.blue,
                    }}>
                      Выбрано: {form.selectedIds.length} из {SELLERS.length}
                    </div>
                  </div>
                )}
              </FormSection>

              <Divider t={t} />

              {/* § Каналы */}
              <FormSection title="Каналы" t={t}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 20px' }}>
                  <CheckboxRow label="In-app уведомление" checked disabled t={t} />
                  <CheckboxRow
                    label="Push-уведомление"
                    checked={form.channels.push}
                    onChange={v => patch({ channels: { ...form.channels, push: v } })}
                    t={t}
                  />
                </div>
              </FormSection>

              {/* Footer */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '8px',
                marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${t.border}`,
              }}>
                <OutlineButton onClick={() => navigate('/org-dashboard')} t={t}>Отмена</OutlineButton>
                <PrimaryButton disabled={!canSend} onClick={() => setConfirmOpen(true)} t={t} dark={dark}>
                  Отправить
                </PrimaryButton>
              </div>
            </div>

            {/* ── RIGHT: preview + templates ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={cardStyle}>
                <SectionTitle t={t}>Предпросмотр</SectionTitle>
                <PreviewCard
                  title={form.title || 'Тема сообщения'}
                  body={form.body || 'Текст сообщения для продавцов...'}
                  placeholder={form.title.trim() === ''}
                  dark={darkMode}
                  t={t}
                />
                <div style={{ height: '1px', background: t.border, margin: '14px 0' }} />
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
                  Получат: <span style={{ color: t.text2 }}>{recipientsCount} {plural(recipientsCount, 'продавец', 'продавца', 'продавцов')}</span>
                </div>
              </div>

              <div style={cardStyle}>
                <SectionTitle t={t}>Быстрые шаблоны</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {TEMPLATES.map(tpl => (
                    <TemplateCard key={tpl.id} template={tpl} onUse={() => applyTemplate(tpl)} t={t} dark={dark} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SendConfirmDialog
        open={confirmOpen}
        recipientsCount={recipientsCount}
        channels={form.channels}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          const channels: ('In-app' | 'Push')[] = [
            'In-app',
            ...(form.channels.push ? (['Push'] as const) : []),
          ];
          const recipientsLabel = form.mode === 'all'
            ? `Все продавцы (${SELLERS.length})`
            : (() => {
                const picked = SELLERS.filter(s => form.selectedIds.includes(s.id));
                const names = picked.slice(0, 2).map(s => s.name.split(' ')[0]).join(', ');
                const more = picked.length > 2 ? ` и ещё ${picked.length - 2}` : '';
                return `${names}${more} (${picked.length})`;
              })();

          const total = recipientsCount;
          const newRow = {
            id: Date.now(),
            date: 'Только что',
            title: form.title.trim() || 'Без заголовка',
            recipientsLabel,
            channels,
            delivered: [0, total] as [number, number],
            read: [0, total] as [number, number],
          };

          const summary = `${total} ${plural(total, 'продавец', 'продавца', 'продавцов')}`;

          setConfirmOpen(false);
          navigate('/seller-messages', {
            state: { newRow, toast: { title: newRow.title, summary } },
          });
        }}
        t={t}
        dark={dark}
      />

      <style>{`
        @media (max-width: 900px) {
          .smc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SELLER ROW (CHECKBOX LIST)
═══════════════════════════════════════════════════════════════════════════ */

function SellerRow({ seller, checked, onToggle, last, t }: {
  seller: SellerOption; checked: boolean; onToggle: () => void; last: boolean; t: T;
}) {
  const [hov, setHov] = useState(false);
  return (
    <label
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 14px',
        borderBottom: last ? 'none' : `1px solid ${t.border}`,
        background: hov ? t.tableHover : t.surface,
        cursor: 'pointer', transition: 'background 0.1s',
      }}
    >
      <span
        onClick={e => { e.preventDefault(); onToggle(); }}
        style={{
          width: '18px', height: '18px', borderRadius: '4px',
          border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
          background: checked ? t.blue : t.surface,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s', flexShrink: 0,
        }}
      >
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        style={{ display: 'none' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
          {seller.name}
        </div>
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, whiteSpace: 'nowrap' }}>
        {seller.cardsSold} {plural(seller.cardsSold, 'карта продано', 'карты продано', 'карт продано')}
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATE CARD
═══════════════════════════════════════════════════════════════════════════ */

function TemplateCard({ template, onUse, t, dark }: { template: Template; onUse: () => void; t: T; dark: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onUse}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '12px',
        border: `1px solid ${hov ? t.blue : t.border}`,
        background: hov ? t.blueLt : t.surface,
        borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.12s',
        display: 'flex', flexDirection: 'column', gap: '6px',
      }}
    >
      <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
        {template.emoji} {template.title}
      </div>
      <div style={{
        fontFamily: F.inter, fontSize: '12px', color: t.text3, lineHeight: 1.45,
        display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2,
        overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {template.body}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
        <button
          onClick={e => { e.stopPropagation(); onUse(); }}
          style={{
            padding: '4px 10px', border: 'none', borderRadius: '6px',
            background: 'transparent', color: t.blue,
            fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Использовать →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREVIEW CARD
═══════════════════════════════════════════════════════════════════════════ */

function PreviewCard({ title, body, placeholder, dark = false, t }: {
  title: string; body: string; placeholder: boolean; dark?: boolean; t: T;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '12px',
      border: `1px solid ${t.border}`, borderRadius: '8px',
      background: dark ? D.tableHeaderBg : t.surface,
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: t.blueLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Bell size={18} color={t.blue} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
          color: placeholder ? t.text4 : t.text1, lineHeight: 1.3,
        }}>
          📢 {title}
        </div>
        <div style={{ marginTop: '6px' }}>
          {body.trim() === ''
            ? (
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4, lineHeight: 1.45 }}>
                Текст сообщения для продавцов...
              </div>
            )
            : renderMarkdown(body, dark)}
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, marginTop: '6px' }}>
          Только что
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIRMATION DIALOG
═══════════════════════════════════════════════════════════════════════════ */

function SendConfirmDialog({ open, recipientsCount, channels, onClose, onConfirm, t, dark }: {
  open: boolean; recipientsCount: number;
  channels: { inapp: boolean; push: boolean };
  onClose: () => void; onConfirm: () => void;
  t: T; dark: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const channelList = ['In-app', channels.push ? 'Push' : null].filter(Boolean).join(', ');
  const overlayBg = dark ? 'rgba(0,0,0,0.6)' : 'rgba(17, 24, 39, 0.50)';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: overlayBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '16px',
          boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.18)',
          padding: '22px',
        }}
      >
        <div style={{
          fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
          color: t.text1, marginBottom: '6px',
        }}>
          Отправить {recipientsCount} {plural(recipientsCount, 'продавцу', 'продавцам', 'продавцам')}?
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '20px' }}>
          Каналы: {channelList}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <DialogOutlineButton onClick={onClose} t={t}>Отмена</DialogOutlineButton>
          <DialogPrimaryButton onClick={onConfirm} t={t} dark={dark}>Отправить</DialogPrimaryButton>
        </div>
      </div>
    </div>
  );
}

function DialogOutlineButton({ children, onClick, t }: {
  children: React.ReactNode; onClick?: () => void; t: T;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: `1px solid ${t.border}`,
        borderRadius: '8px', background: hov ? t.tableHover : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text2, cursor: 'pointer',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function DialogPrimaryButton({ children, onClick, t, dark }: {
  children: React.ReactNode; onClick?: () => void; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: hov ? t.blueHover : t.blue,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer',
        boxShadow: dark ? 'none' : (hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)'),
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */

function SectionTitle({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <h3 style={{
      margin: '0 0 12px', fontFamily: F.dm, fontSize: '13px', fontWeight: 600,
      color: t.text1, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {children}
    </h3>
  );
}

function FormSection({ title, children, t }: { title: string; children: React.ReactNode; t: T }) {
  return (
    <div style={{ padding: '4px 0' }}>
      <SectionTitle t={t}>{title}</SectionTitle>
      {children}
    </div>
  );
}

function FieldLabel({ children, required, style, t }: {
  children: React.ReactNode; required?: boolean; style?: React.CSSProperties; t: T;
}) {
  return (
    <label style={{
      display: 'block', marginBottom: '6px',
      fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text2,
      ...style,
    }}>
      {children}{required && <span style={{ color: t.error, marginLeft: '3px' }}>*</span>}
    </label>
  );
}

function Divider({ t }: { t: T }) {
  return <div style={{ height: '1px', background: t.border, margin: '20px 0' }} />;
}

function TextInput({ value, placeholder, onChange, t }: {
  value: string; placeholder?: string; onChange: (v: string) => void; t: T;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%', height: '38px', padding: '0 12px',
        border: `1px solid ${focus ? t.blue : t.inputBorder}`,
        borderRadius: '8px', outline: 'none',
        fontFamily: F.inter, fontSize: '14px', color: t.text1,
        background: t.surface, boxSizing: 'border-box',
        transition: 'border-color 0.12s',
      }}
    />
  );
}

const TextArea = React.forwardRef<HTMLTextAreaElement, {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  height?: number;
  t: T;
}>(function TextArea({ value, placeholder, onChange, height, t }, ref) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%', padding: '10px 12px',
        border: `1px solid ${focus ? t.blue : t.inputBorder}`,
        borderRadius: '8px', outline: 'none', resize: 'vertical',
        fontFamily: F.inter, fontSize: '13px', color: t.text1,
        background: t.surface, boxSizing: 'border-box',
        transition: 'border-color 0.12s',
        height: height ? `${height}px` : '120px',
        minHeight: '80px', lineHeight: 1.5,
      }}
    />
  );
});

function CheckboxRow({ label, checked, onChange, disabled, t }: {
  label: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean; t: T;
}) {
  const toggle = () => { if (!disabled && onChange) onChange(!checked); };
  return (
    <label
      onClick={toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1, userSelect: 'none',
      }}
    >
      <span style={{
        width: '18px', height: '18px', borderRadius: '4px',
        border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
        background: checked ? t.blue : t.surface,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s', flexShrink: 0,
      }}>
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </span>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1 }}>{label}</span>
    </label>
  );
}

function RadioRow({ label, sub, checked, onSelect, children, t }: {
  label: string; sub?: string; checked: boolean; onSelect: () => void;
  children?: React.ReactNode; t: T;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        flex: 1, minWidth: 0,
        padding: '12px',
        border: `1px solid ${checked ? t.blue : t.border}`,
        background: checked ? t.blueLt : t.surface,
        borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
          background: t.surface, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginTop: '1px',
        }}>
          {checked && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.blue }} />}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
            {label}
          </div>
          {sub && (
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '2px' }}>
              {sub}
            </div>
          )}
          {children && (
            <div onClick={e => e.stopPropagation()}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════════════════════════ */

function PrimaryButton({ children, onClick, disabled, t, dark }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const disabledBg = dark ? 'rgba(59,130,246,0.35)' : '#93C5FD';
  const bg = disabled ? disabledBg : hov ? t.blueHover : t.blue;
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: bg,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : (dark ? 'none' : (hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)')),
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick, t }: {
  children: React.ReactNode; onClick?: () => void; t: T;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: `1px solid ${hov ? t.text3 : t.inputBorder}`,
        borderRadius: '8px', background: t.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text1, cursor: 'pointer',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
