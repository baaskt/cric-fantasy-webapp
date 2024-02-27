import SignupForm from '@/components/signupForm'
import { AUTH, TITLES } from '@/util/constants/constants'
import Link from 'next/link'

export default function SignUp() {
  return (
    <div className='flex justify-center flex-col items-center w-3/4 sm:w-2/4'>
      <div className='font-bold text-2xl mb-10'>{TITLES.SIGNUP.label}</div>
      <SignupForm />
      <div className='text-base mt-10'>
        {AUTH.SIGN_UP.hasAccount}
        <Link className='underline primary-color' href='login'>
          {AUTH.SIGN_IN.txtSignin}
        </Link>
      </div>
    </div>
  )
}
