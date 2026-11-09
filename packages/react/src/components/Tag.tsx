import { forwardRef } from 'react';
import type { HTMLAttributes, ButtonHTMLAttributes, Ref } from 'react';
import { cx, useControllableState } from '@pixelmist/core';

export type TagTone = 'attention' | 'progress' | 'settled' | 'inactive' | 'neutral';
export type TagVariant = 'soft' | 'outline' | 'highContrast';
export type TagSize = 'sm' | 'md';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  variant?: TagVariant;
  size?: TagSize;
}

/**
 * Tag (extends Badge): the four semantic tones (attention/progress/settled/inactive)
 * plus neutral, in soft (default), outline and highContrast (solid) variants, sm/md.
 * A count of zero is never toned — render zero as neutral/inactive.
 */
export const Tag = forwardRef(function Tag(
  { tone = 'neutral', variant = 'soft', size = 'md', className, ...rest }: TagProps,
  ref: Ref<HTMLSpanElement>,
) {
  return (
    <span
      ref={ref}
      className={cx('pm-tag', `pm-tag--${variant}`, `pm-tag--${size}`, className)}
      data-tone={tone}
      {...rest}
    />
  );
});

export interface SelectableTagProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'aria-pressed'> {
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  tone?: TagTone;
  variant?: TagVariant;
  size?: TagSize;
}

/** Toggle chip: a Tag that is a button with aria-pressed. */
export const SelectableTag = forwardRef(function SelectableTag(
  { selected, defaultSelected = false, onSelectedChange, tone = 'neutral', variant = 'outline', size = 'md', className, ...rest }: SelectableTagProps,
  ref: Ref<HTMLButtonElement>,
) {
  const [value, setValue] = useControllableState<boolean>(selected, defaultSelected, onSelectedChange);
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={value}
      className={cx('pm-tag', 'pm-tag--selectable', `pm-tag--${variant}`, `pm-tag--${size}`, value && 'is-selected', className)}
      data-tone={tone}
      onClick={() => setValue(!value)}
      {...rest}
    />
  );
});
