import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import React, { useEffect, useMemo, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import StatCard from '../StatCard'
import { prepareFantasyStats, prepareParticipantStats } from '@/util/player'
import { convertDriveUrl } from '@/util/helper'
import { COLORS } from '@/util/colors'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'
import GroupsIcon from '@mui/icons-material/Groups'
import { ALTERNATE_PLAYER_IMAGE_SRC } from '@/util/constants/constants'

const participantStatList: CricMenuEntity[] = [
  { label: 'Owner 1', icon: PersonIcon, value: 'teamMembers' },
  { label: 'Owner 2', icon: PersonIcon, value: 'teamMembers' },
  { label: 'Owner 3', icon: PersonIcon, value: 'teamMembers' },
]

const fantasyStatList: CricMenuEntity[] = [
  // { label: 'Position', icon: PersonIcon, value: 'position' },
  { label: 'Purse Balance', icon: CurrencyRupeeIcon, value: 'purseBalance' },
  { label: 'Squad', icon: GroupsIcon, value: 'squad' },
]

type TeamCardProps = {
  teamDetail: TeamDetailEntity
}
function TeamCard(props: TeamCardProps) {
  const { teamDetail } = props
  const {
    teamName,
    points,
    tournamentPoints,
    totalTenderSpentAmount,
    statPoints,
    teamMembers,
    imgUrl,
    aiRank,
    squad,
  } = teamDetail
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

  const totalTenderPoints = useMemo(() => {
    return squad.reduce((total, squadPlayer) => {
      return squadPlayer.source === 'Tender' ? total + squadPlayer.points : total
    }, 0)
  }, [squad])

  return (
    <div
      className='m-[20px] rounded-3xl p-2 shadow-md transition-all duration-300 bg-gradient-to-br from-violet-800 via-violet-600 to-violet-400'
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className=' px-4 pt-5 pb-0'>
        <div className='flex items-start gap-3 mb-4'>
          <img
            src={teamUrl || ALTERNATE_PLAYER_IMAGE_SRC}
            alt={'team'}
            className='w-16 h-16 rounded-full object-cover'
            style={{ border: '2.5px solid rgba(255,255,255,0.45)' }}
          />

          {/* Name + role + tags */}
          <div className='flex-1 min-w-0'>
            <p className='text-lg font-bold text-white leading-tight'>{teamName}</p>
            <div className='flex gap-1.5 flex-wrap mt-2 mb-2'>
              <span className='bg-white/15 text-indigo-100 text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-white/20'>
                {participantsList.length} {teamMembers?.length > 1 ? 'Owners' : 'Owner'}
              </span>
              <span className='bg-white/15 text-indigo-100 text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-white/20'>
                AI Rank: {aiRank}
              </span>
            </div>
          </div>

          {/* Base price chip */}
          <div className='bg-white/15 border border-white/25 rounded-xl px-3 py-1.5 text-center shrink-0'>
            <p className='text-[10px] text-indigo-200 uppercase tracking-wide'>Total</p>
            <p className='text-base font-bold text-white'>{tournamentPoints}</p>
          </div>
        </div>

        <div className='grid grid-cols-4 border-y border-white/15 -mx-4'>
          {[
            { label: 'Match Points', value: `${points}` },
            { label: 'Milestone Points', value: `${statPoints}` },
            {
              label: 'Tender Gain',
              value: `${totalTenderPoints}`,
            },
            {
              label: 'Tender Spend',
              value: `${totalTenderSpentAmount > 0 ? '-' : ''}${totalTenderSpentAmount}`,
            },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              className={`py-2.5 text-center ${i < arr.length - 1 ? 'border-r border-white/15' : ''}`}
            >
              <p className='text-base font-bold text-white'>{s.value}</p>
              <p className='text-[10px] text-indigo-100'>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Hint */}
      <div className='mt-4 text-xs text-center text-gray-200'>
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
