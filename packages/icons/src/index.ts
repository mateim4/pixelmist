/**
 * @pixelmist/icons — platform-agnostic icon set.
 * 24x24 viewBox, stroke-based (stroke=currentColor, width 1.8, round caps/joins).
 * Renderers: @pixelmist/react wraps these paths in <svg>; @pixelmist/native in react-native-svg.
 */
export const iconPaths = {
  // Original 23 icons
  'arrow-right': 'M4 12h15M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17L17 7M9 7h8v8',
  check: 'M4.5 12.5l5 5L19.5 7',
  x: 'M6 6l12 12M18 6L6 18',
  'chevron-down': 'M6 9l6 6 6-6',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  terminal: 'M4 17l6-5-6-5M12 19h8',
  sparkle:
    'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4zM19 15l.9 2.6L22.5 18.5l-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3',
  menu: 'M4 7h16M4 12h16M4 17h16',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z',
  plus: 'M12 5v14M5 12h14',
  alert: 'M12 3L2.5 20h19zM12 9v5M12 17.5v.5',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.5',
  play: 'M7 4.5v15l13-7.5z',
  stop: 'M6 6h12v12H6z',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  file: 'M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v6h6',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2L10 21h4l.6-2.5a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  zap: 'M13 2L4 14h6l-1 8 9-12h-6z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  // New 22 icons for v0.2.0 (total: 45)
  'arrow-left': 'M20 12H5M12 19l-7-7 7-7',
  'arrow-up': 'M12 20v-15M7 14l5-5 5 5',
  'arrow-down': 'M12 4v15M7 10l5 5 5-5',
  'chevron-up': 'M18 15l-6-6-6 6',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 6l6 6-6 6',
  'home': 'M3 10l7-7 7 7M3 10h18M12 10v11',
  'refresh': 'M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9V3',
  'download': 'M3 17v-11l11 11M21 17v-7.5M21 10l-11-11',
  'upload': 'M3 7v10l11-11M21 7v4.5M21 15l-11 11',
  'trash': 'M3 6h18M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  'edit': 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
  'star': 'M12 17.25l3.15 1.9 1.9-3.15-1.35-1.35L18 12l-2.7-2.7-1.35 1.35-1.9-3.15-1.9 3.15 1.35 1.35L12 12l2.7 2.7 1.35-1.35zM12 2l2.7 2.7 1.35-1.35L12 0 8.95 2.35 10.3 3.7l-2.7 2.7-1.35-1.35L6.6 8.45 5.25 7.1 7.1 5.25l1.35-1.35L12 2z',
  'star-filled': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'heart': 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  'bookmark': 'M5 2h14l-2 13v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7L5 2z',
  'calendar': 'M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h2v4H3V7zm16 0h-2v4h2V7zM7 7H5v4h2V7z',
  'clock': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 3',
  'bell': 'M10.5 17.5a2.5 2.5 0 0 1-5 0V6a1 1 0 0 1 2 0v10a.5.5 0 0 0 1 0V6a1 1 0 0 0-2 0v1.07A8.42 8.42 0 0 0 12 4c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9c0-.34 0-.68.03-1H10.5zM18 10.5a2.5 2.5 0 0 1-5 0V14a1 1 0 0 1-2 0v-4a.5.5 0 0 0-1 0v4a1 1 0 0 0 2 0v-2.5a3.5 3.5 0 0 0 7 0V14a1 1 0 0 0 2 0v-3.5A2.5 2.5 0 0 1 18 10.5z',
  'share': 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v10',
  'link': 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M10 13l-3-3-1.72 1.71a5 5 0 0 0 7.07 7.07l3 3a5 5 0 0 0-7.54-.54',
  'code': 'M10 20l4-16m4 4l-4 4-4-4M6 16l-4-4 4-4',
  'filter': 'M3 6h18M7 6v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6M7 6l4-4M17 6l-4-4',
  'sort': 'M3 9h18M3 15h18M3 4h18',
  'more-vertical': 'M12 5v14M12 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM12 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  'more-horizontal': 'M5 12h14M12 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
} as const;

export type IconName = keyof typeof iconPaths;
export const iconNames = Object.keys(iconPaths) as IconName[];
