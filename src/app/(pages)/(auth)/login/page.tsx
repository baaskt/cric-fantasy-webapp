import LoginForm from '@/components/forms/LoginForm'
import { AUTH, TITLES } from '@/util/constants/constants'
import Link from 'next/link'

export default function Login() {
  return (
    <div className='flex justify-center flex-col items-center w-3/4 sm:w-2/4'>
      <div className='font-bold text-2xl mb-10'>{TITLES.SIGNIN.label}</div>
      <LoginForm />
      <Link className='primary-color mt-5' href='forgotPwd'>
        {AUTH.FORGOT_PWD.label}
      </Link>
      <div className='text-base mt-5'>
        {AUTH.SIGN_IN.noAccount}
        <Link className='underline primary-color' href='signup'>
          {AUTH.SIGN_UP.txtSignup}
        </Link>
      </div>
    </div>
  )
}
