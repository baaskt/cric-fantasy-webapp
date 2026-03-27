import React, { useMemo } from 'react'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import { COLORS } from '@/util/colors'
import { TeamPointsEntity } from '@/model/response/team-points.interface'
import PodiumCard from './PodiumCard'

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
      <div className='flex gap-2 pt-2 items-center'>
        <MilitaryTechIcon style={{ color: COLORS.cricPrimary }} />
        <div className='text-xl'>Stalwarts</div>
      </div>
      <div className='flex justify-center items-end gap-6 py-6'>
        {/* 2nd Place */}
        <PodiumCard
          position={POS_2 + 1}
          team={sortedTeams[POS_2]}
          height='h-40'
          bg='bg-gradient-to-b from-indigo-300 to-indigo-500'
          textColor='text-indigo-500'
          index={1}
        />

        {/* 1st Place (highlighted) */}
        <PodiumCard
          position={POS_1 + 1}
          team={sortedTeams[POS_1]}
          height='h-52'
          bg='bg-gradient-to-b from-indigo-600 to-indigo-800'
          textColor='text-indigo-700'
          highlight
          index={0}
        />

        {/* 3rd Place */}
        <PodiumCard
          position={POS_3 + 1}
          team={sortedTeams[POS_3]}
          height='h-32'
          bg='bg-gradient-to-b from-indigo-400 to-indigo-600'
          textColor='text-indigo-400'
          index={2}
        />
      </div>
    </div>
  )
}

export default Podium
