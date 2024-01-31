'use client'

import React, { FocusEvent, useState } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from './ui/cricPwdField'
import CricEmailField from './ui/cricEmailField'
import CricButton from './ui/cricButton'
import { AUTH } from '@/util/constants'
import { validateEmail } from '@/util/helper'

export default function LoginForm() {
  const [email, setEmail] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')

  const onEmailChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setEmail(value)
  }

  const onPwdChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setPwd(value)
  }

  const handleSubmit = () => {
    if (validateEmail(email) && pwd) {
      const payload = {
        username: email,
        password: pwd,
      }
      console.log(payload)
    }
  }

  return (
    <Box
      component='form'
      className='flex flex-col'
      sx={{
        '& .MuiTextField-root': { mb: 3 },
        width: '100%',
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
      <div className='mt-3'>
        <CricButton variant='contained' onClick={handleSubmit}>
          {AUTH.SIGN_IN.TXT_SIGNIN}
        </CricButton>
      </div>
    </Box>
  )
}
