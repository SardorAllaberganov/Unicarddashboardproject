import React from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { F, C, D, theme } from './tokens';
import { useDarkMode } from '../useDarkMode';

type T = ReturnType<typeof theme>;

// ─── VARIANT A: KPI Config Builder (editable) ─────────────────────────────

const configSteps = [
  {
    num: 1, status: 'completed',
    title: 'Первая транзакция',
    type: 'Первая транзакция', threshold: '1 транзакция', reward: '5 000', desc: 'Активация карты и первый платёж',
  },
  {
    num: 2, status: 'completed',
    title: 'Объём 500 000 UZS',
    type: 'Объём транзакций', threshold: '500 000 UZS', reward: '15 000', desc: 'Накопленный оборот по карте',
  },
  {
    num: 3, status: 'active',
    title: 'Объём 1 500 000 UZS',
    type: 'Объём транзакций', threshold: '1 500 000 UZS', reward: '30 000', desc: 'Финальная цель KPI кампании',
  },
];

function StepCircleA({ num, status, t }: { num: number; status: string; t: T }) {
  if (status === 'completed') {
    return (
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
        <Check size={16} color="#FFFFFF" strokeWidth={3} />
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: t.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
        <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>{num}</span>
      </div>
    );
  }
  return (
    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, background: t.surface }}>
      <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: t.text4 }}>{num}</span>
    </div>
  );
}

