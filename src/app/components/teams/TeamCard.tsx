import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import { COLORS } from '@/util/colors'
import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import StatCard from '../StatCard'
import { prepareFantasyStats, prepareParticipantStats } from '@/util/player'

const participantStatList: CricMenuEntity[] = [
  { label: 'Owner 1', icon: PersonIcon, value: 'teamMembers' },
  { label: 'Owner 2', icon: PersonIcon, value: 'teamMembers' },
  { label: 'Owner 3', icon: PersonIcon, value: 'teamMembers' },
]

const fantasyStatList: CricMenuEntity[] = [
  // { label: 'Position', icon: PersonIcon, value: 'position' },
  { label: 'Purse Balance', icon: PersonIcon, value: 'purseBalance' },
  { label: 'Squad', icon: PersonIcon, value: 'squad' },
]

type TeamCardProps = {
  teamDetail: TeamDetailEntity
}
function TeamCard(props: TeamCardProps) {
  const { teamDetail } = props
  const { teamName, points, teamMembers } = teamDetail
  const [participantsList, setParticipantsList] = useState<CricMenuEntity[]>([])
  const [fantasyList, setFantasyList] = useState<CricMenuEntity[]>([])

  useEffect(() => {
    const participantStats = prepareParticipantStats(participantStatList, teamMembers)
    setParticipantsList(participantStats)
    const fantasyStats = prepareFantasyStats(fantasyStatList, teamDetail)
    setFantasyList(fantasyStats)
  }, [teamDetail])

  return (
    <div className='flex flex-col gap-10 shadow-lg p-5 h-full md:flex-row'>
      <div className='flex flex-row justify-start items-center gap-5 p-5'>
        <Avatar
          sx={{
            bgcolor: COLORS.cricPrimary,
            width: 60,
            height: 60,
            textTransform: 'capitalize',
          }}
          alt='Team Profile'
        ></Avatar>
        <div className='flex flex-col items-center'>
          <div className='font-bold uppercase text-xl'>{teamName}</div>
          <div className='text-sm'>{points} POINTS</div>
        </div>
      </div>
      <div className='shadow-lg p-5'>
        <StatCard title='Team Owners' menuList={participantsList}></StatCard>
      </div>
      <div className='shadow-lg p-5'>
        <StatCard title='Fantasy Stats' menuList={fantasyList}></StatCard>
      </div>
    </div>
  )
}

export default TeamCard
