/**
 * @pixelmist/core — platform-agnostic primitives shared by @pixelmist/react and
 * @pixelmist/native. This package must never import DOM or react-native APIs.
 */
import { useCallback, useId, useState } from 'react';

/** Join class names / conditional fragments, skipping falsy values. */
export function cx(...parts: Array<unknown>): string {
  return parts.filter(Boolean).join(' ');
}

export type Size = 'sm' | 'md' | 'lg';

/** Controlled/uncontrolled state hook: works like a native input's value/onChange pair. */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void,
): [T, (v: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const set = useCallback(
    (v: T) => {
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );
  return [current, set];
}

export { useId };

export { AccentScope, useAccentScope, useAccentColor } from './AccentScope';
export type { AccentScopeProps, AccentScopeValue } from './AccentScope';

/** Polymorphic-ish helper types shared by both renderers. */
export interface WithClassName {
  className?: string;
}
export interface WithChildren {
  children?: React.ReactNode;
}
