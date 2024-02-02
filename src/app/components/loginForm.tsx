'use client'

import React, { FocusEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from './ui/cricPwdField'
import CricEmailField from './ui/cricEmailField'
import CricButton from './ui/cricButton'
import { AUTH } from '@/util/constants'
import { validateEmail } from '@/util/helper'
import { useAuth } from '@/providers/AuthProvider'
import { LOGIN_URL } from '@/util/endpoints'
import useSWRMutation from 'swr/mutation'
import { fetcher } from '@/lib/fetcher'
import CricAlert from './ui/cricAlert'

export default function LoginForm() {
  const [email, setEmail] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')
  const { login } = useAuth()
  const { data, error, isMutating, trigger } = useSWRMutation<unknown, Error>(
    LOGIN_URL,
    fetcher().POST,
  )

  useEffect(() => {
    redirectLogin()
  }, [data])

  const onEmailChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setEmail(value)
  }

  const onPwdChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setPwd(value)
  }

  const handleSubmit = () => {
    void loginUser()
  }

  const loginUser = async () => {
    if (validateEmail(email) && pwd) {
      // const payload = {
      //   username: email,
      //   password: pwd,
      // }
      await trigger()
      login({ email: email })
    }
  }

  const redirectLogin = () => {
    //reidrect
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
      <CricAlert
        error={error}
        message='Incorrect username / password'
      ></CricAlert>
      <div className='mt-3'>
        <CricButton variant='contained' onClick={() => handleSubmit()}>
          {isMutating ? 'logging in...' : AUTH.SIGN_IN.TXT_SIGNIN}
        </CricButton>
      </div>
    </Box>
  )
}
