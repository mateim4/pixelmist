import 'react-native';

declare module 'react-native' {
  /** Available since RN 0.71; missing from this install's bundled type index. */
  export function useReducedMotion(): boolean | null;
}
