import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, X, Download } from 'lucide-react';
import { F, C } from './ds/tokens';

/* ═══════════════════════════════════════════════════════════════════════════
   useExportToast — shared processing → success/error toast for export flows
═══════════════════════════════════════════════════════════════════════════ */

type Phase = 'idle' | 'processing' | 'success' | 'error';

interface StartParams {
  /** Optional title override; defaults differ per phase. */
  title?: string;
  /** Caption shown while processing, e.g. "Отчёт по организациям за 01.04–13.04.2026". */
  subtitle?: string;
  /** File name shown in the success toast. */
  fileName?: string;
  /** File size shown in the success toast, e.g. "245 KB". */
  fileSize?: string;
  /** Force the flow to resolve to error instead of success. */
  shouldError?: boolean;
  /** Processing delay in ms (default 1500). */
  delayMs?: number;
}

export function useExportToast() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [params, setParams] = useState<StartParams | null>(null);
  const timerRef = useRef<number | null>(null);
  const autoDismissRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null; }
    if (autoDismissRef.current) { window.clearTimeout(autoDismissRef.current); autoDismissRef.current = null; }
  };

  const close = useCallback(() => {
    clearTimers();
    setPhase('idle');
  }, []);

  const start = useCallback((p: StartParams) => {
    clearTimers();
    setParams(p);
    setPhase('processing');
    timerRef.current = window.setTimeout(() => {
      setPhase(p.shouldError ? 'error' : 'success');
      if (!p.shouldError) {
        autoDismissRef.current = window.setTimeout(() => setPhase('idle'), 8000);
      }
    }, p.delayMs ?? 1500);
  }, []);

  const retry = useCallback(() => {
    if (!params) return;
    start({ ...params, shouldError: false });
  }, [params, start]);

  useEffect(() => () => clearTimers(), []);

  const node = phase === 'idle' || !params ? null : (
    <ExportToast
      phase={phase}
      params={params}
      onClose={close}
      onRetry={retry}
    />
  );

  return { start, close, node };
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOAST VIEW
═══════════════════════════════════════════════════════════════════════════ */

function ExportToast({ phase, params, onClose, onRetry }: {
  phase: Phase;
  params: StartParams;
  onClose: () => void;
  onRetry: () => void;
}) {
  if (phase === 'idle') return null;

  const cfg = {
    processing: {
      border: C.blue,
      bg: C.blueLt,
      ring: C.blueTint,
      iconColor: C.blue,
      title: params.title ?? 'Формирование отчёта...',
      sub: params.subtitle,
    },
    success: {
      border: C.success,
      bg: C.successBg,
      ring: '#BBF7D0',
      iconColor: C.success,
      title: params.title ?? 'Отчёт готов',
      sub: params.fileName && params.fileSize
        ? `${params.fileName} (${params.fileSize})`
        : params.fileName ?? params.subtitle,
    },
    error: {
      border: C.error,
      bg: C.errorBg,
      ring: '#FECACA',
      iconColor: C.error,
      title: params.title ?? 'Ошибка экспорта',
      sub: params.subtitle ?? 'Не удалось сформировать отчёт. Попробуйте снова.',
    },
  }[phase];

  return (
    <div
      role={phase === 'error' ? 'alert' : 'status'}
      aria-live={phase === 'error' ? 'assertive' : 'polite'}
      style={{
        position: 'fixed', top: '24px', right: '24px',
        width: '360px', maxWidth: 'calc(100vw - 48px)',
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderRight: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        borderLeft: `3px solid ${cfg.border}`,
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
        zIndex: 300,
        animation: 'exportToastIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes exportToastIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes exportSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* Icon */}
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: cfg.bg, border: `1px solid ${cfg.ring}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        {phase === 'processing' && (
          <div style={{ animation: 'exportSpin 0.9s linear infinite', display: 'inline-flex' }}>
            <Loader2 size={13} color={cfg.iconColor} strokeWidth={2} />
          </div>
        )}
        {phase === 'success' && <CheckCircle2 size={14} color={cfg.iconColor} strokeWidth={2} />}
        {phase === 'error'   && <XCircle      size={14} color={cfg.iconColor} strokeWidth={2} />}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 600,
          color: C.text1, lineHeight: 1.4,
        }}>
          {cfg.title}
        </div>
        {cfg.sub && (
          <div style={{
            fontFamily: phase === 'success' && params.fileName ? F.mono : F.inter,
            fontSize: '12px', color: C.text3,
            marginTop: '3px', lineHeight: 1.45,
            wordBreak: 'break-all',
          }}>
            {cfg.sub}
          </div>
        )}

        {/* Action buttons */}
        {phase === 'success' && (
          <ToastGhostAction
            label="Скачать"
            icon={Download}
            onClick={onClose}
          />
        )}
        {phase === 'error' && (
          <ToastGhostAction
            label="Повторить"
            onClick={onRetry}
          />
        )}
      </div>

      {/* Close X — hidden during processing */}
      {phase !== 'processing' && (
        <CloseBtn onClick={onClose} />
      )}
    </div>
  );
}

function ToastGhostAction({ label, icon: Icon, onClick }: {
  label: string; icon?: React.ElementType; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        marginTop: '8px',
        height: '28px', padding: '0 8px',
        border: 'none', borderRadius: '6px',
        background: hov ? C.blueLt : 'transparent',
        fontFamily: F.inter, fontSize: '12px', fontWeight: 600,
        color: C.blue,
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        cursor: 'pointer', transition: 'background 0.12s',
      }}
    >
      {Icon && <Icon size={12} strokeWidth={2} />}
      {label}
    </button>
  );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      aria-label="Закрыть"
      style={{
        width: '22px', height: '22px',
        border: 'none', borderRadius: '5px',
        background: hov ? '#F3F4F6' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.12s',
      }}
    >
      <X size={13} color={C.text4} strokeWidth={1.75} />
    </button>
  );
}
