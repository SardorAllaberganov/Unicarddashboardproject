import React, { useState } from 'react';
import {
  ChevronRight, ChevronDown, Check, CheckCircle,
  Upload, FileSpreadsheet, Plus, X, Trash2,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   STEP INDICATOR
═══════════════════════════════════════════════════════════════════════════ */

const STEPS = ['Основные данные', 'KPI настройки', 'Импорт карт'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '0', marginBottom: '28px',
    }}>
      {STEPS.map((label, i) => {
        const completed = i < current;
        const active = i === current;
        const upcoming = i > current;
        return (
          <React.Fragment key={label}>
            {i > 0 && (
              <div style={{
                width: '80px', height: '2px',
                background: completed ? C.blue : C.border,
                borderStyle: completed ? 'solid' : 'dashed',
                margin: '0 4px',
              }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: completed ? C.success : active ? C.blue : C.surface,
                border: upcoming ? `2px solid ${C.border}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {completed ? (
                  <Check size={14} color="#fff" strokeWidth={3} />
                ) : (
                  <span style={{
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 600,
                    color: active ? '#fff' : C.text4,
                  }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span style={{
                fontFamily: F.inter, fontSize: '13px', fontWeight: active ? 500 : 400,
                color: active ? C.blue : completed ? C.text1 : C.text4,
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM HELPERS
═══════════════════════════════════════════════════════════════════════════ */

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
  color: C.text2, marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', height: '40px', padding: '0 12px',
  border: `1px solid ${C.inputBorder}`, borderRadius: '8px',
  background: C.surface, fontFamily: F.inter, fontSize: '14px',
  color: C.text1, outline: 'none', boxSizing: 'border-box',
};

const ORGS = ['Mysafar OOO', 'Unired Marketing', 'Express Finance', 'Digital Pay', 'SmartCard Group'];
const CARD_TYPES = ['VISA SUM', 'VISA USD', 'Смешанная'];

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 1 — ОСНОВНЫЕ ДАННЫЕ
═══════════════════════════════════════════════════════════════════════════ */

function Step1({ data, onChange }: {
  data: { name: string; org: string; cardType: string; count: number; kpiDays: number; kpiDate: string };
  onChange: (d: any) => void;
}) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '24px',
    }}>
      <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1, margin: '0 0 20px' }}>
        Информация о партии
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
        <div>
          <label style={labelStyle}>Название партии <span style={{ color: C.error }}>*</span></label>
          <input value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} placeholder="Партия Апрель 2026" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Организация <span style={{ color: C.error }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <select value={data.org} onChange={e => onChange({ ...data, org: e.target.value })} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '36px' }}>
              <option value="">Выберите организацию</option>
              {ORGS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} color={C.text3} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Тип карт</label>
          <div style={{ position: 'relative' }}>
            <select value={data.cardType} onChange={e => onChange({ ...data, cardType: e.target.value })} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '36px' }}>
              {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} color={C.text3} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Ожидаемое количество карт</label>
          <input type="number" value={data.count || ''} onChange={e => onChange({ ...data, count: parseInt(e.target.value) || 0 })} placeholder="500" style={{ ...inputStyle, fontFamily: F.mono }} />
        </div>
        <div>
          <label style={labelStyle}>Срок выполнения KPI (дней)</label>
          <input type="number" value={data.kpiDays} onChange={e => onChange({ ...data, kpiDays: parseInt(e.target.value) || 30 })} style={{ ...inputStyle, fontFamily: F.mono }} />
          <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4, marginTop: '6px', display: 'block' }}>По умолчанию: 30 дней</span>
        </div>
        <div>
          <label style={labelStyle}>Дата начала KPI</label>
          <input type="date" value={data.kpiDate} onChange={e => onChange({ ...data, kpiDate: e.target.value })} placeholder="ДД.ММ.ГГГГ" style={inputStyle} />
          <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4, marginTop: '6px', display: 'block' }}>Если не указано, KPI начинается с момента продажи каждой карты</span>
        </div>
      </div>

      {/* Selected org info */}
      {data.org && (
        <div style={{
          marginTop: '20px', padding: '14px 16px',
          background: C.blueLt, border: `1px solid ${C.blueTint}`,
          borderRadius: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>{data.org}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
              padding: '3px 10px', borderRadius: '10px',
              background: C.successBg, color: '#15803D',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.success }} />
              Активна
            </span>
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginBottom: '4px' }}>
            Текущий лимит: 500 карт, использовано: 360
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.blue }}>
            Доступно: 140 карт
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 2 — KPI НАСТРОЙКИ
═══════════════════════════════════════════════════════════════════════════ */

interface KpiStep {
  id: number;
  action: string;
  threshold: string;
  reward: string;
  description: string;
}

const DEFAULT_KPI: KpiStep[] = [
  { id: 1, action: 'Регистрация в Unired Mobile', threshold: '', reward: '5 000', description: 'Клиент регистрирует карту в мобильном приложении' },
  { id: 2, action: 'P2P пополнение карты', threshold: '', reward: '5 000', description: 'Клиент получает P2P перевод на карту' },
  { id: 3, action: 'Оплата в рознице', threshold: '500 000', reward: '10 000', description: 'Клиент тратит по карте сумму в рознице (POS + ECOM)' },
];

const KPI_ACTIONS = ['Регистрация в Unired Mobile', 'P2P пополнение карты', 'Оплата в рознице', 'Оплата онлайн', 'Снятие наличных'];

function Step2({ batchName, org, cardType, kpiDays, count, kpiSteps, setKpiSteps }: {
  batchName: string; org: string; cardType: string; kpiDays: number; count: number;
  kpiSteps: KpiStep[]; setKpiSteps: (s: KpiStep[]) => void;
}) {
  const [templateHov, setTemplateHov] = useState(false);

  const addStep = () => {
    const nextId = kpiSteps.length > 0 ? Math.max(...kpiSteps.map(s => s.id)) + 1 : 1;
    setKpiSteps([...kpiSteps, { id: nextId, action: '', threshold: '', reward: '', description: '' }]);
  };

  const updateStep = (id: number, field: string, value: string) => {
    setKpiSteps(kpiSteps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeStep = (id: number) => {
    setKpiSteps(kpiSteps.filter(s => s.id !== id));
  };

  const perCard = kpiSteps.reduce((sum, s) => sum + (parseInt(s.reward) || 0), 0);
  const total = perCard * (count || 0);

  return (
    <div>
      {/* Summary strip */}
      <div style={{
        background: '#F9FAFB', border: `1px solid ${C.border}`,
        borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
        fontFamily: F.inter, fontSize: '13px', color: C.text3,
        display: 'flex', gap: '16px', flexWrap: 'wrap',
      }}>
        <span>Партия: <span style={{ color: C.text1, fontWeight: 500 }}>{batchName || '—'}</span></span>
        <span>Организация: <span style={{ color: C.text1, fontWeight: 500 }}>{org || '—'}</span></span>
        <span>Тип: <span style={{ color: C.text1, fontWeight: 500 }}>{cardType}</span></span>
        <span>Срок KPI: <span style={{ color: C.text1, fontWeight: 500 }}>{kpiDays} дней</span></span>
      </div>

      {/* KPI Stepper */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1, margin: 0 }}>
            KPI этапы
          </h3>
          <button
            onMouseEnter={() => setTemplateHov(true)}
            onMouseLeave={() => setTemplateHov(false)}
            onClick={() => setKpiSteps(DEFAULT_KPI)}
            style={{
              border: 'none', background: 'none',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: templateHov ? C.blue : C.text3,
              cursor: 'pointer', padding: '6px 10px', borderRadius: '8px',
              transition: 'color 0.12s, background 0.12s',
              ...(templateHov ? { background: C.blueLt } : {}),
            }}
          >
            Заполнить из шаблона по умолчанию
          </button>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          {/* Vertical line */}
          {kpiSteps.length > 1 && (
            <div style={{
              position: 'absolute', left: '15px', top: '16px',
              bottom: '16px', width: '2px',
              borderLeft: `2px dashed ${C.border}`,
            }} />
          )}

          {kpiSteps.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', gap: '16px' }}>
              {/* Circle */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: C.blue, flexShrink: 0, marginTop: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{i + 1}</span>
              </div>
              {/* Card */}
              <div style={{
                flex: 1, background: C.surface,
                border: `1px solid ${C.blue}`,
                borderRadius: '12px', padding: '20px',
                boxShadow: '0 1px 4px rgba(37,99,235,0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontFamily: F.dm, fontSize: '15px', fontWeight: 600, color: C.text1 }}>Этап {i + 1}</span>
                  <button onClick={() => removeStep(step.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={14} color={C.text4} strokeWidth={1.75} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 20px' }}>
                  <div>
                    <label style={labelStyle}>Действие клиента</label>
                    <div style={{ position: 'relative' }}>
                      <select value={step.action} onChange={e => updateStep(step.id, 'action', e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '36px' }}>
                        <option value="">Выберите действие</option>
                        {KPI_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <ChevronDown size={14} color={C.text3} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Порог (UZS)</label>
                    <input value={step.threshold} onChange={e => updateStep(step.id, 'threshold', e.target.value)} placeholder="Если применимо" style={{ ...inputStyle, fontFamily: F.mono }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Вознаграждение (UZS)</label>
                    <input value={step.reward} onChange={e => updateStep(step.id, 'reward', e.target.value)} placeholder="5 000" style={{ ...inputStyle, fontFamily: F.mono }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Описание</label>
                    <input value={step.description} onChange={e => updateStep(step.id, 'description', e.target.value)} placeholder="Описание этапа" style={inputStyle} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add step */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '32px', flexShrink: 0 }} />
            <button
              onClick={addStep}
              style={{
                flex: 1, height: '48px',
                border: `2px dashed ${C.border}`, borderRadius: '12px',
                background: 'transparent',
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: C.text3, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'border-color 0.12s, color 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text3; }}
            >
              <Plus size={16} strokeWidth={2} />
              Добавить этап
            </button>
          </div>
        </div>
      </div>

      {/* Budget preview */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '20px 24px', marginTop: '16px',
      }}>
        <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1, marginBottom: '12px' }}>
          Бюджет партии
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Этапов: </span>
            <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: C.text1 }}>{kpiSteps.length}</span>
          </div>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>За карту: </span>
            <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: C.text1 }}>{perCard.toLocaleString('ru-RU')} UZS</span>
          </div>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Всего (× {count || 0} карт): </span>
            <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.blue }}>{total.toLocaleString('ru-RU')} UZS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 3 — ИМПОРТ КАРТ
═══════════════════════════════════════════════════════════════════════════ */

function Step3({ importMode, setImportMode }: {
  importMode: 'excel' | 'later'; setImportMode: (m: 'excel' | 'later') => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '24px',
    }}>
      <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1, margin: '0 0 20px' }}>
        Импорт карт
      </h3>

      {/* Radio group */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Excel option */}
        <div>
          <label
            onClick={() => setImportMode('excel')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '12px' }}
          >
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%',
              border: `2px solid ${importMode === 'excel' ? C.blue : C.inputBorder}`,
              background: importMode === 'excel' ? C.blue : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {importMode === 'excel' && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
            </div>
            <span style={{
              fontFamily: F.inter, fontSize: '14px',
              fontWeight: importMode === 'excel' ? 500 : 400,
              color: importMode === 'excel' ? C.text1 : C.text2,
            }}>
              Импортировать из Excel
            </span>
          </label>

          {importMode === 'excel' && (
            <div style={{ marginLeft: '26px' }}>
              {!uploadedFile ? (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault(); setDragOver(false);
                    setUploadedFile({ name: 'batch_april_2026.xlsx', size: '245 KB' });
                  }}
                  style={{
                    border: `2px dashed ${dragOver ? C.blue : C.border}`,
                    borderRadius: '12px', padding: '40px 24px',
                    background: dragOver ? C.blueLt : C.pageBg,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                    transition: 'all 0.15s', cursor: 'pointer',
                  }}
                  onClick={() => setUploadedFile({ name: 'batch_april_2026.xlsx', size: '245 KB' })}
                >
                  <Upload size={40} color={dragOver ? C.blue : C.text4} strokeWidth={1.5} />
                  <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text2 }}>
                    Перетащите файл сюда
                  </div>
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text4 }}>или</span>
                  <div style={{
                    padding: '8px 18px', border: `1px solid ${C.border}`, borderRadius: '8px',
                    fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text2,
                    background: C.surface,
                  }}>
                    Выбрать файл
                  </div>
                  <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>Форматы: .xlsx, .xls, .csv</span>
                </div>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', border: `1px solid ${C.border}`,
                  borderRadius: '10px', background: C.pageBg,
                }}>
                  <FileSpreadsheet size={20} color={C.success} strokeWidth={1.75} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>{uploadedFile.name}</div>
                    <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>{uploadedFile.size}</div>
                  </div>
                  <Check size={16} color={C.success} strokeWidth={2.5} />
                  <button onClick={() => setUploadedFile(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
                    <X size={14} color={C.text4} strokeWidth={1.75} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Later option */}
        <div>
          <label
            onClick={() => setImportMode('later')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%',
              border: `2px solid ${importMode === 'later' ? C.blue : C.inputBorder}`,
              background: importMode === 'later' ? C.blue : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {importMode === 'later' && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
            </div>
            <span style={{
              fontFamily: F.inter, fontSize: '14px',
              fontWeight: importMode === 'later' ? 500 : 400,
              color: importMode === 'later' ? C.text1 : C.text2,
            }}>
              Импортировать позже
            </span>
          </label>
          {importMode === 'later' && (
            <div style={{
              marginLeft: '26px', marginTop: '12px',
              padding: '12px 16px', background: C.pageBg,
              border: `1px solid ${C.border}`, borderRadius: '8px',
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
                Вы сможете импортировать карты позже на странице партии
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUCCESS STATE
═══════════════════════════════════════════════════════════════════════════ */

function SuccessState({ batchName, org, cardType, kpiCount, navigate }: {
  batchName: string; org: string; cardType: string; kpiCount: number; navigate: (p: string) => void;
}) {
  const [primaryHov, setPrimaryHov] = useState(false);
  const [outlineHov, setOutlineHov] = useState(false);
  const [ghostHov, setGhostHov] = useState(false);

  const rows = [
    { label: 'Партия', value: batchName },
    { label: 'Организация', value: org },
    { label: 'Тип карт', value: cardType },
    { label: 'KPI этапов', value: String(kpiCount) },
    { label: 'Карт импортировано', value: '498 из 500' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 32px' }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '40px', width: '560px', maxWidth: '100%',
        textAlign: 'center',
      }}>
        <CheckCircle size={64} color={C.success} strokeWidth={1.5} style={{ marginBottom: '20px' }} />
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: C.text1, marginBottom: '24px' }}>
          Партия успешно создана
        </div>

        {/* Key-value grid */}
        <div style={{
          border: `1px solid ${C.border}`, borderRadius: '10px',
          overflow: 'hidden', marginBottom: '28px', textAlign: 'left',
        }}>
          {rows.map((r, i) => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px',
              borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{r.label}</span>
              <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onMouseEnter={() => setPrimaryHov(true)} onMouseLeave={() => setPrimaryHov(false)}
            onClick={() => navigate('/card-batches')}
            style={{
              height: '40px', padding: '0 20px', border: 'none', borderRadius: '8px',
              background: primaryHov ? C.blueHover : C.blue,
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#fff',
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            Перейти к партии
          </button>
          <button
            onMouseEnter={() => setOutlineHov(true)} onMouseLeave={() => setOutlineHov(false)}
            onClick={() => window.location.reload()}
            style={{
              height: '40px', padding: '0 20px',
              border: `1px solid ${outlineHov ? C.blue : C.border}`, borderRadius: '8px',
              background: outlineHov ? C.blueLt : C.surface,
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: outlineHov ? C.blue : C.text2,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            Создать ещё
          </button>
          <button
            onMouseEnter={() => setGhostHov(true)} onMouseLeave={() => setGhostHov(false)}
            onClick={() => navigate('/card-batches')}
            style={{
              height: '40px', padding: '0 16px', border: 'none',
              background: ghostHov ? '#F3F4F6' : 'none', borderRadius: '8px',
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: ghostHov ? C.text1 : C.text3,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            К списку партий
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NewBatchWizardPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);

  // Step 1 data
  const [step1, setStep1] = useState({
    name: '', org: '', cardType: 'VISA SUM', count: 500, kpiDays: 30, kpiDate: '',
  });

  // Step 2 data
  const [kpiSteps, setKpiSteps] = useState<KpiStep[]>([]);

  // Step 3 data
  const [importMode, setImportMode] = useState<'excel' | 'later'>('excel');

  const [cancelHov, setCancelHov] = useState(false);
  const [nextHov, setNextHov] = useState(false);
  const [backHov, setBackHov] = useState(false);
  const [skipHov, setSkipHov] = useState(false);

  if (success) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
        <Sidebar role="bank" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />
          <SuccessState batchName={step1.name} org={step1.org} cardType={step1.cardType} kpiCount={kpiSteps.length} navigate={navigate} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="bank"
        collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span onClick={() => navigate('/card-batches')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Партии карт</span>
              <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Новая партия</span>
            </div>

            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: '0 0 24px', lineHeight: 1.2 }}>
              Создание партии карт
            </h1>

            <StepIndicator current={step} />

            {/* Step content */}
            {step === 0 && <Step1 data={step1} onChange={setStep1} />}
            {step === 1 && (
              <Step2
                batchName={step1.name} org={step1.org} cardType={step1.cardType}
                kpiDays={step1.kpiDays} count={step1.count}
                kpiSteps={kpiSteps} setKpiSteps={setKpiSteps}
              />
            )}
            {step === 2 && <Step3 importMode={importMode} setImportMode={setImportMode} />}

            <div style={{ height: '80px' }} />
          </div>
        </div>

        {/* Sticky Footer */}
        <div style={{
          flexShrink: 0, background: C.surface, borderTop: `1px solid ${C.border}`,
          padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Left */}
          <div>
            {step > 0 && (
              <button
                onMouseEnter={() => setBackHov(true)} onMouseLeave={() => setBackHov(false)}
                onClick={() => setStep(s => s - 1)}
                style={{
                  border: 'none', background: backHov ? '#F3F4F6' : 'none',
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                  color: backHov ? C.text1 : C.text3,
                  cursor: 'pointer', padding: '8px 12px', borderRadius: '8px',
                  transition: 'all 0.12s',
                }}
              >
                ← Назад
              </button>
            )}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {step === 0 && (
              <button
                onMouseEnter={() => setCancelHov(true)} onMouseLeave={() => setCancelHov(false)}
                onClick={() => navigate('/card-batches')}
                style={{
                  height: '40px', padding: '0 20px',
                  border: `1px solid ${cancelHov ? C.blue : C.border}`, borderRadius: '8px',
                  background: cancelHov ? C.blueLt : C.surface,
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                  color: cancelHov ? C.blue : C.text2,
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                Отмена
              </button>
            )}
            {step === 1 && (
              <button
                onMouseEnter={() => setSkipHov(true)} onMouseLeave={() => setSkipHov(false)}
                onClick={() => setStep(2)}
                style={{
                  height: '40px', padding: '0 20px',
                  border: `1px solid ${skipHov ? C.blue : C.border}`, borderRadius: '8px',
                  background: skipHov ? C.blueLt : C.surface,
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                  color: skipHov ? C.blue : C.text2,
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                Пропустить (настроить позже)
              </button>
            )}
            <button
              onMouseEnter={() => setNextHov(true)} onMouseLeave={() => setNextHov(false)}
              onClick={() => {
                if (step < 2) setStep(s => s + 1);
                else setSuccess(true);
              }}
              style={{
                height: '40px', padding: '0 20px', border: 'none', borderRadius: '8px',
                background: nextHov ? C.blueHover : C.blue,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#fff',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {step === 0 ? 'Далее: KPI настройки →' : step === 1 ? 'Далее: Импорт карт →' : 'Создать партию'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
