import React, { ComponentProps } from 'react'
import TextField from '@mui/material/TextField'
import { ThemeProvider } from '@mui/material/styles'
import { textFieldTheme } from '@/styles/themes/textfield'

export default function CricTextField(props: ComponentProps<typeof TextField>) {
  return (
    <ThemeProvider theme={textFieldTheme}>
      <TextField {...props} />
    </ThemeProvider>
  )
}
