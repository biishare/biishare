import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7A00', // 🔶 laranja principal da marca
    },
    secondary: {
      main: '#FFB300', // opcional
    },
    background: {
      default: '#ffffff',
    },
  },

  typography: {
    fontFamily: [
      'ui-sans-serif',
      'system-ui',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(','),
  },
})

export default theme