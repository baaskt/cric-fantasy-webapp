import { COLORS } from '@/util/colors'
import { createTheme } from '@mui/material'

export const listItemTheme = createTheme({
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '.MuiListItemButton-root': {
            borderRadius: 10,
            color: COLORS.cricDark,
          },
          '.MuiListItemButton-root.Mui-selected': {
            backgroundColor: COLORS.cricPrimary,
            color: COLORS.white,
            '&:hover': {
              backgroundColor: COLORS.cricPrimary,
            },
            '.MuiListItemIcon-root': {
              color: COLORS.white,
            },
          },
          // '.MuiListItemText-primary': {
          //   fontFamily: 'Manrope',
          // },
        },
      },
    },
  },
})
