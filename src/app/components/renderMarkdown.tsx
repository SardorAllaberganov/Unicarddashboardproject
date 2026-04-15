import React, { useState } from 'react';
import { Bold, Italic, List } from 'lucide-react';
import { F, C } from './ds/tokens';

/* ═══════════════════════════════════════════════════════════════════════════
   renderMarkdown — markdown-lite renderer for announcement / message bodies.
   Grammar:
     **bold**        → <strong>
     _italic_        → <em>
     lines "- x"     → <ul><li>x</li></ul> (consecutive bullet lines merge)
     lines "• x"     → same
     blank line      → paragraph break
     single \n       → <br> within a block
   No dangerouslySetInnerHTML — output is pure React nodes.
═══════════════════════════════════════════════════════════════════════════ */

export function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');

  // Group consecutive non-blank lines into blocks; bullet runs into their own block
  type Block =
    | { kind: 'list'; items: string[] }
    | { kind: 'para'; lines: string[] };

  const blocks: Block[] = [];
  let bufferPara: string[] = [];

  const flushPara = () => {
    if (bufferPara.length > 0) {
      blocks.push({ kind: 'para', lines: bufferPara });
      bufferPara = [];
    }
  };

  for (const raw of lines) {
    const line = raw;
    const trimmed = line.trim();

    const bulletMatch = trimmed.match(/^[-•*]\s+(.*)$/);

    if (trimmed === '') {
      flushPara();
      continue;
    }

    if (bulletMatch) {
      // Ensure the previous block is a list or open a new one
      flushPara();
      const last = blocks[blocks.length - 1];
      if (last && last.kind === 'list') {
        last.items.push(bulletMatch[1]);
      } else {
        blocks.push({ kind: 'list', items: [bulletMatch[1]] });
      }
      continue;
    }

    bufferPara.push(line);
  }
  flushPara();

  return blocks.map((b, bi) => {
    if (b.kind === 'list') {
      return (
        <ul
          key={bi}
          style={{
            margin: bi === 0 ? '0 0 8px' : '8px 0',
            paddingLeft: '18px',
            listStyle: 'disc',
            fontFamily: F.inter, fontSize: '13px', color: C.text2,
            lineHeight: 1.5,
          }}
        >
          {b.items.map((item, ii) => (
            <li key={ii} style={{ marginBottom: '3px' }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p
        key={bi}
        style={{
          margin: bi === 0 ? '0 0 8px' : '8px 0',
          fontFamily: F.inter, fontSize: '13px', color: C.text2,
          lineHeight: 1.5,
        }}
      >
        {b.lines.map((l, li) => (
          <React.Fragment key={li}>
            {li > 0 && <br />}
            {renderInline(l)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

/**
 * Tokenises `**bold**` + `_italic_` inside a single line. Plain text falls
 * through. Non-terminated delimiters are treated as literal characters.
 */
function renderInline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*([^*\n]+?)\*\*|_([^_\n]+?)_/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <React.Fragment key={key++}>
          {text.slice(lastIndex, match.index)}
        </React.Fragment>
      );
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++} style={{ fontWeight: 600 }}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key++} style={{ fontStyle: 'italic' }}>{match[2]}</em>);
    }
    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(<React.Fragment key={key++}>{text.slice(lastIndex)}</React.Fragment>);
  }

  return nodes;
}

/* ═══════════════════════════════════════════════════════════════════════════
   FormatToolbar — Bold / Italic / Bullet list
═══════════════════════════════════════════════════════════════════════════ */

export interface FormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
}

export function FormatToolbar({ textareaRef, value, onChange }: FormatToolbarProps) {
  const wrap = (before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const placeholder = 'текст';
    const inner = selected !== '' ? selected : placeholder;
    const next = value.slice(0, start) + before + inner + after + value.slice(end);
    onChange(next);

    window.setTimeout(() => {
      ta.focus();
      const selStart = start + before.length;
      const selEnd = selStart + inner.length;
      ta.setSelectionRange(selStart, selEnd);
    }, 0);
  };

  const toggleBullets = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    // Expand to full lines
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEndRaw = value.indexOf('\n', end);
    const lineEnd = lineEndRaw === -1 ? value.length : lineEndRaw;

    const block = value.slice(lineStart, lineEnd);
    const blockLines = block.split('\n');

    const hasPrefix = (l: string) => /^[-•*]\s+/.test(l);
    const allHavePrefix = blockLines.every(l => l.trim() === '' || hasPrefix(l));

    const transformed = blockLines
      .map(l => {
        if (l.trim() === '') return l;
        if (allHavePrefix) return l.replace(/^[-•*]\s+/, '');
        return hasPrefix(l) ? l : `• ${l}`;
      })
      .join('\n');

    const next = value.slice(0, lineStart) + transformed + value.slice(lineEnd);
    onChange(next);

    window.setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(lineStart, lineStart + transformed.length);
    }, 0);
  };

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '2px',
      padding: '4px',
      border: `1px solid ${C.border}`,
      borderRadius: '8px',
      background: C.surface,
      marginBottom: '8px',
    }}>
      <ToolbarBtn icon={Bold} label="Полужирный" onClick={() => wrap('**', '**')} />
      <ToolbarBtn icon={Italic} label="Курсив" onClick={() => wrap('_', '_')} />
      <div style={{ width: '1px', height: '18px', background: C.border, margin: '0 2px' }} />
      <ToolbarBtn icon={List} label="Список" onClick={toggleBullets} />
    </div>
  );
}

function ToolbarBtn({ icon: Icon, label, onClick }: {
  icon: React.ElementType; label: string; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onClick={onClick}
      style={{
        width: '28px', height: '26px',
        border: 'none', borderRadius: '6px',
        background: active ? C.blueTint : (hov ? C.blueLt : 'transparent'),
        color: active || hov ? C.blue : C.text3,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.1s',
      }}
    >
      <Icon size={14} strokeWidth={2} />
    </button>
  );
}
