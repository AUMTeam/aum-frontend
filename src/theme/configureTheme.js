/**
 * @file
 * This file contains helper methods to style the main app theme
 * thanks to the Material-UI library.
 */

export function configureTheme() {
  return {
    palette: {
      common: { black: '#000000', white: '#ffffff' },
      background: { paper: '#ffffff', default: '#ffffff' },
      primary: {
        light: '#9e47ff',
        main: '#6200ee',
        dark: '#0400ba',
        contrastText: '#ffffff'
      },
      secondary: {
        light: '#66fff9',
        main: '#03dac6',
        dark: '#00a896',
        contrastText: '#000000'
      },
      error: {
        light: '#fd558f',
        main: '#c51162',
        dark: '#fd558f',
        contrastText: '#ffffff'
      }
    }
  };
}
