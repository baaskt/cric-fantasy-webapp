import { COLORS } from '@/util/colors'
import { createTheme } from '@mui/material'

export const tabTheme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          '.MuiTab-textColorPrimary.Mui-selected': {
            color: COLORS.cricPrimary,
            fontWeight: 600,
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
