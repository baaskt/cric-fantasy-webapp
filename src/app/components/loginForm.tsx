'use client'

import React, { FocusEvent } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from './ui/cricPwdField'
import CricEmailField from './ui/cricEmailField'
import CricButton from './ui/cricButton'
import { AUTH } from '@/util/constants'

export default function LoginForm() {
  const onEmailChange = (event: FocusEvent<HTMLInputElement>) => {
    console.log(event)
  }

  const onPwdChange = (event: FocusEvent<HTMLInputElement>) => {
    console.log(event)
  }

  return (
    <Box
      component='form'
      className='flex flex-col'
      sx={{
        '& .MuiTextField-root': { mb: 3 },
      }}
      noValidate
      autoComplete='off'
    >
      <CricEmailField
        id='login-email'
        label={AUTH.EMAIL.LABEL}
        variant='filled'
        placeholder={AUTH.EMAIL.PLACEHOLDER}
        helperText={AUTH.EMAIL.ERROR}
        onChange={onEmailChange}
      />
      <CricPwdField
        id='login-password'
        label={AUTH.PASSWORD.LABEL}
        variant='filled'
        autoComplete='current-password'
        placeholder={AUTH.PASSWORD.PLACEHOLDER}
        onChange={onPwdChange}
      />
      <CricButton className='mt-50' variant='contained'>
        {AUTH.SIGN_IN.TXT_SIGNIN}
      </CricButton>
    </Box>
  )
}
