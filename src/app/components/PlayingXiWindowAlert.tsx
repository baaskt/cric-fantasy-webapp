import { useAuth } from '@/providers/AuthProvider'
import React, { useEffect, useState } from 'react'

function PlayingXiWindowAlert() {
  const { user } = useAuth()
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()

      // Get the current time in UTC
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 6000)

      // Get the current time in IST (UTC + 5:30)
      const istNow = new Date(utcNow.getTime() + (5 * 60 + 30) * 60000)

      // Get 6 PM IST today
      const targetTime = new Date(istNow)
      targetTime.setHours(18, 0, 0, 0) // 6 PM in IST

      // If it's already past 6 PM IST, set the target to 6 PM tomorrow
      if (istNow.getHours() >= 18) {
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

  if (!user || user.isPlayingXIUpdateOpen) return <></>

  return (
    <div className='flex p-3 items-center justify-center flex-col bg-yellow-300'>
      <div className='pr-1'>Playing XI window closes in</div>
      <div className='font-bold text-lg'>
        <span className='pr-1'>{String(timeRemaining.hours).padStart(2, '0')} hours</span>
        <span className='pr-1'>{String(timeRemaining.minutes).padStart(2, '0')} mins</span>
        <span>{String(timeRemaining.seconds).padStart(2, '0')} seconds</span>
      </div>
    </div>
  )
}

export default PlayingXiWindowAlert
