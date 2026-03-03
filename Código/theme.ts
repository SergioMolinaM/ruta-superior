// ============================================================
// TEMA VISUAL — Mi Camino a la U
// ============================================================

export const Colors = {
  primary: '#1B4FD8',      // Azul institucional
  primaryDark: '#1338A8',
  primaryLight: '#EEF2FF',
  secondary: '#059669',    // Verde éxito
  secondaryLight: '#ECFDF5',
  warning: '#D97706',      // Ámbar alerta
  warningLight: '#FFFBEB',
  danger: '#DC2626',       // Rojo error/brecha
  dangerLight: '#FEF2F2',
  neutral900: '#111827',
  neutral700: '#374151',
  neutral500: '#6B7280',
  neutral300: '#D1D5DB',
  neutral100: '#F3F4F6',
  white: '#FFFFFF',
  background: '#F8FAFC',

  // Legacy Identity Colors (App.css)
  navy: '#0f2547',
  blueAction: '#2463eb',
  blueLightApp: '#eff6ff',
  successBg: '#d1fae5',
  successText: '#065f46',
  infoBg: '#dbeafe',
  infoText: '#1e40af',
  warningBgApp: '#fef3c7',
  warningTextApp: '#92400e',
  dangerBgApp: '#fee2e2',
  dangerTextApp: '#991b1b',
};

export const Typography = {
  h1: { fontSize: 26, fontWeight: '700' as const, color: Colors.neutral900 },
  h2: { fontSize: 20, fontWeight: '700' as const, color: Colors.neutral900 },
  h3: { fontSize: 16, fontWeight: '600' as const, color: Colors.neutral900 },
  body: { fontSize: 14, color: Colors.neutral700 },
  bodySmall: { fontSize: 12, color: Colors.neutral500 },
  label: { fontSize: 13, fontWeight: '600' as const, color: Colors.neutral700 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
};
