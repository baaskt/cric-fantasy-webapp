import React from 'react'
import CricAnimatedDots from './ui/CricAnimatedDots'

type LoadingProps = {
  txt: string
}

function Loading(props: LoadingProps) {
  return (
    <div className='flex flex-row gap-3 items-center p-5'>
      <div>
        <CricAnimatedDots />
        <span className='sr-only'>Loading...</span>
      </div>
      <p>{props.txt}</p>
    </div>
  )
}

export default Loading
