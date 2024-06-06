'use client'

import DailySpin from '@/components/spin/DailySpin'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import useMobile from '@/hooks/useMobile'
import { useAuth } from '@/providers/AuthProvider'
import { PlayerProvider } from '@/providers/PlayerProvider'
import { TeamProvider } from '@/providers/TeamProvider'
import { TournamentProvider } from '@/providers/TournamentProvider'
import { useEffect, useState } from 'react'
import PlayingXiWindowAlert from '@/components/PlayingXiWindowAlert'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [isSpinOpen, setSpinOpen] = useState(false)
  const isMobileView = useMobile()
  const { user } = useAuth()

  useEffect(() => {
    if (user && isMobileView) {
      setSpinOpen(user.canSpin)
    }
  }, [user, isMobileView])

  const handleSpinEnd = () => {
    setSpinOpen(false)
  }

  return (
    <TournamentProvider>
      <TeamProvider>
        <PlayerProvider>
          <div className='flex flex-row mt-16 ml-0 md:ml-[20%]'>
            <Sidebar show={showSidebar} onClose={setShowSidebar}></Sidebar>
            <div className='flex flex-col w-full'>
              <Header show={showSidebar} toggleMenu={setShowSidebar}></Header>
              <PlayingXiWindowAlert />
              {children}
            </div>
            <DailySpin isSpinActive={isSpinOpen} onClose={handleSpinEnd} />
          </div>
        </PlayerProvider>
      </TeamProvider>
    </TournamentProvider>
  )
}
