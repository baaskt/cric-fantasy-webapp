import { COLORS } from '@/util/colors'
import { createTheme } from '@mui/material'

export const selectTheme = createTheme({
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          color: COLORS.cricPrimary,
          '&:after': {
            // focused
            borderBottom: '2px solid',
            borderColor: COLORS.cricPrimary,
          },
        },
        icon: {
          color: COLORS.cricPrimary, // Change the color of the icon
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        filled: {
          color: COLORS.placeholder,
          '&.Mui-focused': {
            color: COLORS.cricPrimary,
            fontWeight: 700,
          },
        },
      },
    },
  },
})
