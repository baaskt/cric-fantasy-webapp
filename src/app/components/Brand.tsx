import { APP_NAME } from '@/util/constants/constants'
import Image from 'next/image'

export default function Brand() {
  return (
    <div className='flex gap-1 items-center'>
      <Image src='/assets/logo/logo.png' width={40} height={40} alt='Brand Logo' />
      <span className='font-bold text-2xl self-center'>{APP_NAME}</span>
    </div>
  )
}
