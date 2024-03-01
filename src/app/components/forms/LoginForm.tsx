'use client'

import React, { FocusEvent, useState } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from '../ui/CricPwdField'
import CricEmailField from '../ui/CricEmailField'
import CricButton from '../ui/CricButtonComp'
import { AUTH } from '@/util/constants/constants'
import { validateEmail } from '@/util/helper'
import { useAuth } from '@/providers/AuthProvider'
import { LOGIN_URL } from '@/util/constants/endpoints'
import CricAlert from '../ui/CricAlertComp'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { LoginRequest } from '@/model/request/login-request.type'
import { useRouter } from 'next/navigation'
import { CricResponse } from '@/model/types/cric-response.type'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')
  const { login } = useAuth()

  const loginRequest = useMutateRequest(LOGIN_URL, HttpMethod.POST)

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
      const payload: LoginRequest = {
        email: email,
        password: pwd,
      }
      try {
        const response: CricResponse<string> = (await loginRequest.trigger(
          payload as never,
        )) as CricResponse<string>
        const accessToken = response?.result ? response.result : ''
        login({ email: email }, accessToken)
      } catch (e) {
        console.log(e)
      } finally {
        router.push('/tournaments')
      }
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
      autoComplete='on'
    >
      <CricEmailField
        id='login-email'
        label={AUTH.EMAIL.label}
        variant='filled'
        autoComplete='username'
        placeholder={AUTH.EMAIL.placeholder}
        helperText={AUTH.EMAIL.error}
        onChange={onEmailChange}
      />
      <CricPwdField
        id='login-password'
        label={AUTH.PASSWORD.label}
        variant='filled'
        autoComplete='current-password'
        placeholder={AUTH.PASSWORD.placeholder}
        onChange={onPwdChange}
      />
      <CricAlert
        error={loginRequest.error}
        message={AUTH.SIGN_IN.error}
      ></CricAlert>
      <div className='mt-3'>
        <CricButton
          isFullWidth={true}
          onClick={() => handleSubmit()}
          btnTxt={
            loginRequest.isMutating ? 'logging in...' : AUTH.SIGN_IN.txtSignin
          }
        ></CricButton>
      </div>
    </Box>
  )
}
