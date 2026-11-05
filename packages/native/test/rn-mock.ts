// Minimal react-native mock for node-env rendering tests (host string components).
import { forwardRef, createElement } from 'react';

const host = (name: string) => forwardRef((props: any, ref: any) => createElement(name, { ...props, ref }));

export const View = host('View');
export const Text = host('Text');
export const TextInput = host('TextInput');
export const Pressable = host('Pressable');
export const Modal = host('Modal');
export const ScrollView = host('ScrollView');
export const Switch = host('Switch');
export const ActivityIndicator = host('ActivityIndicator');
export const Animated = {
  View: host('Animated.View'),
  Value: class {
    constructor(public v: number) {}
    interpolate() {
      return 0;
    }
    setValue() {}
  },
  timing: () => ({ start: (cb?: () => void) => cb?.(), stop: () => undefined }),
  sequence: () => ({ start: (cb?: () => void) => cb?.(), stop: () => undefined }),
  loop: () => ({ start: () => undefined, stop: () => undefined }),
  delay: () => ({}),
};
export const Appearance = {
  getColorScheme: () => 'dark' as const,
  addChangeListener: () => ({ remove: () => undefined }),
};
export const StyleSheet = { create: <T>(s: T): T => s };
export const Platform = { OS: 'ios' as const, select: (o: any) => o.ios ?? o.default };
