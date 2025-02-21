import { useAuth } from '@/providers/AuthProvider'
import React, { useEffect, useState } from 'react'

function PlayingXiWindowAlert() {
  const { user } = useAuth()
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()

      const targetTime = new Date(now)
      targetTime.setUTCHours(6, 30, 0, 0) // 6:30 AM UTC = 12:00 PM IST

      // If target time has already passed today, set it to the next day's 12:00 PM IST
      if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1)
      }

      // Calculate the difference in milliseconds
      const timeDifference = targetTime.getTime() - now.getTime()

      // Convert milliseconds to hours, minutes, and seconds
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

      setTimeRemaining({ hours, minutes, seconds })
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!user || !user.isPlayingXIUpdateOpen) return <></>

  return (
    <div className='flex p-3 items-center justify-around bg-yellow-300'>
      {/* <NotificationsActiveIcon sx={{ fontSize: 36 }} /> */}
      <div className='flex flex-col items-center justify-center'>
        <div className='pr-1'>Playing XI window closes in</div>
        <div className='font-bold text-lg'>
          <span className='pr-1'>{String(timeRemaining.hours).padStart(2, '0')} hours</span>
          <span className='pr-1'>{String(timeRemaining.minutes).padStart(2, '0')} mins</span>
          <span>{String(timeRemaining.seconds).padStart(2, '0')} seconds</span>
        </div>
      </div>
    </div>
  )
}

export default PlayingXiWindowAlert
