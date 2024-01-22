'use client'

import React, { FocusEvent } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from './ui/cricPwdField'
import CricEmailField from './ui/cricEmailField'

export default function LoginForm() {
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
        label='Email'
        variant='filled'
        placeholder='Enter your email address'
        helperText='Please enter valid email address'
      />
      <CricPwdField
        id='login-password'
        label='Password'
        variant='filled'
        autoComplete='current-password'
        placeholder='Enter at least 8 characters'
        onChange={onPwdChange}
      />
    </Box>
  )
}
