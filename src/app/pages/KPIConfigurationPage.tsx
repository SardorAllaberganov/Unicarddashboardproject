import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, Check, Plus, Trash2, ChevronDown, AlertCircle, Calendar, Building2,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

interface KPIStep {
  id: string;
  type: string;
  threshold: string;
  reward: string;
  description: string;
}

interface FormData {
  campaignName: string;
  organization: string;
  startDate: string;
  duration: string;
  kpiSteps: KPIStep[];
  autoPayment: boolean;
  notifications: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEPPER HEADER
═══════════════════════════════════════════════════════════════════════════ */

const STEPS = [
  { num: 1, label: 'Общая информация' },
  { num: 2, label: 'Настройка KPI шагов' },
  { num: 3, label: 'Условия выплат' },
  { num: 4, label: 'Предпросмотр' },
];

function StepperHeader({ currentStep, t, dark }: { currentStep: number; t: T; dark: boolean }) {
  const completedRing = dark ? 'rgba(52,211,153,0.20)' : '#D1FAE5';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0',
      marginBottom: '40px',
      padding: '0 32px',
    }}>
      {STEPS.map((step, idx) => {
        const isCurrent = currentStep === step.num;
        const isCompleted = currentStep > step.num;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={step.num}>
            {/* Step circle + label */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
              zIndex: 1,
            }}>
              {/* Circle */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isCompleted ? t.success : isCurrent ? t.blue : t.surface,
                border: isCompleted || isCurrent ? 'none' : `2px solid ${t.inputBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCurrent ? `0 0 0 4px ${t.blueTint}` : isCompleted ? `0 0 0 4px ${completedRing}` : 'none',
                transition: 'all 0.2s',
              }}>
                {isCompleted ? (
                  <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                ) : (
                  <span style={{
                    fontFamily: F.inter,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: isCurrent ? '#FFFFFF' : t.text4,
                  }}>
                    {step.num}
                  </span>
                )}
              </div>

              {/* Label */}
              <div style={{
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: isCurrent ? 600 : 500,
                color: isCurrent ? t.text1 : isCompleted ? t.text2 : t.text3,
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}>
                {step.label}
              </div>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div style={{
                flex: 1,
                height: '2px',
                background: isCompleted ? t.success : t.border,
                marginBottom: '32px',
                maxWidth: '120px',
                minWidth: '60px',
                transition: 'background 0.2s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function FormField({
  label,
  required,
  error,
  helper,
  children,
  t,
}: {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: React.ReactNode;
  t: T;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: F.inter,
        fontSize: '14px',
        fontWeight: 500,
        color: t.text1,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {label}
        {required && <span style={{ color: t.error }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontFamily: F.inter,
          fontSize: '13px',
          color: t.error,
        }}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}
      {helper && !error && (
        <div style={{
          fontFamily: F.inter,
          fontSize: '13px',
          color: t.text3,
        }}>
          {helper}
        </div>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  icon,
  suffix,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  icon?: React.ReactNode;
  suffix?: string;
  t: T;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}>
          {icon}
        </div>
      )}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '44px',
          border: error ? `1px solid ${t.error}` : focused ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`,
          borderRadius: '8px',
          padding: icon ? '0 12px 0 40px' : suffix ? '0 60px 0 12px' : '0 12px',
          fontFamily: F.inter,
          fontSize: '14px',
          color: t.text1,
          background: t.surface,
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: focused && !error ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      />
      {suffix && (
        <span style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: F.inter,
          fontSize: '13px',
          color: t.text3,
        }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  error,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
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
          width: '100%',
          height: '44px',
          border: error ? `1px solid ${t.error}` : focused ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`,
          borderRadius: '8px',
          padding: '0 36px 0 12px',
          fontFamily: F.inter,
          fontSize: '14px',
          color: value ? t.text1 : t.text3,
          background: t.surface,
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
          boxShadow: focused && !error ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      >
        <option value="">{placeholder || 'Выберите...'}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown
        size={16}
        color={t.text3}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  t,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  t: T;
}) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
    }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? t.blue : t.inputBorder,
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{
        fontFamily: F.inter,
        fontSize: '14px',
        color: t.text2,
      }}>
        {label}
      </span>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI STEP CARD
═══════════════════════════════════════════════════════════════════════════ */

function KPIStepCard({
  step,
  index,
  onUpdate,
  onDelete,
  t,
  dark,
}: {
  step: KPIStep;
  index: number;
  onUpdate: (id: string, field: keyof KPIStep, value: string) => void;
  onDelete: (id: string) => void;
  t: T;
  dark: boolean;
}) {
  const [deleteHover, setDeleteHover] = useState(false);

  const KPI_TYPES = [
    'Первая транзакция',
    'Объём транзакций',
    'Количество транзакций',
    'Регистрация карты',
  ];

  const deleteHoverBg = dark ? 'rgba(248,113,113,0.12)' : t.errorBg;

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: t.blueLt,
            border: `2px solid ${t.blue}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 600,
              color: t.blue,
            }}>
              {index + 1}
            </span>
          </div>
          <span style={{
            fontFamily: F.dm,
            fontSize: '16px',
            fontWeight: 600,
            color: t.text1,
          }}>
            Шаг KPI {index + 1}
          </span>
        </div>

        <button
          onMouseEnter={() => setDeleteHover(true)}
          onMouseLeave={() => setDeleteHover(false)}
          onClick={() => onDelete(step.id)}
          style={{
            width: '32px',
            height: '32px',
            border: `1px solid ${deleteHover ? t.error : t.border}`,
            borderRadius: '7px',
            background: deleteHover ? deleteHoverBg : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          <Trash2 size={14} color={deleteHover ? t.error : t.text3} />
        </button>
      </div>

      {/* Fields */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      }}>
        <FormField label="Тип действия" required t={t}>
          <SelectInput
            value={step.type}
            onChange={v => onUpdate(step.id, 'type', v)}
            options={KPI_TYPES}
            placeholder="Выберите тип"
            t={t}
          />
        </FormField>

        <FormField label="Порог выполнения" required t={t}>
          <TextInput
            value={step.threshold}
            onChange={v => onUpdate(step.id, 'threshold', v)}
            placeholder="Например: 1 транзакция"
            t={t}
          />
        </FormField>

        <FormField label="Вознаграждение" required t={t}>
          <TextInput
            value={step.reward}
            onChange={v => onUpdate(step.id, 'reward', v)}
            placeholder="Например: 5000"
            suffix="UZS"
            t={t}
          />
        </FormField>

        <FormField label="Описание" t={t}>
          <TextInput
            value={step.description}
            onChange={v => onUpdate(step.id, 'description', v)}
            placeholder="Краткое описание"
            t={t}
          />
        </FormField>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP CONTENT PANELS
═══════════════════════════════════════════════════════════════════════════ */

function Step1GeneralInfo({ data, onChange, t, dark }: {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  t: T;
  dark: boolean;
}) {
  const ORGANIZATIONS = [
    'Mysafar OOO',
    'Unired Marketing',
    'Express Finance',
    'Digital Pay',
    'SmartCard Group',
  ];

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <div style={{
        fontFamily: F.dm,
        fontSize: '18px',
        fontWeight: 600,
        color: t.text1,
        marginBottom: '6px',
      }}>
        Основная информация
      </div>
      <div style={{
        fontFamily: F.inter,
        fontSize: '14px',
        color: t.text3,
        marginBottom: '28px',
      }}>
        Укажите базовые параметры KPI кампании
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FormField
          label="Название кампании"
          required
          helper="Используется для внутренней идентификации"
          t={t}
        >
          <TextInput
            value={data.campaignName}
            onChange={v => onChange('campaignName', v)}
            placeholder="Например: Апрель 2026 - Базовый KPI"
            t={t}
          />
        </FormField>

        <FormField label="Организация" required t={t}>
          <SelectInput
            value={data.organization}
            onChange={v => onChange('organization', v)}
            options={ORGANIZATIONS}
            placeholder="Выберите организацию"
            t={t}
          />
        </FormField>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          <FormField label="Дата старта" required t={t}>
            <TextInput
              value={data.startDate}
              onChange={v => onChange('startDate', v)}
              placeholder="ДД.ММ.ГГГГ"
              icon={<Calendar size={16} color={t.text3} />}
              t={t}
            />
          </FormField>

          <FormField label="Длительность" required t={t}>
            <TextInput
              value={data.duration}
              onChange={v => onChange('duration', v)}
              placeholder="30"
              suffix="дней"
              t={t}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

function Step2KPISteps({ data, onChange, t, dark }: {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  t: T;
  dark: boolean;
}) {
  const [addHover, setAddHover] = useState(false);

  const addStep = () => {
    const newStep: KPIStep = {
      id: `step-${Date.now()}`,
      type: '',
      threshold: '',
      reward: '',
      description: '',
    };
    onChange('kpiSteps', [...data.kpiSteps, newStep]);
  };

  const updateStep = (id: string, field: keyof KPIStep, value: string) => {
    const updated = data.kpiSteps.map(s => s.id === id ? { ...s, [field]: value } : s);
    onChange('kpiSteps', updated);
  };

  const deleteStep = (id: string) => {
    const filtered = data.kpiSteps.filter(s => s.id !== id);
    onChange('kpiSteps', filtered);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        <div style={{
          fontFamily: F.dm,
          fontSize: '18px',
          fontWeight: 600,
          color: t.text1,
          marginBottom: '6px',
        }}>
          Настройка KPI шагов
        </div>
        <div style={{
          fontFamily: F.inter,
          fontSize: '14px',
          color: t.text3,
        }}>
          Определите этапы выполнения и вознаграждения
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.kpiSteps.map((step, idx) => (
          <KPIStepCard
            key={step.id}
            step={step}
            index={idx}
            onUpdate={updateStep}
            onDelete={deleteStep}
            t={t}
            dark={dark}
          />
        ))}

        {/* Add step button */}
        <button
          onMouseEnter={() => setAddHover(true)}
          onMouseLeave={() => setAddHover(false)}
          onClick={addStep}
          style={{
            height: '56px',
            border: addHover ? `2px dashed ${t.blue}` : `2px dashed ${t.inputBorder}`,
            borderRadius: '10px',
            background: addHover ? t.blueLt : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: addHover ? t.blue : t.text3,
            transition: 'all 0.15s',
          }}
        >
          <Plus size={18} strokeWidth={2} />
          Добавить шаг KPI
        </button>

        {data.kpiSteps.length === 0 && (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: t.tableAlt,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
          }}>
            <div style={{
              fontFamily: F.inter,
              fontSize: '14px',
              color: t.text3,
              marginBottom: '12px',
            }}>
              Нет настроенных шагов KPI
            </div>
            <div style={{
              fontFamily: F.inter,
              fontSize: '13px',
              color: t.text4,
            }}>
              Нажмите кнопку выше чтобы добавить первый шаг
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step3PaymentConditions({ data, onChange, t, dark }: {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  t: T;
  dark: boolean;
}) {
  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <div style={{
        fontFamily: F.dm,
        fontSize: '18px',
        fontWeight: 600,
        color: t.text1,
        marginBottom: '6px',
      }}>
        Условия выплат
      </div>
      <div style={{
        fontFamily: F.inter,
        fontSize: '14px',
        color: t.text3,
        marginBottom: '28px',
      }}>
        Настройте параметры автоматизации выплат
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{
          background: t.tableAlt,
          border: `1px solid ${t.border}`,
          borderRadius: '10px',
          padding: '20px',
        }}>
          <Toggle
            checked={data.autoPayment}
            onChange={v => onChange('autoPayment', v)}
            label="Автоматические начисления вознаграждений"
            t={t}
          />
          <div style={{
            fontFamily: F.inter,
            fontSize: '13px',
            color: t.text3,
            marginTop: '8px',
            paddingLeft: '54px',
          }}>
            При выполнении KPI вознаграждение будет автоматически начислено на UCOIN-кошелёк продавца
          </div>
        </div>

        <div style={{
          background: t.tableAlt,
          border: `1px solid ${t.border}`,
          borderRadius: '10px',
          padding: '20px',
        }}>
          <Toggle
            checked={data.notifications}
            onChange={v => onChange('notifications', v)}
            label="Уведомления о выполнении KPI"
            t={t}
          />
          <div style={{
            fontFamily: F.inter,
            fontSize: '13px',
            color: t.text3,
            marginTop: '8px',
            paddingLeft: '54px',
          }}>
            Отправлять email-уведомления продавцам при достижении KPI этапов
          </div>
        </div>

        <div style={{
          background: t.blueLt,
          border: `1px solid ${t.blueTint}`,
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          gap: '12px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: t.blue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: F.inter,
              fontSize: '12px',
              fontWeight: 700,
              color: '#FFFFFF',
            }}>
              i
            </span>
          </div>
          <div>
            <div style={{
              fontFamily: F.inter,
              fontSize: '13px',
              fontWeight: 500,
              color: t.text1,
              marginBottom: '4px',
            }}>
              Интеграция с UCOIN
            </div>
            <div style={{
              fontFamily: F.inter,
              fontSize: '13px',
              color: t.text2,
              lineHeight: 1.5,
            }}>
              Выплаты осуществляются через систему UCOIN-кошельков. Убедитесь, что у продавцов указаны корректные данные кошельков.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4Preview({ data, t, dark }: { data: FormData; t: T; dark: boolean }) {
  const totalReward = data.kpiSteps.reduce((sum, step) => {
    const amount = parseInt(step.reward.replace(/\s/g, '')) || 0;
    return sum + amount;
  }, 0);

  const summaryBorder = dark ? 'rgba(52,211,153,0.35)' : '#86EFAC';

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        <div style={{
          fontFamily: F.dm,
          fontSize: '18px',
          fontWeight: 600,
          color: t.text1,
          marginBottom: '6px',
        }}>
          Предпросмотр конфигурации
        </div>
        <div style={{
          fontFamily: F.inter,
          fontSize: '14px',
          color: t.text3,
        }}>
          Проверьте все параметры перед сохранением
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* General Info */}
        <div style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: '12px',
          padding: '24px',
        }}>
          <div style={{
            fontFamily: F.dm,
            fontSize: '16px',
            fontWeight: 600,
            color: t.text1,
            marginBottom: '16px',
          }}>
            Общая информация
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            <PreviewItem label="Название кампании" value={data.campaignName || '—'} t={t} />
            <PreviewItem label="Организация" value={data.organization || '—'} t={t} />
            <PreviewItem label="Дата старта" value={data.startDate || '—'} t={t} />
            <PreviewItem label="Длительность" value={data.duration ? `${data.duration} дней` : '—'} t={t} />
          </div>
        </div>

        {/* KPI Steps */}
        <div style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: '12px',
          padding: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <div style={{
              fontFamily: F.dm,
              fontSize: '16px',
              fontWeight: 600,
              color: t.text1,
            }}>
              KPI шаги
            </div>
            <div style={{
              fontFamily: F.inter,
              fontSize: '13px',
              color: t.text3,
            }}>
              Всего: {data.kpiSteps.length} шагов
            </div>
          </div>

          {data.kpiSteps.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.kpiSteps.map((step, idx) => (
                <div
                  key={step.id}
                  style={{
                    background: t.tableAlt,
                    border: `1px solid ${t.border}`,
                    borderRadius: '8px',
                    padding: '14px',
                  }}
                >
                  <div style={{
                    fontFamily: F.inter,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: t.text2,
                    marginBottom: '8px',
                  }}>
                    Шаг {idx + 1}: {step.type || 'Не указан'}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontFamily: F.inter,
                    fontSize: '13px',
                    color: t.text3,
                  }}>
                    <div>Порог: <span style={{ color: t.text2 }}>{step.threshold || '—'}</span></div>
                    <div>Вознаграждение: <span style={{ fontFamily: F.mono, color: t.text2 }}>{step.reward || '—'} UZS</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              fontFamily: F.inter,
              fontSize: '13px',
              color: t.text4,
            }}>
              Нет настроенных шагов
            </div>
          )}
        </div>

        {/* Payment Conditions */}
        <div style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: '12px',
          padding: '24px',
        }}>
          <div style={{
            fontFamily: F.dm,
            fontSize: '16px',
            fontWeight: 600,
            color: t.text1,
            marginBottom: '16px',
          }}>
            Условия выплат
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <PreviewCheckItem
              label="Автоматические начисления"
              checked={data.autoPayment}
              t={t}
            />
            <PreviewCheckItem
              label="Уведомления о выполнении"
              checked={data.notifications}
              t={t}
            />
          </div>
        </div>

        {/* Summary */}
        <div style={{
          background: t.successBg,
          border: `1px solid ${summaryBorder}`,
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: t.text1,
          }}>
            Максимальное вознаграждение за все KPI
          </div>
          <div style={{
            fontFamily: F.mono,
            fontSize: '20px',
            fontWeight: 700,
            color: t.success,
          }}>
            {totalReward.toLocaleString('ru-RU')} UZS
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewItem({ label, value, t }: { label: string; value: string; t: T }) {
  return (
    <div>
      <div style={{
        fontFamily: F.inter,
        fontSize: '12px',
        color: t.text4,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: F.inter,
        fontSize: '14px',
        fontWeight: 500,
        color: t.text1,
      }}>
        {value}
      </div>
    </div>
  );
}

