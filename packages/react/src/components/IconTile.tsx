import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import type { IconName } from '@pixelmist/icons';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export interface IconTileProps extends HTMLAttributes<HTMLSpanElement> {
  icon: IconName;
  /** Accessible label for the icon. */
  label?: string;
}

/** Cream feature-icon tile (Mistral docs pattern). forwardRef + pass-through. */
export const IconTile = forwardRef(function IconTile(
  { icon, label, className, ...rest }: IconTileProps,
  ref: Ref<HTMLSpanElement>,
) {
  return (
    <span ref={ref} className={cx('pm-icon-tile', className)} {...rest}>
      <Icon name={icon} size={20} title={label} />
    </span>
  );
});
