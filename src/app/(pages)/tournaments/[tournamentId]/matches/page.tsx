'use client'

import MatchList from '@/components/matches/MatchList'
import { useRequest } from '@/hooks/useRequest'
import { MATCHES } from '@/util/constants/endpoints'
import { MatchEntity } from '@/model/response/match.response'
import { CricResponse } from '@/model/types/cric-response.type'
import { MATCH } from '@/util/constants/constants'
import Loading from '@/components/Loading'
import { useEffect, useState } from 'react'
import { OptionsEntity } from '@/model/entities/options.interface'
import CricTab from '@/components/ui/CricTab'
import { useMatch } from '@/providers/MatchProvider'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Active' },
  { id: 2, label: 'Completed' },
]

export default function Matches() {
  const { matchList, setMatchesList, activeScheduleCategory, setActiveScheduleCategory } =
    useMatch()
  const matchRequest = useRequest(MATCHES.GET_ALL)
  const [activeMatches, setActiveMatches] = useState<MatchEntity[]>([])
  const [completedMatches, setCompletedMatches] = useState<MatchEntity[]>([])

  useEffect(() => {
    if (matchRequest.data) {
      const matchresponse: CricResponse<MatchEntity[]> = matchRequest.data as CricResponse<
        MatchEntity[]
      >
      if (matchresponse.result) {
        setMatchesList(matchresponse.result)
      }
    }
  }, [matchRequest?.data])

  const filterMatches = () => {
    const tempActiveMatchList: MatchEntity[] = []
    const tempCompMatchList: MatchEntity[] = []
    matchList.forEach(match => {
      if (match.state === 'Complete') {
        tempCompMatchList.unshift(match)
      } else {
        tempActiveMatchList.push(match)
      }
    })
    setActiveMatches(tempActiveMatchList)
    setCompletedMatches(tempCompMatchList)
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
        <MatchList matchList={activeMatches} />
        <MatchList matchList={completedMatches} />
      </CricTab>
    </div>
  )
}
