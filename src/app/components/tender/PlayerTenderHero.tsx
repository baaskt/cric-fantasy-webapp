'use client'

import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import { currencyToString } from '@/util/bidding'
import { ALTERNATE_PLAYER_IMAGE_SRC } from '@/util/constants/constants'
import { convertDriveUrl } from '@/util/helper'
import { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useMatch } from '@/providers/MatchProvider'
import { PlayerMatchHistory } from '../players/PlayerMatchHistory'
import { MatchStatusLabel } from '@/model/enum/match-status.enum'

function PlayerTenderHero({ playerData }: { playerData: PlayerDetailEntity }) {
  const [detailedStatsOpen, setDetailedStatsOpen] = useState(false)
  const [isMatchHistoryOpen, setIsMatchHistoryOpen] = useState(false)
  const { name, role, overview, t20, tournamentStats, auction } = playerData
  const playerUrl = convertDriveUrl(playerData.imageUrl)
  const { matchList } = useMatch()
  const [clubMatchCount, setClubMatchCount] = useState<number>(0)
  const [clubSName, setClubSName] = useState<string>('')
  const detailStats = [
    { label: 'Total Matches', value: t20.matches },
    { label: 'Runs', value: t20.runs },
    { label: 'Wickets', value: t20.wickets },
    { label: 'S/R', value: t20.strikeRate },
    { label: '50s', value: t20['50s'] },
    { label: '100s', value: t20['100s'] },
  ]

  useEffect(() => {
    if (overview.club) {
      const sName = overview.club
        .split(' ')
        .map(w => w[0])
        .join('')
      setClubSName(sName)
    }
  }, [overview])

  useEffect(() => {
    if (matchList?.length && clubSName) {
      const matchCount = matchList.reduce((count, match) => {
        const t1 = match.team1SName?.toLowerCase()
        const t2 = match.team2SName?.toLowerCase()
        if (
          (t1 === clubSName.toLowerCase() || t2 === clubSName.toLowerCase()) &&
          (match.state === MatchStatusLabel.Completed.toString() ||
            match.state === MatchStatusLabel.Abandon.toString())
        ) {
          return count + 1
        }
        return count
      }, 0)
      setClubMatchCount(matchCount)
    }
  }, [matchList, clubSName])

  const totalMatchesRemaining = matchList.reduce((count, match) => {
    const t1 = match.team1SName?.toLowerCase()
    const t2 = match.team2SName?.toLowerCase()
    if (
      (t1 === clubSName.toLowerCase() || t2 === clubSName.toLowerCase()) &&
      match.state === MatchStatusLabel.Upcoming.toString()
    ) {
      return count + 1
    }
    return count
  }, 0)

  return (
    <div className='bg-white rounded-2xl border border-indigo-100 overflow-hidden mb-3'>
      {/* Hero banner */}
      <div className='bg-gradient-to-br from-indigo-800 via-indigo-600 to-indigo-400 px-4 pt-5 pb-0'>
        <div className='flex items-start gap-3 mb-4'>
          {/* Avatar */}
          {/* <div className='w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-bold text-white shrink-0'>
              {getInitials(name)}
            </div> */}
          <img
            src={playerUrl || ALTERNATE_PLAYER_IMAGE_SRC}
            alt={playerData.name}
            className='w-16 h-16 rounded-full object-cover'
            style={{ border: '2.5px solid rgba(255,255,255,0.45)' }}
          />

          {/* Name + role + tags */}
          <div className='flex-1 min-w-0'>
            <p className='text-lg font-bold text-white leading-tight'>{name}</p>
            <p className='text-xs text-indigo-200 font-medium mt-0.5 mb-2'>{role}</p>
            <div className='flex gap-1.5 flex-wrap'>
              <span className='bg-white/15 text-indigo-100 text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-white/20'>
                {overview.nationality}
              </span>
              <span className='bg-white/15 text-indigo-100 text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-white/20'>
                {clubSName}
              </span>
            </div>
          </div>

          {/* Base price chip */}
          <div className='bg-white/15 border border-white/25 rounded-xl px-3 py-1.5 text-center shrink-0'>
            <p className='text-[10px] text-indigo-200 uppercase tracking-wide'>Base</p>
            <p className='text-base font-bold text-white'>{currencyToString(auction.basePrice)}</p>
          </div>
        </div>

        {/* Quick stats row */}
        <div className='grid grid-cols-4 border-t border-white/15 -mx-4'>
          {[
            { label: 'Matches', value: `${playerData.matchDetails?.length} / ${clubMatchCount}` },
            { label: 'Runs', value: tournamentStats.runs },
            { label: 'Wickets', value: tournamentStats.wickets },
            {
              label: 'Total Points',
              value: tournamentStats.points + tournamentStats.tournamentPoints,
            },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              className={`py-2.5 text-center ${i < arr.length - 1 ? 'border-r border-white/15' : ''}`}
            >
              <p className='text-base font-bold text-white'>{s.value}</p>
              <p className='text-[10px] text-indigo-300'>{s.label}</p>
            </div>
          ))}
        </div>
        <div className='p-2 text-[12px] text-white'>
          Remaining matches for {clubSName}: {totalMatchesRemaining}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setDetailedStatsOpen(v => !v)}
        className='w-full flex items-center justify-between px-4 py-3 border-t border-indigo-100 text-xs font-bold text-indigo-600 bg-white'
      >
        <span>T20 Stats</span>
        <ExpandMoreIcon
          fontSize='small'
          className={`text-indigo-500 transition-transform duration-200 ${detailedStatsOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapse body */}
      {detailedStatsOpen && (
        <div className='px-4 pb-4 bg-white'>
          <div className='grid grid-cols-3 gap-2'>
            {detailStats.map(s => (
              <div key={s.label} className='bg-indigo-50 rounded-xl p-2.5'>
                <p className='text-sm font-bold text-indigo-800'>{s.value}</p>
                <p className='text-[10px] text-indigo-400 mt-0.5'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setIsMatchHistoryOpen(v => !v)}
        className='w-full flex items-center justify-between px-4 py-3 border-t border-indigo-100 text-xs font-bold text-indigo-600 bg-white'
      >
        <span>Match History</span>
        <ExpandMoreIcon
          fontSize='small'
          className={`text-indigo-500 transition-transform duration-200 ${isMatchHistoryOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapse body */}
      {isMatchHistoryOpen && (
        <div className='px-4 pb-4 bg-white'>
          <div className='space-y-2'>
            {playerData.matchDetails.map((m, i) => (
              <PlayerMatchHistory
                key={m.matchId}
                match={m}
                rank={i}
                playerId={playerData.playerId}
                playerName={playerData.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerTenderHero
