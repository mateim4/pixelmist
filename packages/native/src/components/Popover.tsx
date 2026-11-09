import { forwardRef, useEffect, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Modal, View } from 'react-native';
import type { ViewProps, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';

export type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export type PopoverAnchor = RefObject<{ measureInWindow?: (cb: (x: number, y: number, w: number, h: number) => void) => void } | null> | null;

export interface PopoverProps extends ViewProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  anchor?: PopoverAnchor;
  placement?: PopoverPlacement;
  offset?: number;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Native low-level popover: transparent Modal with the content anchored below (or above)
 * the anchor element. Escape/back-button closes via onRequestClose → onOpenChange(false).
 */
export const Popover = forwardRef<View, PopoverProps>(function Popover({ open, onOpenChange, anchor, placement = 'bottom', offset = 8, children, style, ...rest }: PopoverProps, ref) {
  const { resolved: t } = useTheme();
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    if (open) anchor?.current?.measureInWindow?.((x, y, w, h) => setRect({ x, y, w, h }));
  }, [open, anchor]);

  if (!open) return null;
  const top = placement.startsWith('top') ? (rect ? rect.y - offset : 80) : rect ? rect.y + rect.h + offset : 160;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => onOpenChange?.(false)}>
      <View style={{ flex: 1 }}>
        <View
          ref={ref}
          style={[
            {
              position: 'absolute',
              top,
              left: rect ? rect.x : space(t, 'md'),
              right: space(t, 'md'),
              backgroundColor: t.color.bg.raised,
              borderWidth: 1,
              borderColor: t.color.border.default,
              borderRadius: t.radius.md,
              padding: space(t, 'sm'),
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            },
            style,
          ]}
          {...rest}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
});
