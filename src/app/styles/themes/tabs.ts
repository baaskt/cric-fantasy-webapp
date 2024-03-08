import { COLORS } from '@/util/colors'
import { createTheme } from '@mui/material'

export const tabTheme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          '.MuiTab-textColorPrimary': {
            textTransform: 'capitalize',
            fontSize: 16,
          },
          '.MuiTab-textColorPrimary.Mui-selected': {
            color: COLORS.cricPrimary,
            fontWeight: 600,
            textTransform: 'capitalize',
          },
        },
        indicator: {
          backgroundColor: COLORS.cricPrimary,
          height: 3,
        },
      },
    },
  },
})
