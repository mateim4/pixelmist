import { forwardRef, Fragment, useMemo } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { CodeBlock } from './CodeBlock';
import { Link } from './Link';

/**
 * Minimal markdown renderer for chat messages: fenced code blocks (via CodeBlock),
 * unordered/ordered lists, links, inline code, bold, italic, paragraphs.
 * No raw HTML — everything is rendered as text/element nodes, never dangerouslySetInnerHTML.
 */

interface InlinePart {
  text?: string;
  code?: string;
  bold?: string;
  italic?: string;
  link?: { text: string; href: string };
}

function parseInline(line: string): InlinePart[] {
  const parts: InlinePart[] = [];
  // order: code spans, links, bold, italic — single pass with a combined regex
  const re = /(`[^`]+`)|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push({ text: line.slice(last, m.index) });
    if (m[1]) parts.push({ code: m[1].slice(1, -1) });
    else if (m[2]) parts.push({ link: { text: m[3]!, href: m[4]! } });
    else if (m[5]) parts.push({ bold: m[6]! });
    else if (m[7]) parts.push({ italic: m[8]! });
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push({ text: line.slice(last) });
  return parts;
}

function renderInline(parts: InlinePart[], keyPrefix: string): ReactNode[] {
  return parts.map((p, i) => {
    const key = `${keyPrefix}-${i}`;
    if (p.code !== undefined) return <code key={key} className="pm-md__code">{p.code}</code>;
    if (p.link) return <Link key={key} href={p.link.href} external>{p.link.text}</Link>;
    if (p.bold !== undefined) return <strong key={key}>{p.bold}</strong>;
    if (p.italic !== undefined) return <em key={key}>{p.italic}</em>;
    return <Fragment key={key}>{p.text}</Fragment>;
  });
}

export interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
  source: string;
}

/** Renders a markdown subset safely (no raw HTML). forwardRef + pass-through. */
export const Markdown = forwardRef(function Markdown({ source, className, ...rest }: MarkdownProps, ref: Ref<HTMLDivElement>) {
  const nodes = useMemo(() => {
    const out: ReactNode[] = [];
    const lines = source.split('\n');
    let i = 0;
    let para: string[] = [];
    let list: { ordered: boolean; items: string[] } | null = null;
    const flushPara = () => {
      if (para.length) {
        out.push(
          <p key={`p-${out.length}`} className="pm-md__p">
            {renderInline(parseInline(para.join(' ')), `p${out.length}`)}
          </p>,
        );
        para = [];
      }
    };
    const flushList = () => {
      if (list) {
        const Tag = list.ordered ? 'ol' : 'ul';
        out.push(
          <Tag key={`l-${out.length}`} className="pm-md__list">
            {list.items.map((item, idx) => (
              <li key={idx}>{renderInline(parseInline(item), `li${out.length}-${idx}`)}</li>
            ))}
          </Tag>,
        );
        list = null;
      }
    };
    while (i < lines.length) {
      const line = lines[i]!;
      const fence = line.match(/^```(\w*)\s*$/);
      if (fence) {
        flushPara();
        flushList();
        const lang = fence[1] ?? '';
        const buf: string[] = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i]!)) {
          buf.push(lines[i]!);
          i++;
        }
        i++; // closing fence
        out.push(<CodeBlock key={`c-${out.length}`} title={lang || 'code'} code={buf.join('\n')} />);
        continue;
      }
      const ul = line.match(/^\s*[-*]\s+(.*)$/);
      const ol = line.match(/^\s*\d+\.\s+(.*)$/);
      if (ul || ol) {
        flushPara();
        const item = (ul ?? ol)![1]!;
        if (!list || list.ordered !== Boolean(ol)) {
          flushList();
          list = { ordered: Boolean(ol), items: [item] };
        } else list.items.push(item);
        i++;
        continue;
      }
      if (line.trim() === '') {
        flushPara();
        flushList();
        i++;
        continue;
      }
      flushList();
      para.push(line);
      i++;
    }
    flushPara();
    flushList();
    return out;
  }, [source]);

  return (
    <div ref={ref} className={cx('pm-md', className)} {...rest}>
      {nodes}
    </div>
  );
});
