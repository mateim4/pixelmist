import { createContext, forwardRef, useContext } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const LayerContext = createContext(0);

export interface LayerProps extends ViewProps {
  level?: number;
}

/** Native surface levels: nested Layer takes the next surface token. */
export const Layer = forwardRef<View, LayerProps>(function Layer({ level, children, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  const parent = useContext(LayerContext);
  const current = Math.min(level ?? parent + 1, 2);
  const bg = current === 0 ? t.color.bg.surface : current === 1 ? t.color.bg.raised : t.color.bg.canvas;
  return (
    <LayerContext.Provider value={current}>
      <View ref={ref} style={[{ backgroundColor: bg, borderRadius: t.radius.lg }, style]} {...rest}>
        {children}
      </View>
    </LayerContext.Provider>
  );
});

export function useLayer(): number {
  return useContext(LayerContext);
}
