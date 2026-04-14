import React from 'react'
import Skeleton from '@mui/material/Skeleton'
function PlayerDetailSkeleton() {
  return (
    <div className='p-2'>
      <Skeleton height='450px' />
      <Skeleton height='50px' width='100%' />
      <Skeleton height='50px' width='100%' />
      <Skeleton height='50px' width='100%' />
      <Skeleton height='50px' width='100%' />
      <Skeleton width='60%' />
      <Skeleton width='60%' />
      <Skeleton width='60%' />
      <Skeleton width='60%' />
      <Skeleton width='60%' />
      <Skeleton width='60%' />
    </div>
  )
}

export default PlayerDetailSkeleton
