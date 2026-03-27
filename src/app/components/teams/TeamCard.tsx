import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import StatCard from '../StatCard'
import { prepareFantasyStats, prepareParticipantStats } from '@/util/player'
import { convertDriveUrl } from '@/util/helper'
import { COLORS } from '@/util/colors'

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
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const participantStats = prepareParticipantStats(participantStatList, teamMembers)
    setParticipantsList(participantStats)
    const fantasyStats = prepareFantasyStats(fantasyStatList, teamDetail)
    setFantasyList(fantasyStats)
  }, [teamDetail])

  return (
    <div
      className='m-[20px] rounded-3xl p-5 shadow-md transition-all duration-300'
      style={{
        background: COLORS.cricPrimaryUltraLight,
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* COLLAPSED HEADER */}
      <div className='flex flex-row justify-around items-center text-center gap-2 cursor-pointer'>
        {/* Image */}
        <div className='relative'>
          <img
            src={teamUrl}
            alt='team'
            className='w-20 h-20 rounded-full object-cover border-4 border-white shadow-md'
          />
        </div>

        <div className='flex flex-col items-center'>
          <div className='font-bold uppercase text-gray-800'>{teamName}</div>
          <div
            className='mt-2 px-3 py-3 rounded-full text-sm font-semibold w-fit'
            style={{
              backgroundColor: COLORS.cricPrimaryLight,
              color: COLORS.white,
            }}
          >
            {points} Points
          </div>
        </div>
      </div>
      {/* Toggle Hint */}
      <div className='mt-4 text-xs text-center text-gray-400'>
        {isOpen ? 'Tap to collapse ▲' : 'Tap to expand ▼'}
      </div>
      {/* EXPANDABLE CONTENT */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 mt-5' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div
            className='bg-white rounded-2xl p-4 shadow-sm border'
            style={{ borderColor: COLORS.cricPrimary }}
          >
            <div className='text-sm font-semibold mb-2' style={{ color: COLORS.cricPrimary }}>
              Team Owners
            </div>
            <StatCard title='' menuList={participantsList} />
          </div>

          <div
            className='bg-white rounded-2xl p-4 shadow-sm border'
            style={{ borderColor: COLORS.cricPrimary }}
          >
            <div className='text-sm font-semibold mb-2' style={{ color: COLORS.cricPrimary }}>
              Fantasy Stats
            </div>
            <StatCard title='' menuList={fantasyList} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamCard
