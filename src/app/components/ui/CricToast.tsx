import { Snackbar } from '@mui/material'
import React from 'react'

type CricToastProps = {
  message: string
  open: boolean
  onClose: (isClosed: boolean) => void
}
function CricToast(props: CricToastProps) {
  const { open, message, onClose } = props
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      message={message}
      onClose={() => onClose(false)}
    />
  )
}

export default CricToast
