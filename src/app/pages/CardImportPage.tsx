import React, { useState, useRef } from 'react';
import {
  ChevronRight, ChevronDown, Upload, Download, X, CheckCircle,
  FileSpreadsheet, AlertTriangle,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

interface UploadedFile {
  name: string;
  size: string;
}

interface ValidationResult {
  total: number;
  valid: number;
  errors: number;
  rows: Array<{
    num: number;
    cardNumber: string;
    type: string;
    status: string;
    isError: boolean;
  }>;
}

const BATCHES = [
  'Партия Апрель 2026 — Mysafar OOO (500 карт)',
  'Партия Апрель 2026 — Unired Marketing (500 карт)',
  'Партия Март 2026 — Express Finance (400 карт)',
  'Партия Март 2026 — Digital Pay (300 карт)',
  'Партия Февраль 2026 — SmartCard Group (500 карт)',
];

const SAMPLE_VALIDATION: ValidationResult = {
  total: 500,
  valid: 498,
  errors: 2,
  rows: [
    { num: 1, cardNumber: '8600 1234 5678 1001', type: 'VISA SUM', status: '✅ OK', isError: false },
    { num: 2, cardNumber: '8600 1234 5678 1002', type: 'VISA SUM', status: '✅ OK', isError: false },
    { num: 3, cardNumber: '8600 1234 5678 1003', type: 'VISA USD', status: '✅ OK', isError: false },
    { num: 4, cardNumber: '8600 1234 5678 1004', type: 'VISA SUM', status: '✅ OK', isError: false },
    { num: 5, cardNumber: '8600 1234 5678 1005', type: 'VISA EUR', status: '✅ OK', isError: false },
    { num: 247, cardNumber: '8600 1234 56__ ____', type: '—', status: '❌ Неверный формат', isError: true },
    { num: 389, cardNumber: '8600 1234 5678 2001', type: 'VISA SUM', status: '❌ Дубликат', isError: true },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   SELECT COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  t,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  t: T;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: F.inter,
        fontSize: '14px',
        fontWeight: 500,
        color: t.text1,
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: '44px',
            border: focused ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`,
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
            boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
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
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DROP ZONE
═══════════════════════════════════════════════════════════════════════════ */

function DropZone({ onFileSelect, t, dark }: { onFileSelect: (file: File) => void; t: T; dark: boolean }) {
  const [dragOver, setDragOver] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const idleBg = dark ? D.tableAlt : '#FAFBFC';

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      style={{
        border: dragOver ? `2px dashed ${t.blue}` : `2px dashed ${t.inputBorder}`,
        borderRadius: '12px',
        background: dragOver ? t.blueLt : idleBg,
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        transition: 'all 0.15s',
        cursor: 'pointer',
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload size={24} color={dragOver ? t.blue : t.text4} strokeWidth={1.5} />

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: F.inter,
          fontSize: '14px',
          fontWeight: 500,
          color: t.text2,
          marginBottom: '4px',
        }}>
          Перетащите Excel файл сюда
        </div>
        <div style={{
          fontFamily: F.inter,
          fontSize: '13px',
          color: t.text4,
          marginBottom: '8px',
        }}>
          или
        </div>
      </div>

      <button
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
        onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
        style={{
          height: '36px',
          padding: '0 18px',
          border: `1px solid ${buttonHover ? t.blue : t.border}`,
          borderRadius: '7px',
          background: buttonHover ? t.blueLt : t.surface,
          fontFamily: F.inter,
          fontSize: '13px',
          fontWeight: 500,
          color: buttonHover ? t.blue : t.text2,
          cursor: 'pointer',
          transition: 'all 0.12s',
        }}
      >
        Выбрать файл
      </button>

      <div style={{
        fontFamily: F.inter,
        fontSize: '12px',
        color: t.text4,
      }}>
        Форматы: .xlsx, .xls, .csv
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   UPLOADED FILE ROW
═══════════════════════════════════════════════════════════════════════════ */

function UploadedFileRow({ file, onRemove, t, dark }: { file: UploadedFile; onRemove: () => void; t: T; dark: boolean }) {
  const [removeHover, setRemoveHover] = useState(false);

  const rowBg       = dark ? D.tableAlt : '#FAFBFC';
  const successIcon = dark ? '#34D399' : C.success;
  const successBg   = dark ? 'rgba(52,211,153,0.12)' : C.successBg;
  const successText = dark ? '#34D399' : '#15803D';
  const successBorder = dark ? 'transparent' : '#BBF7D0';
  const successDot  = dark ? '#34D399' : C.success;
  const errorColor  = dark ? D.error : C.error;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      background: rowBg,
      border: `1px solid ${t.border}`,
      borderRadius: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <FileSpreadsheet size={20} color={successIcon} strokeWidth={1.75} style={{ flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: t.text1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            📎 {file.name}
          </div>
          <div style={{
            fontFamily: F.inter,
            fontSize: '12px',
            color: t.text4,
            marginTop: '2px',
          }}>
            {file.size}
          </div>
        </div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: F.inter,
          fontSize: '12px',
          fontWeight: 500,
          padding: '3px 10px',
          borderRadius: '10px',
          background: successBg,
          color: successText,
          border: `1px solid ${successBorder}`,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: successDot, flexShrink: 0 }} />
          Загружен
        </span>
      </div>

      <button
        onMouseEnter={() => setRemoveHover(true)}
        onMouseLeave={() => setRemoveHover(false)}
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: F.inter,
          fontSize: '13px',
          color: removeHover ? errorColor : t.text3,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '6px',
          transition: 'color 0.12s',
          marginLeft: '12px',
          flexShrink: 0,
        }}
      >
        <X size={14} strokeWidth={2} />
        Удалить
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT PILLS
═══════════════════════════════════════════════════════════════════════════ */

function StatPill({ label, value, variant, t, dark }: {
  label: string; value: number; variant: 'neutral' | 'success' | 'error';
  t: T; dark: boolean;
}) {
  const colorsLight = {
    neutral: { bg: '#F3F4F6',    color: C.text2,   border: C.border },
    success: { bg: C.successBg,  color: '#15803D', border: '#BBF7D0' },
    error:   { bg: C.errorBg,    color: '#DC2626', border: '#FECACA' },
  };
  const colorsDark = {
    neutral: { bg: 'transparent',              color: D.text2,   border: D.border },
    success: { bg: 'rgba(52,211,153,0.12)',    color: '#34D399', border: 'transparent' },
    error:   { bg: 'rgba(248,113,113,0.12)',   color: '#F87171', border: 'transparent' },
  };

  const cfg = (dark ? colorsDark : colorsLight)[variant];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      borderRadius: '10px',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
    }}>
      <span style={{
        fontFamily: F.inter,
        fontSize: '13px',
        color: t.text3,
      }}>
        {label}:
      </span>
      <span style={{
        fontFamily: F.mono,
        fontSize: '14px',
        fontWeight: 600,
        color: cfg.color,
      }}>
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VALIDATION PREVIEW TABLE
═══════════════════════════════════════════════════════════════════════════ */

function ValidationTable({ data, t, dark }: { data: ValidationResult; t: T; dark: boolean }) {
  const headerBg  = dark ? D.tableHeaderBg : '#FAFBFC';
  const errorRowBg = dark ? 'rgba(248,113,113,0.10)' : '#FEF2F2';
  const errorColor = dark ? '#F87171' : C.error;
  const successColor = dark ? '#34D399' : C.success;

  return (
    <div style={{
      border: `1px solid ${t.border}`,
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr 140px 200px',
        background: headerBg,
        borderBottom: `1px solid ${t.border}`,
        padding: '10px 16px',
        gap: '12px',
      }}>
        <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          #
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Номер карты
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Тип
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Статус валидации
        </div>
      </div>

      {data.rows.map((row, idx) => (
        <div
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr 140px 200px',
            padding: '12px 16px',
            gap: '12px',
            borderBottom: idx < data.rows.length - 1 ? `1px solid ${t.border}` : 'none',
            background: row.isError ? errorRowBg : t.surface,
          }}
        >
          <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
            {row.num}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', color: row.isError ? t.text3 : t.text1 }}>
            {row.cardNumber}
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
            {row.type}
          </div>
          <div style={{
            fontFamily: F.inter,
            fontSize: '13px',
            color: row.isError ? errorColor : successColor,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {row.status}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUCCESS VIEW
═══════════════════════════════════════════════════════════════════════════ */

function SuccessView({ validCount, errorCount, batchName, onViewBatch, onImportMore, t, dark }: {
  validCount: number;
  errorCount: number;
  batchName: string;
  onViewBatch: () => void;
  onImportMore: () => void;
  t: T; dark: boolean;
}) {
  const [viewHover, setViewHover] = useState(false);
  const [moreHover, setMoreHover] = useState(false);

  const successColor = dark ? '#34D399' : C.success;
  const errorColor   = dark ? '#F87171' : C.error;
  const moreHoverBg  = dark ? D.tableHover : '#F9FAFB';

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '64px 48px',
      textAlign: 'center',
      maxWidth: '560px',
      margin: '0 auto',
    }}>
      <CheckCircle
        size={64}
        color={successColor}
        strokeWidth={1.5}
        style={{ marginBottom: '24px' }}
      />

      <div style={{
        fontFamily: F.dm,
        fontSize: '20px',
        fontWeight: 600,
        color: t.text1,
        marginBottom: '8px',
      }}>
        {validCount} карт успешно импортированы
      </div>

      <div style={{
        fontFamily: F.inter,
        fontSize: '14px',
        color: t.text2,
        marginBottom: '4px',
      }}>
        Партия: {batchName}
      </div>

      {errorCount > 0 && (
        <div style={{
          fontFamily: F.inter,
          fontSize: '13px',
          color: errorColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '12px',
        }}>
          <AlertTriangle size={14} />
          {errorCount} карты пропущены из-за ошибок
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginTop: '32px',
      }}>
        <button
          onMouseEnter={() => setViewHover(true)}
          onMouseLeave={() => setViewHover(false)}
          onClick={onViewBatch}
          style={{
            height: '44px',
            padding: '0 24px',
            border: 'none',
            borderRadius: '8px',
            background: viewHover ? t.blueHover : t.blue,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.12s',
            boxShadow: viewHover ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
          }}
        >
          Перейти к партии
        </button>

        <button
          onMouseEnter={() => setMoreHover(true)}
          onMouseLeave={() => setMoreHover(false)}
          onClick={onImportMore}
          style={{
            height: '44px',
            padding: '0 24px',
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
            background: moreHover ? moreHoverBg : t.surface,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: t.text2,
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          Импортировать ещё
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function CardImportPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const [selectedBatch, setSelectedBatch] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [validationData, setValidationData] = useState<ValidationResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [downloadHover, setDownloadHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [importHover, setImportHover] = useState(false);

  const handleFileSelect = (file: File) => {
    setUploadedFile({
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
    });
    setTimeout(() => {
      setValidationData(SAMPLE_VALIDATION);
    }, 500);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setValidationData(null);
  };

  const handleImport = () => {
    setShowSuccess(true);
  };

  const handleImportMore = () => {
    setShowSuccess(false);
    setSelectedBatch('');
    setUploadedFile(null);
    setValidationData(null);
  };

  const subtleHoverBg = dark ? D.tableHover : '#F9FAFB';

  if (showSuccess) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
        <Sidebar role="bank"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(d => !d)}
        />

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

          <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
            <SuccessView
              validCount={validationData?.valid || 498}
              errorCount={validationData?.errors || 2}
              batchName={selectedBatch}
              onViewBatch={() => alert('Переход к партии')}
              onImportMore={handleImportMore}
              t={t} dark={dark}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/card-batches')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Партии карт</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Импорт карт</span>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              Импорт карт
            </h1>
            <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
              Загрузите Excel файл с номерами карт для добавления в партию
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: '12px',
              padding: '24px',
            }}>
              <SelectInput
                label="Выберите партию"
                value={selectedBatch}
                onChange={setSelectedBatch}
                options={BATCHES}
                placeholder="Выберите партию для импорта"
                t={t}
              />
            </div>

            {selectedBatch && (
              <div style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '24px',
              }}>
                <DropZone onFileSelect={handleFileSelect} t={t} dark={dark} />
              </div>
            )}

            {uploadedFile && validationData && (
              <div style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}>
                <UploadedFileRow file={uploadedFile} onRemove={handleRemoveFile} t={t} dark={dark} />

                <div style={{ height: '1px', background: t.border }} />

                <div style={{
                  fontFamily: F.dm,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: t.text1,
                }}>
                  Предварительный просмотр
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <StatPill label="Найдено карт" value={validationData.total} variant="neutral" t={t} dark={dark} />
                  <StatPill label="Валидных" value={validationData.valid} variant="success" t={t} dark={dark} />
                  <StatPill label="С ошибками" value={validationData.errors} variant="error" t={t} dark={dark} />
                </div>

                <ValidationTable data={validationData} t={t} dark={dark} />
              </div>
            )}

            {uploadedFile && validationData && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}>
                <button
                  onMouseEnter={() => setDownloadHover(true)}
                  onMouseLeave={() => setDownloadHover(false)}
                  style={{
                    height: '40px',
                    padding: '0 18px',
                    border: `1px solid ${t.border}`,
                    borderRadius: '8px',
                    background: downloadHover ? subtleHoverBg : t.surface,
                    fontFamily: F.inter,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: downloadHover ? t.blue : t.text2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.12s',
                  }}
                >
                  <Download size={16} strokeWidth={1.75} />
                  Скачать шаблон Excel
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onMouseEnter={() => setCancelHover(true)}
                    onMouseLeave={() => setCancelHover(false)}
                    onClick={handleRemoveFile}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: `1px solid ${t.border}`,
                      borderRadius: '8px',
                      background: cancelHover ? subtleHoverBg : t.surface,
                      fontFamily: F.inter,
                      fontSize: '14px',
                      fontWeight: 500,
                      color: t.text2,
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                    }}
                  >
                    Отмена
                  </button>

                  <button
                    onMouseEnter={() => setImportHover(true)}
                    onMouseLeave={() => setImportHover(false)}
                    onClick={handleImport}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: 'none',
                      borderRadius: '8px',
                      background: importHover ? t.blueHover : t.blue,
                      fontFamily: F.inter,
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      boxShadow: importHover ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
                    }}
                  >
                    Импортировать {validationData.valid} карт
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
