import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';

export interface DiffLine {
  type: 'add' | 'del' | 'ctx';
  text: string;
}
export interface DiffViewProps {
  lines: DiffLine[];
}

export function DiffView({ lines }: DiffViewProps) {
  const { resolved: t } = useTheme();
  const bg = { add: 'rgba(63,185,124,0.16)', del: 'rgba(255,90,69,0.14)', ctx: 'transparent' } as const;
  const fg = { add: '#8fd6a8', del: '#ff9c8f', ctx: 'rgba(242,241,236,0.8)' } as const;
  return (
    <View style={{ backgroundColor: t.color.bg.code, borderRadius: t.radius.md, paddingVertical: space(t, 'sm') }}>
      {lines.map((l, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            gap: space(t, 'sm'),
            paddingHorizontal: space(t, 'md'),
            backgroundColor: bg[l.type],
          }}
        >
          <Text variant="code-md" style={{ color: fg[l.type], width: 12 }}>
            {l.type === 'add' ? '+' : l.type === 'del' ? '−' : ' '}
          </Text>
          <Text variant="code-md" style={{ color: fg[l.type], flex: 1 }}>
            {l.text || ' '}
          </Text>
        </View>
      ))}
    </View>
  );
}
