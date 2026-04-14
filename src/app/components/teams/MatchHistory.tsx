import React, { useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton } from '@mui/material'
import { COLORS } from '@/util/colors'
import EmptyData from '../EmptyData'
import { MatchHistoryDetails } from '@/model/response/match-history-response.interface'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import MatchHistoryDrawer from '../matches/history/MatchHistoryDrawer'
import CommonHero from '../CommonHero'
import HistoryIcon from '@mui/icons-material/History'
import { useMatch } from '@/providers/MatchProvider'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SportsCricketIcon from '@mui/icons-material/SportsCricket'
type MatchHistoryProps = {
  teamName: string
  matchHistory: MatchHistoryDetails[]
}
function MatchHistory(props: MatchHistoryProps) {
  const { teamName, matchHistory } = props
  const { completedMatches } = useMatch()
  const [matchData, setMatchData] = useState<MatchHistoryDetails | null>()

  const handlePlayerDetail = (matchData: MatchHistoryDetails) => {
    setMatchData(matchData)
  }

  function pointsTier(pts: number): {
    bar: string
    badge: string
    badgeText: string
    label: string
  } {
    if (pts >= 150)
      return {
        bar: 'bg-violet-500',
        badge: 'bg-violet-50',
        badgeText: 'text-violet-700',
        label: 'Excellent',
      }
    if (pts >= 80)
      return { bar: 'bg-teal-500', badge: 'bg-teal-50', badgeText: 'text-teal-700', label: 'Good' }
    if (pts >= 40)
      return {
        bar: 'bg-amber-400',
        badge: 'bg-amber-50',
        badgeText: 'text-amber-700',
        label: 'Average',
      }
    return { bar: 'bg-rose-400', badge: 'bg-rose-50', badgeText: 'text-rose-600', label: 'Low' }
  }

  const maxPts = Math.max(...matchHistory.map(m => m.totalMatchPoints), 1)

  if (!matchHistory || !matchHistory.length) {
    return (
      <EmptyData
        title={'No Match History Available'}
        subTitle={'Come back later when the commentators are back with the match details.'}
        imagePath='/assets/images/empty-match.png'
      />
    )
  }

  const latestMatch =
    completedMatches && completedMatches.length
      ? completedMatches[completedMatches.length - 1]
      : null

  return (
    <div className='flex flex-col w-full gap-2 mt-5 bg-[#f5f3ff]'>
      <CommonHero
        title='Match History'
        desc='A match appears here only if your team had at least one player who participated in the match and earned points.'
        icon={<HistoryIcon sx={{ fontSize: 22 }} />}
        stats={[
          {
            icon: <CalendarTodayIcon sx={{ fontSize: 14 }} />,
            label: latestMatch
              ? `Latest: ${latestMatch.team1SName} vs ${latestMatch.team2SName}`
              : '—',
          },
          {
            icon: <SportsCricketIcon sx={{ fontSize: 14 }} />,
            label: matchHistory
              ? `${matchHistory.length} / ${completedMatches.length} matches`
              : '—',
          },
        ]}
      />
      <div className='mt-4 px-3 pb-8 space-y-2.5'>
        {matchHistory.map(matchData => {
          const tier = pointsTier(matchData.totalMatchPoints)
          const pct = Math.round((matchData.totalMatchPoints / maxPts) * 100)

          return (
            <div
              key={matchData.matchId}
              className='group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${tier.bar} rounded-l-2xl`} />

              <div className='flex items-center gap-3 pl-4 pr-2 py-3'>
                {/* Main content */}
                <div className='flex-1 min-w-0'>
                  {/* Match description */}
                  <p className='font-bold text-[13px] text-gray-900 truncate leading-tight'>
                    {matchData.matchDesc}
                  </p>

                  {/* Points row */}
                  <div className='flex items-center gap-2 mt-1.5'>
                    <EmojiEventsIcon
                      sx={{ fontSize: 13, color: COLORS.cricPrimary, opacity: 0.8 }}
                    />
                    <span className='text-[12px] font-semibold text-gray-500'>
                      {matchData.totalMatchPoints}
                      <span className='font-normal ml-0.5'>pts</span>
                    </span>
                    {matchData.matchStatus.includes('No result') ? (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600`}
                      >
                        No Result
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tier.badge} ${tier.badgeText}`}
                      >
                        {tier.label}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className='mt-2 h-[3px] w-full rounded-full bg-gray-100 overflow-hidden'>
                    <div
                      className={`h-full rounded-full ${tier.bar} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Info button */}
                <IconButton
                  size='small'
                  onClick={() => handlePlayerDetail(matchData)}
                  className='shrink-0 !rounded-xl'
                  sx={{
                    background: 'rgba(109,40,217,0.06)',
                    '&:hover': { background: 'rgba(109,40,217,0.12)' },
                    transition: 'background 0.15s',
                    padding: '6px',
                  }}
                >
                  <InfoIcon sx={{ fontSize: 18, color: COLORS.cricPrimary }} />
                </IconButton>
              </div>
            </div>
          )
        })}
      </div>

      {matchData && (
        <MatchHistoryDrawer
          teamName={teamName}
          matchData={matchData}
          onClose={() => setMatchData(null)}
        />
      )}
    </div>
  )
}

export default MatchHistory
