// ============================================================
// TEMA VISUAL — Tailwind Inspired Design System
// ============================================================

export const Colors = {
  // Brand - Violeta Tech (Indigo 500 base)
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#e0e7ff',

  // Accents
  secondary: '#0ea5e9', // Sky 500 para acentos secundarios
  secondaryLight: '#e0f2fe',

  // System
  success: '#10b981', // Emerald 500
  successBg: '#d1fae5',
  successText: '#064e3b',

  warning: '#f59e0b', // Amber 500
  warningBg: '#fef3c7',
  warningText: '#78350f',

  danger: '#ef4444', // Red 500
  dangerBg: '#fee2e2',
  dangerText: '#7f1d1d',

  // Grays (Slate scale for modern, tech feel)
  slate50: '#f8fafc',  // Background principal
  slate100: '#f1f5f9', // Background secundario / Bordes sutiles
  slate200: '#e2e8f0', // Bordes divisorios
  slate300: '#cbd5e1', // Borders activos o disables
  slate400: '#94a3b8', // Iconos inactivos
  slate500: '#64748b', // Textos secundarios (body small)
  slate600: '#475569', // Textos body
  slate700: '#334155', // Subtítulos
  slate800: '#1e293b', // Títulos secundarios
  slate900: '#0f172a', // Titulares principales (negro suave)

  white: '#ffffff',
  transparent: 'transparent',

  // Legacy aliases to prevent sudden breakages before full refactoring
  background: '#f8fafc',
  navy: '#0f172a', // Aliased to slate-900
  neutral900: '#0f172a',
  neutral700: '#334155',
  neutral500: '#64748b',
  neutral300: '#cbd5e1',
  neutral100: '#f1f5f9',
};

// Spacing system based on 4px grid (Tailwind scale)
export const Spacing = {
  xs: 4,     // p-1
  sm: 8,     // p-2
  md: 16,    // p-4
  lg: 24,    // p-6
  xl: 32,    // p-8
  xxl: 48,   // p-12
};

export const Radius = {
  sm: 4,     // rounded-sm
  md: 8,     // rounded-md
  lg: 12,    // rounded-lg
  xl: 16,    // rounded-2xl
  full: 9999,// rounded-full
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  card: { // Default shadow for surfaces
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
};

export const Typography = {
  h1: {
    fontSize: 24, // text-2xl 
    fontWeight: '700' as const, // font-bold
    color: Colors.slate900,
  },
  h2: {
    fontSize: 20, // text-xl
    fontWeight: '700' as const, // font-bold
    color: Colors.slate900,
  },
  h3: {
    fontSize: 18, // text-lg
    fontWeight: '600' as const, // font-semibold
    color: Colors.slate800,
  },
  body: {
    fontSize: 16, // text-base
    color: Colors.slate600,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14, // text-sm
    color: Colors.slate500,
    lineHeight: 20,
  },
  label: {
    fontSize: 12, // text-xs
    fontWeight: '600' as const,
    color: Colors.slate600,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
};

export const Layout = {
  maxWidth: 448, // max-w-md
};
