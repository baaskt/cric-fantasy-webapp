'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { PlayerProvider } from '@/providers/PlayerProvider'
import { TeamProvider } from '@/providers/TeamProvider'
import { TournamentProvider } from '@/providers/TournamentProvider'
import { useState } from 'react'
import PlayingXiWindowAlert from '@/components/PlayingXiWindowAlert'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false)

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
          </div>
        </PlayerProvider>
      </TeamProvider>
    </TournamentProvider>
  )
}
