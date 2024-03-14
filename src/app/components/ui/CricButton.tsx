import React, { ReactElement, useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { btnTheme } from '@/styles/themes/button'
import { CircularProgress } from '@mui/material'

type CricButtonProps = {
  btnTxt: string
  onClick: () => void
  isValid?: boolean
  isFullWidth?: boolean
  bgColor?: string
  color?: string
  startIcon?: ReactElement
  isLoading?: boolean
}

export default function CricButton(props: CricButtonProps) {
  const { btnTxt, isValid, isFullWidth, startIcon, bgColor, color, isLoading, onClick } = props
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
        id='cric-btn'
        startIcon={startIcon}
        color={'primary'}
        variant='contained'
        sx={{
          p: 1,
          pl: startIcon ? 1.5 : 1,
          fontSize: 16,
          color: color,
          backgroundColor: bgColor,
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
        className={!validBtn ? 'btn_shake' : ''}
        disabled={validBtn ? false : true}
        onClick={onClick}
        fullWidth={isFullWidth}
      >
        <div className='flex flex-row gap-2 items-center'>
          <div>{btnTxt}</div>
          {isLoading && <CircularProgress />}
        </div>
      </Button>
    </ThemeProvider>
  )
}
