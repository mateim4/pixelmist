import { createElement, forwardRef } from 'react';
import type { ElementType, HTMLAttributes, Ref } from 'react';
import type { TextVariant } from '@pixelmist/tokens';
import { cx } from '@pixelmist/core';

export type TextTone =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'disabled'
  | 'inverse'
  | 'accent'
  | 'link'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

const toneColor: Record<TextTone, string> = {
  default: 'var(--pm-color-fg-default)',
  muted: 'var(--pm-color-fg-muted)',
  subtle: 'var(--pm-color-fg-subtle)',
  disabled: 'var(--pm-color-fg-disabled)',
  inverse: 'var(--pm-color-fg-inverse)',
  accent: 'var(--pm-color-accent-primary)',
  link: 'var(--pm-color-fg-link)',
  success: 'var(--pm-color-status-success)',
  info: 'var(--pm-color-status-info)',
  warning: 'var(--pm-color-status-warning)',
  danger: 'var(--pm-color-status-danger)',
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TextVariant;
  tone?: TextTone;
}

/** Typography primitive. variant maps to a tokenized type style; tone to a semantic color. */
export const Text = forwardRef(function Text(
  { as, variant = 'body-md', tone = 'default', className, style, ...rest }: TextProps,
  ref: Ref<HTMLElement>,
) {
  const Tag = (as ?? 'p') as ElementType;
  return createElement(Tag, {
    ref,
    className: cx('pm-text', className),
    'data-variant': variant,
    'data-tone': tone,
    style: { color: toneColor[tone], ...style },
    ...rest,
  });
});
