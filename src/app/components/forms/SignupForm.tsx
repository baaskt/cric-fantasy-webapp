'use client'

import React, { FormEvent, FocusEvent, useState } from 'react'
import Box from '@mui/material/Box'
import CricEmailField from '../ui/CricEmailField'
import CricButton from '../ui/CricButton'
import { AUTH } from '@/util/constants/constants'
import { validateEmail } from '@/util/validation'
import { USERS } from '@/util/constants/endpoints'
import CricAlert from '../ui/CricAlert'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { VerifyEmailRequest } from '@/model/request/login-request.type'
import { CricResponse } from '@/model/types/cric-response.type'
import { LoginResponse } from '@/model/response/login.interface'

type SignupFormProps = {
  onSuccess: (email: string) => void
}

export default function SignupForm(props: SignupFormProps) {
  const [email, setEmail] = useState<string>('')
  const [verifyStatus, setVerifyStatus] = useState<string>('')

  const verifyEmailRequest = useMutateRequest(USERS.SEND_OTP_URL, HttpMethod.POST)

  const onEmailChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setEmail(value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void verifyUser()
  }

  const verifyUser = async () => {
    setVerifyStatus('')
    if (validateEmail(email)) {
      const payload: VerifyEmailRequest = {
        email: email.toLowerCase(),
      }
      try {
        const response: CricResponse<LoginResponse> = (await verifyEmailRequest.trigger(
          payload as never,
        )) as CricResponse<LoginResponse>
        if (response?.result) {
          setVerifyStatus('')
          props.onSuccess(email.toLowerCase())
        } else {
          setVerifyStatus('error')
        }
      } catch (e) {
        console.log(e)
        setVerifyStatus('error')
      }
    }
  }

  return (
    <>
      <div className='font-bold text-2xl mb-10'>{AUTH.SIGN_UP.txtSignup}</div>
      <Box
        component='form'
        className='flex flex-col'
        sx={{
          '& .MuiTextField-root': { mb: 3 },
          width: '100%',
        }}
        noValidate
        autoComplete='on'
        onSubmit={handleSubmit}
      >
        <CricEmailField
          id='verify-email'
          label={AUTH.EMAIL.label}
          variant='filled'
          autoComplete='username'
          placeholder={AUTH.EMAIL.placeholder}
          helperText={AUTH.EMAIL.error}
          onChange={onEmailChange}
        />
        <CricAlert
          error={verifyEmailRequest.error || verifyStatus === 'error'}
          message={AUTH.SIGN_UP.error}
        ></CricAlert>
        <div className='mt-3'>
          <CricButton
            isFullWidth={true}
            onClick={() => {}}
            btnTxt={verifyEmailRequest.isMutating ? 'verifying...' : AUTH.SIGN_UP.verifyEmail}
          ></CricButton>
        </div>
      </Box>
    </>
  )
}
