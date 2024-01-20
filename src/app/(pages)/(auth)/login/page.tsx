import { NO_ACCOUNT, TITLE_SIGNIN, TXT_SIGNUP } from '@/util/constants'
import Link from 'next/link'

export default function Login() {
  return (
    <div className='flex justify-center flex-col'>
      <div className='font-bold text-2xl'>{TITLE_SIGNIN}</div>
      <div className='text-sm'>
        {NO_ACCOUNT}{' '}
        <Link className='underline primary-color' href='signup'>
          {TXT_SIGNUP}
        </Link>
      </div>
    </div>
  )
}
