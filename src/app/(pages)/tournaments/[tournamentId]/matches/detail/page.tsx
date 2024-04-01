'use client'

import Loading from '@/components/Loading'
import AdminCentre from '@/components/matches/AdminCentre'
import Overview from '@/components/matches/Overview'
import ScoreCard from '@/components/matches/ScoreCard'
import CricTab from '@/components/ui/CricTab'
import { useRequest } from '@/hooks/useRequest'
import { auth } from '@/lib/auth'
import { OptionsEntity } from '@/model/entities/options.interface'
import { MatchDetailEntity } from '@/model/response/match-detail.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { useAuth } from '@/providers/AuthProvider'
import { MATCH } from '@/util/constants/constants'
import { MATCHES } from '@/util/constants/endpoints'
import { useEffect, useMemo, useState } from 'react'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Overview', value: 'overview' },
  { id: 2, label: 'Scorecard', value: 'scoreCard' },
  { id: 3, label: 'Admin Center', value: 'adminCenter' },
]

function MatchDetail() {
  const { isAdmin } = useAuth()
  const matchId = auth().getMatchId()
  const [matchDetailEntity, setMatchDetailEntity] = useState<MatchDetailEntity>()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])
  const MATCH_DETAIL_URL = matchId ? `${MATCHES.GET_SCORECARD_URL}${matchId}` : ''
  const matchDetailRequest = useRequest(MATCH_DETAIL_URL)

  useEffect(() => {
    if (matchDetailRequest.data) {
      const matchDetailResponse: CricResponse<MatchDetailEntity> =
        matchDetailRequest.data as CricResponse<MatchDetailEntity>
      if (matchDetailResponse.result) {
        setMatchDetailEntity(matchDetailResponse.result)
      }
    }
  }, [matchDetailRequest.data])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  const findAdminTabs = () => {
    if (!isAdmin()) {
      return tabOptions
    } else {
      return tabOptions.filter(tab => tab.id !== 3)
    }
  }
  const updatedTabs = useMemo(() => findAdminTabs(), [])

  if (matchDetailRequest.isValidating) {
    return <Loading txt={MATCH.LOADING_TXT}></Loading>
  }

  return (
    <div>
      <div className='flex flex-row justify-between p-5'>
        <CricTab optionList={updatedTabs} selectedTab={selectedTab} onChange={handleChange} />
      </div>
      {selectedTab.id === 1 && <Overview scoreCardData={matchDetailEntity} />}
      {selectedTab.id === 2 && matchDetailEntity && <ScoreCard scoreCardData={matchDetailEntity} />}
      {selectedTab.id === 3 && matchDetailEntity && (
        <AdminCentre scoreCardData={matchDetailEntity} />
      )}
    </div>
  )
}

export default MatchDetail
