'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { TournamentProvider } from '@/providers/TournamentProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TournamentProvider>
      <div className='flex flex-row mt-16 ml-[20%]'>
        <Sidebar></Sidebar>
        <div className='flex flex-col w-full'>
          <Header></Header>
          {children}
        </div>
      </div>
    </TournamentProvider>
  )
}
