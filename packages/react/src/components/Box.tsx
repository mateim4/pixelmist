import { createElement, forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';

export type SpaceValue = number | string; // number = px, string = spacing token name ("md") -> var(--pm-space-md)

export const spaceCss = (v: SpaceValue): string => (typeof v === 'number' ? `${v}px` : `var(--pm-space-${v})`);
const lenCss = (v: number | string): string => (typeof v === 'number' ? `${v}px` : v);

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  display?: CSSProperties['display'];
  direction?: CSSProperties['flexDirection'];
  gap?: SpaceValue;
  padding?: SpaceValue;
  paddingX?: SpaceValue;
  paddingY?: SpaceValue;
  margin?: SpaceValue;
  marginX?: SpaceValue;
  marginY?: SpaceValue;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
  flex?: CSSProperties['flex'];
  width?: CSSProperties['width'];
  maxWidth?: CSSProperties['maxWidth'];
  radius?: SpaceValue;
  bg?: string;
  color?: string;
}

/** Layout primitive. Spacing props accept a token name ("xl") or a px number. */
export const Box = forwardRef(function Box(
  {
    as,
    display,
    direction,
    gap,
    padding,
    paddingX,
    paddingY,
    margin,
    marginX,
    marginY,
    align,
    justify,
    wrap,
    flex,
    width,
    maxWidth,
    radius,
    bg,
    color,
    className,
    style,
    ...rest
  }: BoxProps,
  ref: Ref<HTMLDivElement>,
) {
  const Tag = (as ?? 'div') as ElementType;
  const styles: CSSProperties = {
    ...(display !== undefined && { display }),
    ...(direction !== undefined && { flexDirection: direction }),
    ...(gap !== undefined && { gap: spaceCss(gap) }),
    ...(padding !== undefined && { padding: spaceCss(padding) }),
    ...(paddingX !== undefined && { paddingInline: spaceCss(paddingX) }),
    ...(paddingY !== undefined && { paddingBlock: spaceCss(paddingY) }),
    ...(margin !== undefined && { margin: spaceCss(margin) }),
    ...(marginX !== undefined && { marginInline: spaceCss(marginX) }),
    ...(marginY !== undefined && { marginBlock: spaceCss(marginY) }),
    ...(align !== undefined && { alignItems: align }),
    ...(justify !== undefined && { justifyContent: justify }),
    ...(wrap !== undefined && { flexWrap: wrap }),
    ...(flex !== undefined && { flex }),
    ...(width !== undefined && { width: lenCss(width) }),
    ...(maxWidth !== undefined && { maxWidth: lenCss(maxWidth) }),
    ...(radius !== undefined && { borderRadius: spaceCss(radius) }),
    ...(bg !== undefined && { background: bg }),
    ...(color !== undefined && { color }),
    ...style,
  };
  return createElement(Tag, { ref, className: cx('pm-box', className), style: styles, ...rest });
});

export interface StackProps extends BoxProps {}

/** Flex stack (column by default). */
export const Stack = forwardRef(function Stack(
  { direction = 'column', display = 'flex', ...rest }: StackProps,
  ref: Ref<HTMLDivElement>,
) {
  return <Box ref={ref} display={display} direction={direction} {...rest} />;
});
