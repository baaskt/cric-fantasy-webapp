import { Alert, AlertColor } from '@mui/material'
import React, { useEffect, useState } from 'react'

type CricError = Error | boolean | string | undefined

interface CricAlertProps {
  error?: CricError
  message: string
  severity?: AlertColor
}

function CricAlert(props: CricAlertProps) {
  const { message, severity = 'error' } = props
  const [showAlert, setShowAlert] = useState<boolean>()
  const timeOutInterval = 3000

  useEffect(() => {
    let timerCount: string | number | NodeJS.Timeout | undefined
    if (message) {
      setShowAlert(true)
      timerCount = setTimeout(() => {
        setShowAlert(false)
      }, timeOutInterval)
    }
    return () => clearTimeout(timerCount)
  }, [message])

  return showAlert && <Alert severity={severity}>{props.message}</Alert>
}

export default CricAlert
