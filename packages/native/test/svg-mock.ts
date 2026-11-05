import { forwardRef, createElement } from 'react';
const host = (name: string) => forwardRef((props: any, ref: any) => createElement(name, { ...props, ref }));
export default host('Svg');
export const Path = host('Path');
export const Rect = host('Rect');
export const Defs = host('Defs');
export const LinearGradient = host('LinearGradient');
export const Stop = host('Stop');
