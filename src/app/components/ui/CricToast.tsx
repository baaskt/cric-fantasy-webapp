import { Snackbar } from '@mui/material'
import React from 'react'

type CricToastProps = {
  message: string
  open: boolean
}
function CricToast(props: CricToastProps) {
  const { open, message } = props
  return <Snackbar open={open} autoHideDuration={5000} message={message} />
}

export default CricToast
