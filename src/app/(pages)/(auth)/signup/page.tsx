import SignupForm from '@/components/signupForm'
import { AUTH, TITLES } from '@/util/constants'
import Link from 'next/link'

export default function SignUp() {
  return (
    <div className='flex justify-center flex-col items-center w-3/4 sm:w-2/4'>
      <div className='font-bold text-2xl mb-10'>{TITLES.SIGNUP}</div>
      <SignupForm />
      <div className='text-base mt-10'>
        {AUTH.SIGN_UP.HAS_ACCOUNT}
        <Link className='underline primary-color' href='login'>
          {AUTH.SIGN_IN.TXT_SIGNIN}
        </Link>
      </div>
    </div>
  )
}
