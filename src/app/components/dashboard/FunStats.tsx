import { useTournament } from '@/providers/TournamentProvider'
import React from 'react'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'

function FunStats() {
  const { activeTournament } = useTournament()

  if (!activeTournament?.funStat) return <></>

  return (
    <div className='mt-1 mb-1'>
      <div className='flex gap-2 p-2 flex-col bg-teal-300 rounded-lg md:flex-row'>
        <div className='flex pl-2 gap-2 items-center'>
          <TipsAndUpdatesIcon />
          <div className='text-xl'>Did you know ?</div>
        </div>
        <div className='p-2'>
          <div>{activeTournament?.funStat}</div>
        </div>
      </div>
    </div>
  )
}

export default FunStats
