// components/Podium.tsx

import React from 'react'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { COLORS } from '@/util/colors'

const Podium: React.FC = () => {
  return (
    <div className='flex gap-2 p-3 flex-col h-64'>
      <div className='flex gap-2 pl-5 items-center'>
        <LeaderboardIcon style={{ color: COLORS.cricPrimary }} />
        <div className='text-xl'>Leaderboard</div>
      </div>
      <div className='flex justify-center items-end space-x-4'>
        <div className='flex flex-col justify-end items-center'>
          <div className='bg-indigo-400 h-40 w-24 flex justify-center items-center text-white font-bold text-8xl'>
            2
          </div>
          <p className='mt-2 truncate w-24 text-center'>Mullaperiyar CC</p>
        </div>
        <div className='flex flex-col justify-end items-center'>
          <div className='bg-indigo-700 h-48 w-24 flex justify-center items-center text-white font-bold text-8xl'>
            1
          </div>
          <p className='mt-2 truncate w-24 text-center'>SSIYAN</p>
        </div>
        <div className='flex flex-col justify-end items-center'>
          <div className='bg-indigo-500 h-32 w-24 flex justify-center items-center text-white font-bold text-8xl'>
            3
          </div>
          <p className='mt-2 truncate w-24 text-center'>Varuthapadatha Valibar Sangam</p>
        </div>
      </div>
    </div>
  )
}

export default Podium
