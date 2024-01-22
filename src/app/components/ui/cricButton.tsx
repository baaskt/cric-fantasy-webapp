import React, { ComponentProps } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { COLORS } from '@/util/colors'

export default function CricButton(props: ComponentProps<typeof Button>) {
  const theme = createTheme({
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

  return (
    <ThemeProvider theme={theme}>
      <Button
        color='primary'
        {...props}
        sx={{ p: 1.5, fontSize: 16 }}
        fullWidth
      >
        {props.children}
      </Button>
    </ThemeProvider>
  )
}
