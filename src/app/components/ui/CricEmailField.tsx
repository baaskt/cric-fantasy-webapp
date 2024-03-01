import React, { FocusEvent, useState, ComponentProps } from 'react'
import TextField from '@mui/material/TextField'
import CricTextField from './CricTextField'
import { validateEmail } from '@/util/helper'

export default function CricEmailField(
  props: ComponentProps<typeof TextField>,
) {
  const [isEmailValid, setEmailValidity] = useState<boolean>(true)

  const onEmailChange = (event: FocusEvent<HTMLInputElement>) => {
    setEmailValidity(true)
    props.onChange && props.onChange(event)
  }

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
      onChange={onEmailChange}
      onBlur={validateUserEmail}
      error={!isEmailValid}
      helperText={!isEmailValid ? props.helperText : ''}
    />
  )
}
