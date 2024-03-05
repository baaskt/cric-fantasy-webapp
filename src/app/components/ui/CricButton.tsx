import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { btnTheme } from '@/styles/themes/button'

type CricButtonProps = {
  btnTxt: string
  onClick: () => void
  isValid?: boolean
  isFullWidth?: boolean
  color?: string
}

export default function CricButton(props: CricButtonProps) {
  const { btnTxt, isValid, isFullWidth, onClick } = props
  const [validBtn, setValidBtn] = useState<boolean>(true)

  useEffect(() => {
    if (isValid !== undefined && !isValid) {
      setValidBtn(false)
      shakeButton()
    }
  }, [isValid])

  const shakeButton = () => {
    setTimeout(function () {
      setValidBtn(true)
    }, 500)
  }

  return (
    <ThemeProvider theme={btnTheme}>
      <Button
        color={'primary'}
        variant='contained'
        sx={{
          p: 1.5,
          fontSize: 16,
        }}
        className={!validBtn ? 'btn_shake' : ''}
        disabled={validBtn ? false : true}
        onClick={onClick}
        fullWidth={isFullWidth}
      >
        {btnTxt}
      </Button>
    </ThemeProvider>
  )
}
