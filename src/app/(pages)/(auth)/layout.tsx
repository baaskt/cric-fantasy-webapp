import Brand from '@/components/BrandComp'
import { AUTH } from '@/util/constants/constants'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'CriKCC Fantasy Authentication',
  description: 'Login or Signup for CriKCC Fantasy',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-dvh'>
      <div className='w-full sm:w-1/2'>
        <div className='m-6'>
          <Brand />
        </div>
        <div className='h-4/5 flex justify-center'> {children}</div>
      </div>
      <div className='hidden sm:flex w-1/2 primary-bg justify-center flex-col'>
        <Image
          src='/assets/images/banner_logo.png'
          width={0}
          height={0}
          alt='Banner Logo'
          sizes='100vw'
          className='self-center'
          style={{ width: '60%', height: 'auto' }}
        />
        <div className='font-bold text-2xl self-center mt-6'>
          {AUTH.BANNER_DESC}
        </div>
      </div>
    </div>
  )
}
