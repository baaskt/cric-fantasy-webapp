import React, { ComponentProps } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { btnTheme } from '@/styles/themes/button'

export default function CricButton(props: ComponentProps<typeof Button>) {
  return (
    <ThemeProvider theme={btnTheme}>
      <Button color='primary' {...props} sx={{ p: 1.5, fontSize: 16 }}>
        {props.children}
      </Button>
    </ThemeProvider>
  )
}
