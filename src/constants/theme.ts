export const Colors = {
  // Backgrounds
  background: '#0B0E14',
  cardBg: '#141A24',
  cardBgElevated: '#1B2230',
  modalBg: '#121721',

  // Borders & Dividers
  border: '#242C3D',
  borderLight: '#2F3A50',

  // Primary & AI Accents
  primary: '#00D8F6', // Electric Cyan (AI)
  primaryMuted: 'rgba(0, 216, 246, 0.15)',
  secondary: '#7928CA', // Purple
  secondaryMuted: 'rgba(121, 40, 202, 0.15)',

  // Trading States
  bullish: '#00E676', // Bright Green
  bullishMuted: 'rgba(0, 230, 118, 0.12)',
  bearish: '#FF5252', // Bright Red
  bearishMuted: 'rgba(255, 82, 82, 0.12)',
  neutral: '#FFA000', // Amber
  neutralMuted: 'rgba(255, 160, 0, 0.15)',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Status & Badges
  badgeBg: '#1E293B',
  inputBg: '#111622',
  inputBorder: '#273145',
  
  // Shadows & Overlays
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.75)',
};

export const Typography = {
  fontFamily: undefined, // Default system font
  h1: { fontSize: 26, fontWeight: '700' as const, color: Colors.textPrimary },
  h2: { fontSize: 20, fontWeight: '700' as const, color: Colors.textPrimary },
  h3: { fontSize: 16, fontWeight: '600' as const, color: Colors.textPrimary },
  body: { fontSize: 14, fontWeight: '400' as const, color: Colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '400' as const, color: Colors.textMuted },
  mono: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.5 },
};