function PreviewCheckItem({ label, checked, t }: { label: string; checked: boolean; t: T }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '4px',
        background: checked ? t.success : t.border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={2.5} />}
      </div>
      <span style={{
        fontFamily: F.inter,
        fontSize: '14px',
        color: t.text2,
      }}>
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function KPIConfigurationPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    campaignName: '',
    organization: '',
    startDate: '',
    duration: '30',
    kpiSteps: [],
    autoPayment: true,
    notifications: true,
  });

  const [backHover, setBackHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [saveHover, setSaveHover] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.campaignName && formData.organization && formData.startDate && formData.duration;
      case 2:
        return formData.kpiSteps.length > 0 && formData.kpiSteps.every(s => s.type && s.threshold && s.reward);
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    console.log('Saving KPI configuration:', formData);
    alert('Конфигурация KPI успешно сохранена!');
  };

  const backHoverBg = dark ? D.tableHover : '#F9FAFB';
  const saveHoverBg = dark ? 'rgba(52,211,153,0.12)' : t.successBg;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      {/* Sidebar */}
      <Sidebar role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        {/* Content */}
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>KPI конфигурация</span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              Создание KPI конфигурации
            </h1>
            <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
              Настройте параметры KPI кампании для организации
            </p>
          </div>

          {/* Stepper */}
          <div style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            padding: '40px 24px 32px',
            marginBottom: '24px',
          }}>
            <StepperHeader currentStep={currentStep} t={t} dark={dark} />

            {/* Step content */}
            {currentStep === 1 && <Step1GeneralInfo data={formData} onChange={updateFormData} t={t} dark={dark} />}
            {currentStep === 2 && <Step2KPISteps data={formData} onChange={updateFormData} t={t} dark={dark} />}
            {currentStep === 3 && <Step3PaymentConditions data={formData} onChange={updateFormData} t={t} dark={dark} />}
            {currentStep === 4 && <Step4Preview data={formData} t={t} dark={dark} />}

            {/* Navigation buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '40px',
              padding: '0 32px',
            }}>
              <button
                onMouseEnter={() => setBackHover(true)}
                onMouseLeave={() => setBackHover(false)}
                onClick={handleBack}
                disabled={currentStep === 1}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  border: `1px solid ${t.border}`,
                  borderRadius: '8px',
                  background: backHover && currentStep > 1 ? backHoverBg : t.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: currentStep === 1 ? t.textDisabled : t.text2,
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.12s',
                }}
              >
                <ChevronLeft size={16} strokeWidth={2} />
                Назад
              </button>

              {currentStep < 4 ? (
                <button
                  onMouseEnter={() => setNextHover(true)}
                  onMouseLeave={() => setNextHover(false)}
                  onClick={handleNext}
                  disabled={!canProceed()}
                  style={{
                    height: '44px',
                    padding: '0 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: !canProceed() ? t.inputBorder : nextHover ? t.blueHover : t.blue,
                    fontFamily: F.inter,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    cursor: !canProceed() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: dark ? 'none' : canProceed() && nextHover ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
                    transition: 'all 0.12s',
                  }}
                >
                  Далее
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              ) : (
                <button
                  onMouseEnter={() => setSaveHover(true)}
                  onMouseLeave={() => setSaveHover(false)}
                  onClick={handleSave}
                  style={{
                    height: '44px',
                    padding: '0 28px',
                    borderRadius: '8px',
                    background: saveHover ? saveHoverBg : t.success,
                    fontFamily: F.inter,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: saveHover ? t.success : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    boxShadow: dark ? 'none' : saveHover ? '0 2px 12px rgba(16,185,129,0.3)' : '0 1px 3px rgba(16,185,129,0.2)',
                    transition: 'all 0.12s',
                  }}
                >
                  <Check size={18} strokeWidth={2.5} />
                  Сохранить конфигурацию
                </button>
              )}
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
