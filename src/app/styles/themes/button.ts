import { COLORS } from '@/util/colors'
import { createTheme } from '@mui/material'

export const btnTheme = createTheme({
  palette: {
    primary: {
      main: COLORS.cricPrimary,
      contrastText: COLORS.white,
    },
  },
  typography: {
    button: {
      textTransform: 'capitalize',
    },
  },
})
