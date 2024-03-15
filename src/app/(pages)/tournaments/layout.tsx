'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { TournamentProvider } from '@/providers/TournamentProvider'
import { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <TournamentProvider>
      <div className='flex flex-row mt-16 ml-0 md:ml-[20%]'>
        <Sidebar show={showSidebar} onClose={setShowSidebar}></Sidebar>
        <div className='flex flex-col w-full'>
          <Header show={showSidebar} toggleMenu={setShowSidebar}></Header>
          {children}
        </div>
      </div>
    </TournamentProvider>
  )
}
