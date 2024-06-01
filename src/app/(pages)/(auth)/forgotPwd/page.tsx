'use client'

import ForgotPwdForm from '@/components/forms/ForgotPwdForm'
import ResetPwdForm from '@/components/forms/ResetPwdForm'
import VerifyOtpForm from '@/components/forms/VerifyOtpForm'
import { AUTH } from '@/util/constants/constants'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPwd() {
  const [forgotPwdStatus, setForgotPwdStatus] = useState<string>('verifyEmail')
  const [email, setEmail] = useState<string>('')

  const handleEmailSuccess = (emailEvent: string) => {
    setEmail(emailEvent)
    setForgotPwdStatus('verifyOtp')
  }

  const handleOtpSuccess = () => {
    setForgotPwdStatus('resetPwd')
  }

  return (
    <div className='flex justify-center flex-col items-center w-3/4 sm:w-2/4'>
      {forgotPwdStatus === 'verifyEmail' && <ForgotPwdForm onSuccess={handleEmailSuccess} />}
      {forgotPwdStatus === 'verifyOtp' && (
        <VerifyOtpForm email={email} onSuccess={handleOtpSuccess} />
      )}
      {forgotPwdStatus === 'resetPwd' && <ResetPwdForm email={email} />}
      <div className='text-base mt-5'>
        {AUTH.SIGN_IN.noAccount}
        <Link className='underline primary-color' href='signup'>
          {AUTH.SIGN_UP.txtSignup}
        </Link>
      </div>
    </div>
  )
}
