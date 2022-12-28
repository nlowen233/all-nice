import { createTheme } from '@mui/material/styles'
import { Colors } from './Colors'

export const Theme = createTheme({
    palette: {
        primary: {
            main: Colors.dark,
        },
        secondary: {
            main: Colors.lightest,
        },
        error: {
            main: Colors.error,
        },
    },
    typography: {
        fontFamily: [
            'Raleway',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
            @font-face {
              font-family: 'Raleway';
              font-style: normal;
              font-display: swap;
              font-weight: 400;
              src: local('Raleway'), local('Raleway-Regular');
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
          `,
        },
    },
})
