'use client'

import { MatchEntity } from '@/model/response/match.response'
import { useEffect, useState } from 'react'
import { OptionsEntity } from '@/model/entities/options.interface'
import CricTab from '@/components/ui/CricTab'
import { useMatch } from '@/providers/MatchProvider'
import MatchPreviewCard from '@/components/matches/MatchPreviewCard'
import { MatchStatusLabel } from '@/model/enum/match-status.enum'
import EmptyData from '@/components/EmptyData'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Upcoming' },
  { id: 2, label: 'Completed' },
]

export default function Matches() {
  const { matchList } = useMatch()
  const [activeScheduleCategory, setActiveScheduleCategory] = useState<OptionsEntity>()

  const [activeMatches, setActiveMatches] = useState<MatchEntity[]>([])
  const [completedMatches, setCompletedMatches] = useState<MatchEntity[]>([])

  const filterMatches = () => {
    const activeMatchList: MatchEntity[] = []
    const compMatchList: MatchEntity[] = []
    matchList.forEach(match => {
      if (
        match.state === MatchStatusLabel.Completed.toString() ||
        match.state === MatchStatusLabel.Abandon.toString()
      ) {
        compMatchList.unshift(match)
      } else if (match.state === MatchStatusLabel.Upcoming.toString()) {
        activeMatchList.push(match)
      }
    })
    setActiveMatches(activeMatchList)
    setCompletedMatches(compMatchList)
  }

  useEffect(() => {
    filterMatches()
  }, [matchList])

  if (!matchList?.length) {
    return (
      <EmptyData
        title={'Matches not scheduled'}
        subTitle={'The ground is being setup. Please check back later for the match schedule.'}
        imagePath='/assets/images/empty-match.png'
      />
    )
  }

  return (
    <div className='pt-0 p-5'>
      <CricTab
        optionList={tabOptions}
        selectedTab={activeScheduleCategory}
        onChange={setActiveScheduleCategory}
      >
        <div className='flex flex-row flex-wrap justify-center gap-3 p-2'>
          {activeMatches.map((matchEntity, matchIndex) => (
            <MatchPreviewCard key={matchIndex} matchEntity={matchEntity}></MatchPreviewCard>
          ))}
        </div>
        <div className='flex flex-row flex-wrap justify-center gap-3 p-2'>
          {completedMatches.map((matchEntity, matchIndex) => (
            <MatchPreviewCard key={matchIndex} matchEntity={matchEntity}></MatchPreviewCard>
          ))}
        </div>
      </CricTab>
    </div>
  )
}
