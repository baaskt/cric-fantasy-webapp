import React from 'react'
import MatchPreviewCard from './MatchPreviewCard'
import { useMatch } from '@/providers/MatchProvider'
import CricAnimatedDots from '../ui/CricAnimatedDots'

type MatchPreviewListProps = {
  showLiveMatches?: boolean
  showUpcomingMatches?: boolean
}
function MatchPreviewList(props: MatchPreviewListProps) {
  const { showLiveMatches = false, showUpcomingMatches = false } = props
  const { matchList, upcomingMatches, liveMatches } = useMatch()

  if (!matchList) return <CricAnimatedDots></CricAnimatedDots>

  return (
    <>
      {showLiveMatches && liveMatches?.length ? (
        <>
          <div className='flex flex-row gap-2 font-bold items-center'>
            <span className='m-2 w-3 h-3 bg-green-500 rounded-full'></span>
            Live <span className='text-sm font-normal'>( Click to view scorecard )</span>
          </div>
          <div className='flex flex-row flex-wrap justify-center gap-3 p-2'>
            {liveMatches.map((matchEntity, matchIndex) => (
              <MatchPreviewCard key={matchIndex} matchEntity={matchEntity}></MatchPreviewCard>
            ))}
          </div>
        </>
      ) : (
        showUpcomingMatches && (
          <>
            {upcomingMatches.length ? <div className='font-bold'>Upcoming matches</div> : null}
            <div className='flex flex-row flex-wrap justify-center gap-3 p-2'>
              {upcomingMatches.map((matchEntity, matchIndex) => (
                <MatchPreviewCard key={matchIndex} matchEntity={matchEntity}></MatchPreviewCard>
              ))}
            </div>
          </>
        )
      )}
    </>
  )
}

export default MatchPreviewList