function ConfigStepCard({ step, isLast, t, dark }: { step: typeof configSteps[0]; isLast: boolean; t: T; dark: boolean }) {
  const isActive = step.status === 'active';
  return (
    <div style={{ display: 'flex', gap: '0', position: 'relative' }}>
      {/* Left: circle + line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '36px', flexShrink: 0, marginRight: '16px' }}>
        <StepCircleA num={step.num} status={step.status} t={t} />
        {!isLast && (
          <div style={{ width: '2px', flex: 1, background: 'transparent', borderLeft: `2px dashed ${t.inputBorder}`, minHeight: '24px', marginTop: '4px' }} />
        )}
      </div>

      {/* Right: Card */}
      <div style={{
        flex: 1,
        background: t.surface,
        border: isActive ? `1px solid ${t.blue}` : `1px solid ${t.border}`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: isLast ? '0' : '16px',
        boxShadow: isActive ? (dark ? '0 2px 8px rgba(59,130,246,0.25)' : '0 2px 8px rgba(37,99,235,0.08)') : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1 }}>{step.title}</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={{ border: `1px solid ${t.border}`, borderRadius: '6px', background: t.surface, padding: '4px 8px', cursor: 'pointer', fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>Изменить</button>
            <button style={{ border: `1px solid ${t.errorBg}`, borderRadius: '6px', background: t.errorBg, padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Trash2 size={12} color={t.error} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, display: 'block', marginBottom: '4px' }}>Тип действия</label>
            <div style={{ height: '36px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: dark ? D.tableAlt : '#F9FAFB' }}>
              <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>{step.type}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke={t.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div>
            <label style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, display: 'block', marginBottom: '4px' }}>Порог выполнения</label>
            <input
              defaultValue={step.threshold}
              style={{ width: '100%', height: '36px', border: isActive ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontFamily: F.inter, fontSize: '14px', color: t.text1, outline: 'none', background: t.surface, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, display: 'block', marginBottom: '4px' }}>Вознаграждение (UZS)</label>
            <div style={{ position: 'relative' }}>
              <input
                defaultValue={step.reward}
                style={{ width: '100%', height: '36px', border: isActive ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`, borderRadius: '8px', padding: '0 48px 0 12px', fontFamily: F.mono, fontSize: '14px', color: t.text1, outline: 'none', background: t.surface, boxSizing: 'border-box' }}
              />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>UZS</span>
            </div>
          </div>
          <div>
            <label style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, display: 'block', marginBottom: '4px' }}>Описание</label>
            <input
              defaultValue={step.desc}
              style={{ width: '100%', height: '36px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontFamily: F.inter, fontSize: '14px', color: t.text1, outline: 'none', background: t.surface, boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPIConfigBuilder({ t, dark }: { t: T; dark: boolean }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px', flex: 1 }}>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '6px' }}>
        Variant A — KPI Config Builder
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '24px' }}>
        Editable step configuration for Bank Admin
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {configSteps.map((step, i) => (
          <ConfigStepCard key={step.num} step={step} isLast={i === configSteps.length - 1} t={t} dark={dark} />
        ))}
      </div>

      {/* Add Step button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginTop: '16px' }}>
        <div style={{ width: '36px', display: 'flex', justifyContent: 'center', marginRight: '16px' }}>
          <div style={{ width: '2px', height: '16px', borderLeft: `2px dashed ${t.inputBorder}` }} />
        </div>
        <button style={{
          flex: 1, height: '44px', border: `2px dashed ${t.inputBorder}`, borderRadius: '10px',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          fontFamily: F.inter, fontSize: '14px', color: t.text3,
          transition: 'border-color 0.15s, color 0.15s',
        }}>
          <Plus size={16} />
          Добавить шаг KPI
        </button>
      </div>
    </div>
  );
}

// ─── VARIANT B: KPI Progress Tracker (read-only) ───────────────────────────

const progressSteps = [
  {
    num: 1, status: 'completed',
    title: 'Первая транзакция',
    subtitle: 'Минимум 1 транзакция по карте',
    rewardText: 'Начислено: 5 000 UZS → Абдуллох',
    date: '01.04.2026, 09:14',
  },
  {
    num: 2, status: 'completed',
    title: 'Объём 500 000 UZS',
    subtitle: 'Накопленный оборот по карте',
    rewardText: 'Начислено: 15 000 UZS → Абдуллох',
    date: '02.04.2026, 14:32',
  },
  {
    num: 3, status: 'in-progress',
    title: 'Объём 1 500 000 UZS',
    subtitle: 'Финальная цель KPI кампании',
    progress: 64,
    progressText: '320 000 / 500 000 UZS (64%)',
  },
];

function StepCircleB({ num, status, t }: { num: number; status: string; t: T }) {
  if (status === 'completed') {
    return (
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
        <Check size={14} color="#FFFFFF" strokeWidth={3} />
      </div>
    );
  }
  if (status === 'in-progress') {
    return (
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${t.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, background: t.blueLt }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.blue }} />
      </div>
    );
  }
  return (
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${t.inputBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, background: t.surface }}>
      <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: t.text4 }}>{num}</span>
    </div>
  );
}

function ProgressStep({ step, isLast, t }: { step: any; isLast: boolean; t: T }) {
  const completed = step.status === 'completed';
  const inProgress = step.status === 'in-progress';
  const pending = step.status === 'pending';

  return (
    <div style={{ display: 'flex', gap: '0' }}>
      {/* Left: circle + line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0, marginRight: '16px' }}>
        <StepCircleB num={step.num} status={step.status} t={t} />
        {!isLast && (
          <div style={{
            width: '2px', flex: 1, minHeight: '24px', marginTop: '4px',
            background: completed ? t.success : 'transparent',
            borderLeft: completed ? 'none' : `2px dashed ${t.inputBorder}`,
          }} />
        )}
      </div>

      {/* Right: content */}
      <div style={{ flex: 1, paddingBottom: isLast ? '0' : '24px' }}>
        <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: pending ? t.text4 : t.text1, marginBottom: '4px' }}>
          {step.title}
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '8px' }}>
          {step.subtitle}
        </div>

        {completed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.success, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={12} strokeWidth={3} /> Выполнено
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>{step.date}</div>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.success, marginTop: '4px' }}>
              💰 {step.rewardText}
            </div>
          </div>
        )}

        {inProgress && (
          <div>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: t.progressTrack, overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: `${step.progress}%`, height: '100%', background: t.blue, borderRadius: '4px' }} />
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{step.progressText}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function KPIProgressTracker({ t }: { t: T }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px', flex: 1 }}>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '6px' }}>
        Variant B — KPI Progress Tracker
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '24px' }}>
        Read-only view for card detail drawer
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {progressSteps.map((step, i) => (
          <ProgressStep key={step.num} step={step} isLast={i === progressSteps.length - 1} t={t} />
        ))}
      </div>
    </div>
  );
}

export function Row5KPIStepper() {
  const [dark] = useDarkMode();
  const t = theme(dark);

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <KPIConfigBuilder t={t} dark={dark} />
      <KPIProgressTracker t={t} />
    </div>
  );
}
