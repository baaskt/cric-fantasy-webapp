import Image from 'next/image'
import React from 'react'

type BallSpin = {
  isSpinAnimate?: boolean
  spinDegree?: number
  beginSpin?: () => void
}

function BallSpin(props: BallSpin) {
  const { isSpinAnimate, spinDegree, beginSpin } = props
  return (
    <div>
      <div className={`flex flex-col justify-center items-center `} onClick={beginSpin}>
        <Image
          src='/assets/images/spin_ball.png'
          width={0}
          height={0}
          alt='Banner Logo'
          sizes='100vw'
          style={{ width: '50%', height: 'auto', transform: `rotateZ(${spinDegree}deg)` }}
          className={`self-center origin-center ${isSpinAnimate ? 'ball-animate' : ''}`}
        />
        <Image
          src='/assets/images/cricket_ground.webp'
          width={0}
          height={0}
          alt='Banner Logo'
          sizes='100vw'
          className={`self-center`}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      {!isSpinAnimate && (
        <p className='flex justify-center w-full absolute bottom-8 font-pacifico text-lg p-5 text-white'>
          Touch the ball to start spinning
        </p>
      )}
    </div>
  )
}

export default BallSpin
