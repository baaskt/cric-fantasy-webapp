import Image from 'next/image'
import React from 'react'

type EmptyDataProps = {
  title: string
  subTitle: string
  imagePath?: string
}
function EmptyData(props: EmptyDataProps) {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center p-4'>
      <Image
        src={props.imagePath ? props.imagePath : '/assets/images/img_no_data.png'}
        width={500}
        height={500}
        alt='Data not found'
        className='self-center'
        // style={{ width: '60%', height: '100%' }}
      />
      <div className='text-2xl font-bold mt-5'>{props.title}</div>
      <div className='mt-2 text-sm'>{props.subTitle}</div>
    </div>
  )
}

export default EmptyData
