import { forwardRef, Fragment, useMemo } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Link } from './Link';
import { CodeBlock } from './CodeBlock';

/**
 * Native markdown renderer — same subset as web: fenced code blocks (CodeBlock), lists,
 * links, inline code, bold, italic, paragraphs. No raw HTML (RN Text never renders HTML).
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

function Inline({ parts }: { parts: InlinePart[] }) {
  const { resolved: t } = useTheme();
  return (
    <Text variant="body-md">
      {parts.map((p, i) => {
        if (p.code !== undefined)
          return (
            <Text key={i} variant="code-md" style={{ backgroundColor: t.color.bg.surface, borderRadius: t.radius.xs }}>
              {p.code}
            </Text>
          );
        if (p.link) return <Link key={i} href={p.link.href} external>{p.link.text}</Link>;
        if (p.bold !== undefined) return <Text key={i} variant="body-md" style={{ fontWeight: '700' }}>{p.bold}</Text>;
        if (p.italic !== undefined) return <Text key={i} variant="body-md" style={{ fontStyle: 'italic' }}>{p.italic}</Text>;
        return <Fragment key={i}>{p.text}</Fragment>;
      })}
    </Text>
  );
}

export interface MarkdownProps extends ViewProps {
  source: string;
}

/** Renders the markdown subset on native. */
export const Markdown = forwardRef<View, MarkdownProps>(function Markdown({ source, style, ...rest }: MarkdownProps, ref) {
  const { resolved: t } = useTheme();
  const nodes = useMemo(() => {
    const out: ReactNode[] = [];
    const lines = source.split('\n');
    let i = 0;
    let para: string[] = [];
    let list: { ordered: boolean; items: string[] } | null = null;
    const flushPara = () => {
      if (para.length) {
        out.push(
          <View key={`p-${out.length}`} style={{ marginBottom: space(t, 'xs') }}>
            <Inline parts={parseInline(para.join(' '))} />
          </View>,
        );
        para = [];
      }
    };
    const flushList = () => {
      if (list) {
        out.push(
          <View key={`l-${out.length}`} style={{ marginBottom: space(t, 'xs'), paddingLeft: space(t, 'lg'), gap: 2 }}>
            {list.items.map((item, idx) => (
              <Inline key={idx} parts={parseInline(`${list!.ordered ? `${idx + 1}.` : '•'} ${item}`)} />
            ))}
          </View>,
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
        const buf: string[] = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i]!)) {
          buf.push(lines[i]!);
          i++;
        }
        i++;
        out.push(<CodeBlock key={`c-${out.length}`} title={fence[1] || 'code'} code={buf.join('\n')} />);
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
  }, [source, t]);
  return (
    <View ref={ref} style={style} {...rest}>
      {nodes}
    </View>
  );
});
