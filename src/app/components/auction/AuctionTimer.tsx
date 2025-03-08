import { useAuction } from '@/providers/AuctionProvider'
import React, { useEffect, useState } from 'react'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { IconButton } from '@mui/material'

function AuctionTimer() {
  const { biddingHistory } = useAuction()
  const defaultTime = 10
  const maxTime = 20
  const [timeRemaining, setTimeRemaining] = useState(defaultTime)

  useEffect(() => {
    if (timeRemaining <= 0) return // Stop when time reaches 0

    const interval = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  useEffect(() => {
    if (biddingHistory.length) {
      const newTime = Math.min(timeRemaining + 10, maxTime)
      setTimeRemaining(newTime)
    }
  }, [biddingHistory])

  const resetTimer = () => {
    setTimeRemaining(20)
  }

  // Function to dynamically calculate background color from green (20s) to red (0s)
  const getBackgroundColor = () => {
    const red = Math.min(255, Math.floor(((maxTime - timeRemaining) / maxTime) * 255)) // Gradually increases red
    const green = Math.min(255, Math.floor((timeRemaining / maxTime) * 255)) // Gradually decreases green
    return `rgb(${red}, ${green}, 0)` // Creates a smooth transition from green to red
  }

  // Function to determine text color based on brightness
  const getTextColor = () => {
    const red = Math.min(255, Math.floor(((maxTime - timeRemaining) / maxTime) * 255))
    const green = Math.min(255, Math.floor((timeRemaining / maxTime) * 255))

    // Brightness formula (0.299*R + 0.587*G + 0.114*B)
    const brightness = 0.299 * red + 0.587 * green

    return brightness < 128 ? 'text-white' : 'text-black' // Dark background = white text, light background = black text
  }

  return (
    <div
      className={`flex p-3 items-center justify-around rounded-xl transition-colors duration-500`}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className='flex flex-row items-center justify-center'>
        <div className={`font-bold text-xl ${getTextColor()}`}>
          <span>
            {timeRemaining > 0
              ? `${String(timeRemaining).padStart(2, '0')} seconds`
              : 'Waiting for host...'}
          </span>{' '}
        </div>
        <IconButton onClick={resetTimer}>
          <RestartAltIcon fontSize={'large'} className={getTextColor()} />
        </IconButton>
      </div>
    </div>
  )
}

export default AuctionTimer
