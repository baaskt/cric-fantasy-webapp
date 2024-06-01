'use client'

import React, { FormEvent, useState, ChangeEvent, KeyboardEvent } from 'react'
import Box from '@mui/material/Box'
import CricButton from '../ui/CricButton'
import { AUTH } from '@/util/constants/constants'
import { validateOtp } from '@/util/validation'
import { USERS } from '@/util/constants/endpoints'
import CricAlert from '../ui/CricAlert'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { ResendOtpRequest, VerifyOtpRequest } from '@/model/request/login-request.type'
import { CricResponse } from '@/model/types/cric-response.type'
import { LoginResponse } from '@/model/response/login.interface'
import Link from 'next/link'
import CricTextField from '../ui/CricTextField'

type VerifyOtpFormProps = {
  email: string
  onSuccess: () => void
}

export default function VerifyOtpForm(props: VerifyOtpFormProps) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [otpStatus, setOtpStatus] = useState<string>('')
  const [seconds, setSeconds] = useState<number>(0)
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false)

  const verifyOtpRequest = useMutateRequest(USERS.VERIFY_OTP_URL, HttpMethod.POST)
  const resendOtpRequest = useMutateRequest(USERS.RESEND_OTP_URL, HttpMethod.POST)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newOtp = [...otp]
    const { value } = e.target
    newOtp[index] = value
    setOtp(newOtp)

    // Move focus to the next input if it's empty
    if (index < otp.length - 1 && value !== '') {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0) {
      // const nextInput = document.getElementById(`otp-${index - 1}`);
      // nextInput?.focus();
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleResend = () => {
    setSeconds(30)
    setIsResendDisabled(true)
    void resendOtp()

    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer)
          setIsResendDisabled(false)
          return 0
        }
        return prevSeconds - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void verifyOtp()
  }

  const verifyOtp = async () => {
    setOtpStatus('')
    if (validateOtp(otp[0])) {
      const payload: VerifyOtpRequest = {
        email: props.email,
        otp: otp.join(''),
      }
      try {
        const response: CricResponse<LoginResponse> = (await verifyOtpRequest.trigger(
          payload as never,
        )) as CricResponse<LoginResponse>
        if (response?.result) {
          setOtpStatus('')
          props.onSuccess()
        } else {
          setOtpStatus('error')
        }
      } catch (e) {
        console.log(e)
        setOtpStatus('error')
      }
    }
  }

  const resendOtp = async () => {
    const payload: ResendOtpRequest = {
      email: props.email,
    }
    try {
      const response: CricResponse<LoginResponse> = (await resendOtpRequest.trigger(
        payload as never,
      )) as CricResponse<LoginResponse>
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className='font-bold text-2xl mb-5'>{AUTH.VERIFY_OTP.label}</div>
      <div className='text-md text-slate-500 mb-5'>{`${AUTH.VERIFY_OTP.desc}${props.email}`}</div>
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
        <div id='otp-form' className='flex justify-center mb-1 gap-2'>
          {[1, 2, 3, 4].map((_, index) => (
            <CricTextField
              key={index}
              id={`otp-${index}`}
              type='text'
              inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
              onChange={e => handleChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={handleFocus}
            />
          ))}
        </div>
        <CricAlert
          error={verifyOtpRequest.error || otpStatus === 'error'}
          message={AUTH.VERIFY_OTP.error}
        ></CricAlert>
        <div className='flex justify-center'>
          {!isResendDisabled ? (
            <Link className='primary-color text-center' href='' onClick={handleResend}>
              {AUTH.VERIFY_OTP.resendOtp}
            </Link>
          ) : (
            <span className='ml-4 text-gray-700'>take a break until... {seconds}s</span>
          )}
        </div>
        <div className='mt-5'>
          <CricButton
            isFullWidth={true}
            onClick={() => {}}
            btnTxt={verifyOtpRequest.isMutating ? 'verifying...' : AUTH.VERIFY_OTP.confirm}
          ></CricButton>
        </div>
      </Box>
    </>
  )
}
