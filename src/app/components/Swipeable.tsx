import React, { ReactNode, useState } from 'react'

type SwipeableProps = {
  children: ReactNode
  value: number
  minValue: number
  maxValue: number
  onChangeIndex: (newValue: number) => void
}

const Swipeable = (props: SwipeableProps) => {
  const { value, minValue, maxValue, children, onChangeIndex } = props
  const [startX, setStartX] = useState<number>(0)
  const [endX, setEndX] = useState<number>(0)
  const minSwipeDistance = 50

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setStartX(event.touches[0].clientX)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    setEndX(event.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const deltaX = endX - startX
    if (deltaX < -minSwipeDistance) {
      //left swipe
      console.log('left')
      onChangeIndex(value < maxValue ? value + 1 : maxValue)
    } else if (deltaX > minSwipeDistance) {
      //right swipe
      console.log('right')
      onChangeIndex(value > minValue ? value - 1 : minValue)
    }
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  )
}

export default Swipeable
