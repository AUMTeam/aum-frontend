/**
 * @file
 * This file contains helper methods to style the main app theme
 * thanks to the Material-UI library.
 */

export function configureTheme() {
  return {
    palette: {
      common: { black: '#000000', white: '#ffffff' },
      background: { paper: '#ffffff', default: '#fafafa' },
      primary: {
        light: '#58a5f0',
        main: '#0277bd',
        dark: '#004c8c',
        contrastText: '#ffffff'
      },
      secondary: {
        light: '#ffff6b',
        main: '#fdd835',
        dark: '#c6a700',
        contrastText: '#000000'
      },
      error: {
        light: '#e57373',
        main: '#f44336',
        dark: '#d32f2f',
        contrastText: '#ffffff'
      },
      approved: '#2eb72c'
    },
    typography: {
      useNextVariants: true
    }
  };
}
