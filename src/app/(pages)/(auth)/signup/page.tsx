'use client'

import CreateAccountForm from '@/components/forms/CreateAccountForm'
import SignupForm from '@/components/forms/SignupForm'
import VerifyOtpForm from '@/components/forms/VerifyOtpForm'
import { AUTH } from '@/util/constants/constants'
import Link from 'next/link'
import { useState } from 'react'

export default function SignUp() {
  const [signupStatus, setSignupStatus] = useState<string>('verifyEmail')
  const [email, setEmail] = useState<string>('')

  const handleEmailSuccess = (emailEvent: string) => {
    setEmail(emailEvent)
    setSignupStatus('verifyOtp')
  }

  const handleOtpSuccess = () => {
    setSignupStatus('createAccount')
  }

  return (
    <div className='flex justify-center flex-col items-center w-3/4 sm:w-2/4'>
      {signupStatus === 'verifyEmail' && <SignupForm onSuccess={handleEmailSuccess} />}
      {signupStatus === 'verifyOtp' && <VerifyOtpForm email={email} onSuccess={handleOtpSuccess} />}
      {signupStatus === 'createAccount' && <CreateAccountForm email={email} />}
      <div className='text-base mt-10'>
        {AUTH.SIGN_UP.hasAccount}
        <Link className='underline primary-color' href='login'>
          {AUTH.SIGN_IN.txtSignin}
        </Link>
      </div>
    </div>
  )
}
