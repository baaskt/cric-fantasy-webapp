import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import StatCard from '../StatCard'
import { prepareFantasyStats, prepareParticipantStats } from '@/util/player'
import { convertDriveUrl } from '@/util/helper'

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
  const { teamName, points, teamMembers, imgUrl } = teamDetail
  const [participantsList, setParticipantsList] = useState<CricMenuEntity[]>([])
  const [fantasyList, setFantasyList] = useState<CricMenuEntity[]>([])
  const teamUrl = convertDriveUrl(imgUrl)

  useEffect(() => {
    const participantStats = prepareParticipantStats(participantStatList, teamMembers)
    setParticipantsList(participantStats)
    const fantasyStats = prepareFantasyStats(fantasyStatList, teamDetail)
    setFantasyList(fantasyStats)
  }, [teamDetail])

  return (
    <div className='flex flex-col gap-10 shadow-lg p-5 h-full md:flex-row'>
      <div className='flex flex-row justify-start items-center gap-5 p-5'>
        <img
          src={teamUrl}
          alt='team profile'
          width='0'
          height='0'
          sizes='100vw'
          className='w-[80px] h-[80px]'
        />
        <div className='flex flex-col items-center'>
          <div className='font-bold uppercase text-xl'>{teamName}</div>
          <div className='text-sm'>{points} POINTS</div>
        </div>
      </div>
      <StatCard title='Team Owners' menuList={participantsList}></StatCard>
      <StatCard title='Fantasy Stats' menuList={fantasyList}></StatCard>
    </div>
  )
}

export default TeamCard
