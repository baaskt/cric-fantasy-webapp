import React, { ComponentProps } from 'react'
import TextField from '@mui/material/TextField'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { COLORS } from '@/util/colors'

/* 
  The multiple ampersands (e.g. "&&&:before") increase the CSS 
  specificity of the rule so that it wins over the default styling 
  (e.g. &:hover:not($disabled):before). 
*/

const theme = createTheme({
  components: {
    MuiFilledInput: {
      styleOverrides: {
        root: {
          width: 384,
          backgroundColor: COLORS.inputBg,
          borderRadius: 4,
        },
        underline: {
          '&&&:before': {
            borderBottom: 'none',
          },
          '&:after': {
            // focused
            borderBottom: '2px solid',
            borderColor: COLORS.cricPrimary,
          },
        },
        input: {
          '&::placeholder': {
            color: COLORS.cricDark,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        filled: {
          color: COLORS.cricDark,
          '&.Mui-focused': {
            color: COLORS.cricPrimary,
            fontWeight: 700,
          },
        },
      },
    },
  },
})

export default function CricTextField(props: ComponentProps<typeof TextField>) {
  return (
    <ThemeProvider theme={theme}>
      <TextField {...props} />
    </ThemeProvider>
  )
}
