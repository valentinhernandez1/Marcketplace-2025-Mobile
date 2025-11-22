// Sistema de estilos globales - Estilo Marketplace Web Moderno
export const theme = {
  colors: {
    // Colores principales estilo marketplace moderno
    primary: '#3483FA',           // Azul vibrante (estilo MercadoLibre)
    primaryDark: '#2968C8',       // Azul oscuro
    primaryLight: '#E3F2FD',      // Azul claro
    secondary: '#FF6F00',          // Naranja vibrante
    secondaryDark: '#E65100',     // Naranja oscuro
    secondaryLight: '#FFF3E0',    // Naranja claro
    success: '#00A650',           // Verde éxito
    successLight: '#E8F5E9',      // Verde claro
    danger: '#FF4444',            // Rojo moderno
    dangerLight: '#FFEBEE',       // Rojo claro
    warning: '#FFB800',           // Amarillo vibrante
    warningLight: '#FFF9C4',      // Amarillo claro
    info: '#009EE3',              // Azul info
    infoLight: '#E1F5FE',         // Azul claro
    light: '#F5F5F5',             // Gris claro
    dark: '#1A1A1A',              // Negro suave
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      muted: '#999999',
      light: '#FFFFFF',
      inverse: '#FFFFFF',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      light: '#FAFAFA',
      dark: '#1A1A1A',
      gradient: ['#3483FA', '#2968C8'], // Gradiente azul
      gradientSecondary: ['#FF6F00', '#E65100'], // Gradiente naranja
    },
    border: {
      light: '#E0E0E0',
      medium: '#BDBDBD',
      dark: '#757575',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
  },
  gradients: {
    primary: ['#3483FA', '#2968C8'],
    secondary: ['#FF6F00', '#E65100'],
    success: ['#00A650', '#008F44'],
    dark: ['#1A1A1A', '#000000'],
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
    },
  },
};

