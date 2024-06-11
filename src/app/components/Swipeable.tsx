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
  const minSwipeDistance = 80

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setStartX(event.targetTouches[0].clientX)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const endX = event.changedTouches[0].clientX
    const deltaX = endX - startX
    const absDeltaX = Math.abs(Math.abs(endX) - Math.abs(startX))
    if (absDeltaX > minSwipeDistance && deltaX < minSwipeDistance && endX) {
      //left swipe
      onChangeIndex(value < maxValue ? value + 1 : maxValue)
    } else if (deltaX > minSwipeDistance && endX) {
      //right swipe
      onChangeIndex(value > minValue ? value - 1 : minValue)
    }
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  )
}

export default Swipeable
