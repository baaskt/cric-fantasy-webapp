import { useAuth } from '@/providers/AuthProvider'
import { useTournament } from '@/providers/TournamentProvider'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function PlayingXiWindowAlert() {
  const { user } = useAuth()
  const pathname = usePathname()
  const { activeTournament } = useTournament()
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isWindowOpen, setWindowOpen] = useState(user?.isPlayingXIUpdateOpen)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (activeTournament?.playingXIEndTime) {
        // Replace space with 'T' to make it ISO 8601-like
        const isoString = activeTournament.playingXIEndTime.replace(' ', 'T') + 'Z' // Add Z to mark as UTC
        const targetTime = new Date(isoString)

        const endTimeHrs = targetTime.getUTCHours()
        targetTime.setUTCHours(endTimeHrs, 0, 0, 0)

        // If target time has already passed today, set it to the next day's 12:00 PM IST
        const now = new Date()
        if (now > targetTime) {
          setWindowOpen(false)
        } else {
          // Calculate the difference in milliseconds
          const timeDifference = targetTime.getTime() - now.getTime()

          // Convert milliseconds to hours, minutes, and seconds
          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

          setTimeRemaining({ hours, minutes, seconds })
          setWindowOpen(true)
        }
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [activeTournament])

  if (
    !user ||
    !isWindowOpen ||
    pathname.includes('auction') ||
    activeTournament?.tournamentStatus === 'Completed'
  )
    return <></>

  return (
    <div className='flex p-1 items-center justify-around bg-yellow-300'>
      {/* <NotificationsActiveIcon sx={{ fontSize: 36 }} /> */}
      <div className='flex flex-col items-center justify-center'>
        <div className='pr-1'>Playing XI window closes in</div>
        <div className='font-bold text-md'>
          <span className='pr-1'>{String(timeRemaining.hours).padStart(2, '0')} hours</span>
          <span className='pr-1'>{String(timeRemaining.minutes).padStart(2, '0')} mins</span>
          <span>{String(timeRemaining.seconds).padStart(2, '0')} seconds</span>
        </div>
      </div>
    </div>
  )
}

export default PlayingXiWindowAlert
