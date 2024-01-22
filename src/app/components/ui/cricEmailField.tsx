import React, { FocusEvent, useState, ComponentProps } from 'react'
import TextField from '@mui/material/TextField'
import CricTextField from './cricTextField'
import { validateEmail } from '@/util/helper'

export default function CricEmailField(
  props: ComponentProps<typeof TextField>,
) {
  const [isEmailValid, setEmailValidity] = useState(true)

  const validateUserEmail = (event: FocusEvent<HTMLInputElement>) => {
    const userInput: string = event?.target?.value
    if (userInput) {
      const isValidEmail: boolean = validateEmail(userInput)
      setEmailValidity(isValidEmail)
    }
  }

  return (
    <CricTextField
      {...props}
      type='text'
      onChange={() => setEmailValidity(true)}
      onBlur={validateUserEmail}
      error={!isEmailValid}
      helperText={!isEmailValid ? props.helperText : ''}
    />
  )
}
