import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';

export interface CodeBlockProps extends ViewProps {
  title?: string;
  code?: string;
  children?: string;
}

/** Dark terminal panel (#1C1C1E) with header — the Vibe look, on native. */
export const CodeBlock = forwardRef<View, CodeBlockProps>(function CodeBlock({ title, code, children, style, ...rest }: CodeBlockProps, ref) {
  const { resolved: t } = useTheme();
  return (
    <View
      ref={ref}
      style={[
        {
          backgroundColor: t.color.bg.code,
          borderRadius: t.radius.lg,
          overflow: 'hidden',
          elevation: 3,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 12 },
        },
        style,
      ]}
      {...rest}
    >
      {title ? (
        <View
          style={{
            paddingVertical: space(t, 'xs'),
            paddingHorizontal: space(t, 'md'),
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <Text variant="caption" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {title}
          </Text>
        </View>
      ) : null}
      <View style={{ padding: space(t, 'md') }}>
        <Text variant="code-md" style={{ color: '#f2f1ec' }}>
          {code ?? children}
        </Text>
      </View>
    </View>
  );
});
