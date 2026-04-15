import React, { useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { FormatToolbar, renderMarkdown } from '../components/renderMarkdown';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MARKDOWN + FORMAT TOOLBAR SHOWCASE
   Compose (toolbar + textarea) + rendered preview in both light and dark.
   Content matches the S-04 seller message example.
═══════════════════════════════════════════════════════════════════════════ */

const SAMPLE_BODY = `**Акция апреля!**

Продайте 10+ карт за неделю — получите **бонус 50 000 UZS** сверх стандартных KPI.

Условия участия:
- Активны в системе _не менее 30 дней_
- KPI 1 выполнен по всем текущим картам
- Продажи учитываются с **15.04.2026**

Подробности у менеджера организации.`;

const SAMPLE_TITLE = 'Акция апреля — бонус за продажи';

export default function MarkdownShowcasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const navigate = useNavigate();

  const [body, setBody] = useState(SAMPLE_BODY);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar
        role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span
              onClick={() => navigate('/design-system')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}
            >
              Дизайн-система
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Markdown</span>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
            Markdown renderer + FormatToolbar
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '6px 0 24px', lineHeight: 1.5 }}>
            Used in M-03 (announcements), N-01 (seller messages), Q-02 и S-04. Grammar: <code style={inlineCode(t)}>**bold**</code>,{' '}
            <code style={inlineCode(t)}>_italic_</code>, lines starting with <code style={inlineCode(t)}>-</code>/<code style={inlineCode(t)}>•</code> form bullet lists.
          </p>

          {/* Compose + preview (follows global theme) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <Column
              role="compose"
              dark={darkMode}
              body={body}
              onBodyChange={setBody}
              textareaRef={textareaRef}
              pageT={t}
            />
            <Column
              role="preview"
              dark={darkMode}
              body={body}
              onBodyChange={setBody}
              textareaRef={textareaRef}
              pageT={t}
            />
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COLUMN — one theme variant, compose above preview
═══════════════════════════════════════════════════════════════════════════ */

function Column({
  role, dark, body, onBodyChange, textareaRef, pageT,
}: {
  role: 'compose' | 'preview';
  dark: boolean;
  body: string;
  onBodyChange: (v: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  pageT: T;
}) {
  const surfaceBg  = pageT.surface;
  const cardBorder = pageT.border;
  const headerBg   = pageT.tableHeaderBg;
  const hdrClr     = pageT.text3;

  return (
    <div style={{
      background: surfaceBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 14px',
        background: headerBg,
        borderBottom: `1px solid ${cardBorder}`,
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: hdrClr, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {role === 'compose' ? 'Compose — toolbar + textarea' : 'Rendered preview'}
      </div>

      {role === 'compose' ? (
        <div style={{ padding: '16px' }}>
          <FormatToolbar
            dark={dark}
            textareaRef={textareaRef}
            value={body}
            onChange={onBodyChange}
          />
          <ThemedTextarea
            ref={textareaRef}
            value={body}
            onChange={onBodyChange}
            dark={dark}
          />
        </div>
      ) : (
        <div style={{ padding: '16px' }}>
          <div style={{
            fontFamily: F.dm, fontSize: '15px', fontWeight: 700,
            color: pageT.text1, marginBottom: '10px',
          }}>
            {SAMPLE_TITLE}
          </div>
          {renderMarkdown(body, dark)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEMED TEXTAREA — matches spec exactly
═══════════════════════════════════════════════════════════════════════════ */

const ThemedTextarea = React.forwardRef<HTMLTextAreaElement, {
  value: string;
  onChange: (v: string) => void;
  dark: boolean;
}>(function ThemedTextarea({ value, onChange, dark }, ref) {
  const [focused, setFocused] = useState(false);
  const styleId = dark ? 'md-ta-dark-ph' : 'md-ta-light-ph';

  // Inject ::placeholder rules once per theme (inline styles can't address ::placeholder).
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(styleId)) return;
    const el = document.createElement('style');
    el.id = styleId;
    el.textContent = dark
      ? `.md-ta-dark::placeholder  { color: ${D.text4}; opacity: 1; }`
      : `.md-ta-light::placeholder { color: ${C.text4}; opacity: 1; }`;
    document.head.appendChild(el);
  }, [dark, styleId]);

  const border = focused
    ? `1px solid ${dark ? D.blue : C.blue}`
    : `1px solid ${dark ? D.border : C.inputBorder}`;
  const ring = focused
    ? `0 0 0 3px ${dark ? D.focusRing : C.focusRing}`
    : 'none';

  return (
    <textarea
      ref={ref}
      className={dark ? 'md-ta-dark' : 'md-ta-light'}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder="Введите текст сообщения…"
      rows={9}
      style={{
        width: '100%',
        padding: '10px 12px',
        border,
        borderRadius: '8px',
        background: dark ? D.surface : C.surface,
        fontFamily: F.inter, fontSize: '13px',
        color: dark ? D.text1 : C.text1,
        lineHeight: 1.5,
        outline: 'none',
        boxShadow: ring,
        resize: 'vertical',
        transition: 'border-color 0.12s, box-shadow 0.12s',
        boxSizing: 'border-box',
      }}
    />
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function inlineCode(t: T): React.CSSProperties {
  return {
    fontFamily: F.mono, fontSize: '11px',
    padding: '1px 6px', borderRadius: '4px',
    background: t.surface, border: `1px solid ${t.border}`,
    color: t.text1,
  };
}
