import Image from 'next/image'
import React from 'react'

function EmptyData() {
  return (
    <div>
      <Image
        src={'/assets/images/img_no_data.png'}
        width={80}
        height={40}
        alt='Data not found'
        className='self-center'
        // style={{ width: '60%', height: 'auto' }}
      />
    </div>
  )
}

export default EmptyData
