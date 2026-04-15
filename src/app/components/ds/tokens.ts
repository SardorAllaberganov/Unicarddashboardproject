export const F = {
  inter: "'Inter', sans-serif",
  dm: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const C = {
  // Backgrounds
  pageBg: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  inputBorder: '#D1D5DB',
  divider: '#E5E7EB',
  // Text
  text1: '#111827',
  text2: '#374151',
  text3: '#6B7280',
  text4: '#9CA3AF',
  textDisabled: '#D1D5DB',
  // Brand
  blue: '#2563EB',
  blueHover: '#1D4ED8',
  blueLt: '#EFF6FF',
  blueTint: '#DBEAFE',
  // Semantic
  success: '#10B981',
  successBg: '#F0FDF4',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  info: '#0891B2',
  infoBg: '#ECFEFF',
  // Surfaces specific
  sidebarBg: '#FFFFFF',
  sidebarBorder: '#E5E7EB',
  tableHeaderBg: '#F9FAFB',
  tableHover: '#F9FAFB',
  tableAlt: '#FAFBFC',
  // Skeleton / overlay / focus
  focusRing: '#DBEAFE',
  skeletonBase: '#E5E7EB',
  skeletonShimmer: '#F3F4F6',
  overlay: 'rgba(0,0,0,0.2)',
  progressTrack: '#EFF6FF',
};

/* ── Dark theme overrides ────────────────────────────────────────────── */

export const D = {
  pageBg: '#0F1117',
  surface: '#1A1D27',
  border: '#2D3148',
  inputBorder: '#2D3148',
  divider: '#2D3148',
  text1: '#F1F2F6',
  text2: '#A0A5B8',
  text3: '#6B7280',
  text4: '#4A4F63',
  textDisabled: '#3A3F50',
  blue: '#3B82F6',
  blueHover: '#2563EB',
  blueLt: '#1E2A4A',
  blueTint: '#1E3A5F',
  success: '#34D399',
  successBg: 'rgba(52,211,153,0.10)',
  warning: '#FBBF24',
  warningBg: 'rgba(251,191,36,0.10)',
  error: '#F87171',
  errorBg: 'rgba(248,113,113,0.10)',
  info: '#22D3EE',
  infoBg: 'rgba(8,145,178,0.10)',
  // Surfaces specific
  sidebarBg: '#12141C',
  sidebarBorder: '#2D3148',
  tableHeaderBg: '#161822',
  tableHover: '#1E2130',
  tableAlt: '#161822',
  // Skeleton / overlay / focus
  focusRing: '#1E3A5F',
  skeletonBase: '#2D3148',
  skeletonShimmer: '#363B52',
  overlay: 'rgba(0,0,0,0.4)',
  progressTrack: '#2D3148',
};

/** Pick light or dark token set */
export function theme(dark: boolean) {
  return dark ? { ...C, ...D } : C;
}
