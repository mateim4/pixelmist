import { forwardRef } from 'react';
import type { SVGAttributes, Ref } from 'react';
import { iconPaths } from '@pixelmist/icons';
import type { IconName } from '@pixelmist/icons';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  title?: string;
}

/** Renders one of the @pixelmist/icons stroke paths as an inline SVG. forwardRef + pass-through. */
export const Icon = forwardRef(function Icon(
  { name, size = 20, strokeWidth = 1.8, className, title, ...rest }: IconProps,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      ref={ref}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={iconPaths[name]} />
    </svg>
  );
});
