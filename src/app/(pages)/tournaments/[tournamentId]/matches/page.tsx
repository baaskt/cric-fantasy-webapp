'use client'

import { useRequest } from '@/hooks/useRequest'
import { MATCHES } from '@/util/constants/endpoints'
import { MatchEntity } from '@/model/response/match.response'
import { MATCH } from '@/util/constants/constants'
import Loading from '@/components/Loading'
import { useEffect, useState } from 'react'
import { OptionsEntity } from '@/model/entities/options.interface'
import CricTab from '@/components/ui/CricTab'
import { useMatch } from '@/providers/MatchProvider'
import { useTournament } from '@/providers/TournamentProvider'
import MatchPreviewCard from '@/components/matches/MatchPreviewCard'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Upcoming' },
  { id: 2, label: 'Completed' },
]

export default function Matches() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const { matchList } = useMatch()
  const matchRequest = useRequest(tournamentId ? `${MATCHES.GET_ALL}${tournamentId}` : '')
  const [activeScheduleCategory, setActiveScheduleCategory] = useState<OptionsEntity>()

  const [activeMatches, setActiveMatches] = useState<MatchEntity[]>([])
  const [completedMatches, setCompletedMatches] = useState<MatchEntity[]>([])

  const filterMatches = () => {
    const activeMatchList: MatchEntity[] = []
    const compMatchList: MatchEntity[] = []
    matchList.forEach(match => {
      if (
        match.state === TournamentStatusLabel.Completed.toString() ||
        match.state === TournamentStatusLabel.Abandon.toString()
      ) {
        compMatchList.unshift(match)
      } else if (match.state === TournamentStatusLabel.Upcoming.toString()) {
        activeMatchList.push(match)
      }
    })
    console.log(activeMatchList)
    setActiveMatches(activeMatchList)
    setCompletedMatches(compMatchList)
  }

  useEffect(() => {
    filterMatches()
  }, [matchList])

  if (matchRequest.isValidating) {
    return <Loading txt={MATCH.LOADING_TXT}></Loading>
  }

  return (
    <div className='p-5'>
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
