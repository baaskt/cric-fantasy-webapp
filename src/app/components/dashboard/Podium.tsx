import React, { useMemo } from 'react'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import { COLORS } from '@/util/colors'
import { TeamPointsEntity } from '@/model/response/team-points.interface'

type PodiumProps = {
  teamList: TeamPointsEntity[]
}

function Podium(props: PodiumProps) {
  const { teamList } = props

  const sortStalwarts = () => {
    return teamList.sort((a, b) => b.tournamentPoints - a.tournamentPoints)
  }

  const sortedTeams = useMemo(() => sortStalwarts(), [teamList])

  const POS_1 = 0,
    POS_2 = 1,
    POS_3 = 2

  if (sortedTeams.length < 3) return <></>

  return (
    <div className='flex gap-2 flex-col h-64'>
      <div className='flex gap-2 p-2 items-center'>
        <MilitaryTechIcon style={{ color: COLORS.cricPrimary }} />
        <div className='text-xl'>Stalwarts</div>
      </div>
      <div className='flex justify-center items-end space-x-4'>
        <div className='flex flex-col justify-end items-center'>
          <div className='bg-indigo-400 h-40 w-24 flex justify-center items-center text-white font-bold text-8xl'>
            {POS_2 + 1}
          </div>
          <p className='mt-2 truncate w-24 text-center'>{sortedTeams[POS_2]?.teamName}</p>
          <p className='mt-2 truncate w-24 text-center text-indigo-400'>
            {sortedTeams[POS_2]?.tournamentPoints}
          </p>
        </div>
        <div className='flex flex-col justify-end items-center'>
          <div className='bg-indigo-700 h-48 w-24 flex justify-center items-center text-white font-bold text-8xl'>
            {POS_1 + 1}
          </div>
          <p className='mt-2 truncate w-24 text-center'>{sortedTeams[POS_1]?.teamName}</p>
          <p className='mt-2 truncate w-24 text-center text-indigo-700'>
            {sortedTeams[POS_1]?.tournamentPoints}
          </p>
        </div>
        <div className='flex flex-col justify-end items-center'>
          <div className='bg-indigo-500 h-32 w-24 flex justify-center items-center text-white font-bold text-8xl'>
            {POS_3 + 1}
          </div>
          <p className='mt-2 truncate w-24 text-center'>{sortedTeams[POS_3]?.teamName}</p>
          <p className='mt-2 truncate w-24 text-center text-indigo-500'>
            {sortedTeams[POS_3]?.tournamentPoints}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Podium
