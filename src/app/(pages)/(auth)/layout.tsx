import Brand from '@/components/brand'
import { BANNER_DESC } from '@/util/constants'
import Image from 'next/image'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-dvh'>
      <div className='w-full sm:w-1/2'>
        <div className='m-6'>
          {' '}
          <Brand />{' '}
        </div>
        <div className='h-4/5 flex justify-center'> {children}</div>
      </div>
      <div className='hidden md:flex w-1/2 primary-bg justify-center flex-col'>
        <Image
          src='/banner_logo.png'
          width={0}
          height={0}
          alt='Banner Logo'
          sizes='100vw'
          className='self-center'
          style={{ width: '60%', height: 'auto' }}
        />
        <div className='font-bold text-2xl self-center mt-6'>{BANNER_DESC}</div>
      </div>
    </div>
  )
}
