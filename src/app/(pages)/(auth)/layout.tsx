import Brand from '@/components/brand'
import { BANNER_DESC } from '@/util/constants'
import Image from 'next/image'

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log('Abi', children)
  return (
    <div className='flex h-dvh'>
      <div className='w-1/2'>
        <div className='m-6'>
          {' '}
          <Brand />{' '}
        </div>
        <div> {children}</div>
      </div>
      <div className='w-1/2 primary-bg flex justify-center flex-col'>
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
