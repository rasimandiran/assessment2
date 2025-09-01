// Design system theme and styling utilities

export const theme = {
  colors: {
    // Primary colors
    primary: '#007bff',
    primaryHover: '#0056b3',
    primaryLight: '#cce7ff',
    
    // Secondary colors
    secondary: '#6c757d',
    secondaryHover: '#545b62',
    
    // Status colors
    success: '#28a745',
    successLight: '#d4edda',
    warning: '#ffc107',
    warningLight: '#fff3cd',
    error: '#dc3545',
    errorLight: '#f8d7da',
    info: '#17a2b8',
    infoLight: '#d1ecf1',
    
    // Neutral colors
    white: '#ffffff',
    gray50: '#f8f9fa',
    gray100: '#f1f3f4',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ced4da',
    gray500: '#adb5bd',
    gray600: '#6c757d',
    gray700: '#495057',
    gray800: '#343a40',
    gray900: '#212529',
    
    // Text colors
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    textMuted: '#868e96',
    textLight: '#ffffff',
    
    // Background colors
    background: '#ffffff',
    backgroundLight: '#f8f9fa',
    backgroundDark: '#343a40',
    
    // Border colors
    border: '#dee2e6',
    borderLight: '#e9ecef',
    borderDark: '#495057'
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '6px',
    xl: '8px',
    pill: '50px',
    circle: '50%'
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.1)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.1)'
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6
    }
  },
  
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    tooltip: 1070,
    toast: 1080
  }
};

// Common component styles
export const commonStyles = {
  button: {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.primary}`,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      textDecoration: 'none'
    },
    
    secondary: {
      backgroundColor: theme.colors.white,
      color: theme.colors.textPrimary,
      border: `1px solid ${theme.colors.border}`,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    },
    
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.textSecondary,
      border: 'none',
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.fontSize.sm,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    }
  },
  
  input: {
    base: {
      width: '100%',
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: theme.typography.fontSize.md,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      outline: 'none',
      transition: 'all 0.2s ease-in-out',
      fontFamily: theme.typography.fontFamily
    }
  },
  
  card: {
    base: {
      backgroundColor: theme.colors.white,
      border: `1px solid ${theme.colors.borderLight}`,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.sm,
      padding: theme.spacing.lg,
      transition: 'all 0.2s ease-in-out'
    },
    
    hover: {
      boxShadow: theme.shadows.md,
      borderColor: theme.colors.border
    }
  },
  
  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      borderRadius: theme.borderRadius.pill,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    
    variants: {
      primary: {
        backgroundColor: theme.colors.primaryLight,
        color: theme.colors.primary
      },
      secondary: {
        backgroundColor: theme.colors.gray200,
        color: theme.colors.gray700
      },
      success: {
        backgroundColor: theme.colors.successLight,
        color: theme.colors.success
      },
      warning: {
        backgroundColor: theme.colors.warningLight,
        color: '#856404'
      },
      error: {
        backgroundColor: theme.colors.errorLight,
        color: theme.colors.error
      }
    }
  }
};

// Responsive utilities
export const mediaQueries = {
  up: (breakpoint) => `@media (min-width: ${theme.breakpoints[breakpoint]})`,
  down: (breakpoint) => `@media (max-width: ${theme.breakpoints[breakpoint]})`,
  between: (min, max) => `@media (min-width: ${theme.breakpoints[min]}) and (max-width: ${theme.breakpoints[max]})`
};

// Animation utilities
export const animations = {
  fadeIn: {
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 }
    }
  },
  
  slideIn: {
    animation: 'slideIn 0.3s ease-out',
    '@keyframes slideIn': {
      from: { 
        opacity: 0,
        transform: 'translateY(10px)'
      },
      to: { 
        opacity: 1,
        transform: 'translateY(0)'
      }
    }
  },
  
  pulse: {
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 }
    }
  }
};

// Utility functions
export const utils = {
  // Create hover styles
  hover: (styles) => ({
    ':hover': styles
  }),
  
  // Create focus styles
  focus: (styles) => ({
    ':focus': styles
  }),
  
  // Create disabled styles
  disabled: (styles) => ({
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.6,
      ...styles
    }
  }),
  
  // Truncate text
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  
  // Screen reader only (for accessibility)
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0
  }
};