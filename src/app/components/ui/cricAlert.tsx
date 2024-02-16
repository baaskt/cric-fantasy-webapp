import { Alert, AlertColor } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface CricAlertProps {
  error?: Error | undefined
  message: string
  severity?: AlertColor
}

function CricAlert(props: CricAlertProps) {
  const { error, severity = 'error' } = props
  const [errorData, setError] = useState<Error>()
  const timeOutInterval = 3000

  useEffect(() => {
    setError(error)
    let errorTimer: string | number | NodeJS.Timeout | undefined
    if (error) {
      errorTimer = setTimeout(() => {
        setError(undefined)
      }, timeOutInterval)
    }
    return () => clearTimeout(errorTimer)
  }, [error])

  return errorData && <Alert severity={severity}>{props.message}</Alert>
}

export default CricAlert
