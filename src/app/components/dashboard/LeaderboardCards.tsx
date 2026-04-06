import React from 'react'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { COLORS } from '@/util/colors'
import { convertUtcToLocal } from '@/util/helper'
import { TeamPointsEntity } from '@/model/response/team-points.interface'
import { useRouter } from 'next/navigation'
import { useTeam } from '@/providers/TeamProvider'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
type LeaderboardCardsProps = {
  teamList: TeamPointsEntity[]
}
function LeaderboardCards(props: LeaderboardCardsProps) {
  const { teamList } = props
  const { markActiveTeam } = useTeam()
  const router = useRouter()

  const navigateToTeamDetail = (teamId: string | number) => {
    const selectedTeam = teamList.find(team => team.teamId === teamId)
    if (selectedTeam) markActiveTeam(teamId.toString())
    router.push('teams/detail')
  }

  const getColorClass = (teamPosition: number) => {
    if (teamPosition === 1) {
      return 'bg-yellow-500 text-white'
    }
    if (teamPosition === 2) {
      return 'bg-gray-300 text-gray-900'
    }
    if (teamPosition === 3) {
      return 'bg-orange-800 text-white'
    }
    return 'bg-violet-200 text-gray-800' // Default color for other cases
  }

  return (
    <div className='mt-24'>
      <div className='flex gap-2 p-2 flex-col md:flex-row'>
        <div className='flex gap-2 items-center'>
          <LeaderboardIcon style={{ color: COLORS.cricPrimary }} />
          <div className='text-xl'>Leaderboard</div>
        </div>
        {teamList[0].pointsUpdatedAt && (
          <div className='text-sm italic text-gray-500 md:text-lg'>{`( Last updated : ${convertUtcToLocal(teamList[0].pointsUpdatedAt)} )`}</div>
        )}
      </div>
      {teamList.map((team, teamIndex) => (
        <div
          key={team.teamId}
          className='transition-transform duration-150 ease-in-out shadow-md p-4 rounded-lg flex flex-row justify-between items-center active:scale-95'
          onClick={() => navigateToTeamDetail(team.teamId)}
        >
          <div className='flex flex-row items-center gap-4'>
            <div
              className={`font-bold rounded-full w-10 h-10 flex justify-center items-center ${getColorClass(teamIndex + 1)}`}
            >
              {teamIndex + 1}
            </div>
            <div>
              <div className='font-bold'>{team.teamName}</div>
              {team.statPoints ? (
                <div className='text-sm text-slate-600'>Milestone: {team.statPoints} points</div>
              ) : (
                <></>
              )}

              {team.aiRank && (
                <div className='flex items-center gap-2'>
                  {/* <AssistantIcon className='bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded text-white' />{' '} */}
                  <div className='text-sm bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>
                    AI Ranking: {team.aiRank}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='text-right'>
            <div className='text-md font-bold text-slate-600'>{team.tournamentPoints}</div>
            <div
              className={`text-md flex gap-1 items-center justify-end ${team.tournamentPoints - team.prevPoints > 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {team.tournamentPoints - team.prevPoints > 0 ? (
                <TrendingUpIcon sx={{ fontSize: 14 }} />
              ) : team.tournamentPoints - team.prevPoints < 0 ? (
                <TrendingDownIcon sx={{ fontSize: 14 }} />
              ) : (
                <SentimentVeryDissatisfiedIcon sx={{ fontSize: 16 }} />
              )}
              {team.tournamentPoints - team.prevPoints !== 0
                ? team.tournamentPoints - team.prevPoints
                : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LeaderboardCards
