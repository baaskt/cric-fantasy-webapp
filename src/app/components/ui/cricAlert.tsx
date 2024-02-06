import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface CricAlertProps {
  error: Error | undefined
  message: string
}

function CricAlert(props: CricAlertProps) {
  const [error, setError] = useState<Error>()
  const timeOutInterval = 3000

  useEffect(() => {
    setError(props.error)
    let errorTimer: string | number | NodeJS.Timeout | undefined
    if (props.error) {
      errorTimer = setTimeout(() => {
        setError(undefined)
      }, timeOutInterval)
    }
    return () => clearTimeout(errorTimer)
  }, [props.error])

  return error && <Alert severity='error'>{props.message}</Alert>
}

export default CricAlert
