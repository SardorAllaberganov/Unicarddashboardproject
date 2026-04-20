// Dark-aware icon color variants for tinted icon tiles across stat cards,
// list rows, and compact chips. Light palette matches Tailwind 50/600 pairs;
// dark palette uses 15 % alpha washes over the colored accent for consistent
// contrast on #1A1D27 surfaces.
export type IconVariantName = 'blue' | 'violet' | 'green' | 'cyan' | 'amber' | 'rose';

interface IconVariant {
  bg: string;
  color: string;
}

const LIGHT: Record<IconVariantName, IconVariant> = {
  blue:   { bg: '#EFF6FF', color: '#2563EB' },
  violet: { bg: '#F3F0FF', color: '#7C3AED' },
  green:  { bg: '#F0FDF4', color: '#16A34A' },
  cyan:   { bg: '#ECFEFF', color: '#0891B2' },
  amber:  { bg: '#FFFBEB', color: '#D97706' },
  rose:   { bg: '#FFF1F2', color: '#E11D48' },
};

const DARK: Record<IconVariantName, IconVariant> = {
  blue:   { bg: 'rgba(37,99,235,0.15)',  color: '#3B82F6' },
  violet: { bg: 'rgba(124,58,237,0.15)', color: '#A78BFA' },
  green:  { bg: 'rgba(22,163,74,0.15)',  color: '#34D399' },
  cyan:   { bg: 'rgba(8,145,178,0.15)',  color: '#22D3EE' },
  amber:  { bg: 'rgba(217,119,6,0.15)',  color: '#FBBF24' },
  rose:   { bg: 'rgba(225,29,72,0.15)',  color: '#FB7185' },
};

export function iconVariant(variant: string, dark: boolean): IconVariant {
  const palette = dark ? DARK : LIGHT;
  return palette[variant as IconVariantName] ?? palette.blue;
}
