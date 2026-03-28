'use client'

import Loading from '@/components/Loading'
import AdminCentre from '@/components/matches/AdminCentre'
import Overview from '@/components/matches/Overview'
import ScoreCard from '@/components/matches/ScoreCard'
import CricTab from '@/components/ui/CricTab'
import { useRequest } from '@/hooks/useRequest'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { auth } from '@/lib/auth'
import { OptionsEntity } from '@/model/entities/options.interface'
import { MatchDetailEntity } from '@/model/response/match-detail.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { useAuth } from '@/providers/AuthProvider'
import { MATCH } from '@/util/constants/constants'
import { MATCHES } from '@/util/constants/endpoints'
import { useEffect, useMemo, useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'Overview', value: 'overview' },
  { id: 2, label: 'Scorecard', value: 'scoreCard' },
  { id: 3, label: 'Admin Centre', value: 'adminCenter' },
]

function MatchDetail() {
  const { isAdmin } = useAuth()
  const matchId = auth().getMatchId()
  const [matchDetailEntity, setMatchDetailEntity] = useState<MatchDetailEntity>()
  const [refreshStatus, setRefreshStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )

  const MATCH_DETAIL_URL = matchId ? `${MATCHES.GET_SCORECARD_URL}${matchId}` : ''
  const matchDetailRequest = useRequest(MATCH_DETAIL_URL)

  const refreshUrl = matchId ? `${MATCHES.REFRESH_SCORECARD}${matchId}/score-card` : 'noop'
  const { trigger: refreshScorecard } = useMutateRequest(refreshUrl, HttpMethod.PUT)

  useEffect(() => {
    if (matchDetailRequest.data) {
      const matchDetailResponse: CricResponse<MatchDetailEntity> =
        matchDetailRequest.data as CricResponse<MatchDetailEntity>
      if (matchDetailResponse.result) {
        setMatchDetailEntity(matchDetailResponse.result)
      }
    }
  }, [matchDetailRequest.data])

  const handleRefresh = async () => {
    setRefreshStatus('loading')
    try {
      await refreshScorecard(undefined as never)
      await matchDetailRequest.mutate()
      setRefreshStatus('success')
      setTimeout(() => setRefreshStatus('idle'), 2500)
    } catch {
      setRefreshStatus('error')
      setTimeout(() => setRefreshStatus('idle'), 2500)
    }
  }

  const findAdminTabs = () => {
    if (isAdmin()) {
      return tabOptions
    } else {
      return tabOptions.filter(tab => tab.id !== 3)
    }
  }
  const updatedTabs = useMemo(() => findAdminTabs(), [isAdmin])

  if (matchDetailRequest.isValidating || !matchDetailEntity) {
    return <Loading txt={MATCH.LOADING_TXT}></Loading>
  }

  const isLoading = refreshStatus === 'loading'
  const isSuccess = refreshStatus === 'success'
  const isError = refreshStatus === 'error'

  return (
    <div style={{ position: 'relative' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {isAdmin() && (
        <div style={{ position: 'absolute', top: 8, right: 12, zIndex: 10 }}>
          <button
            onClick={() => void handleRefresh()}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '.04em',
              border: '1.5px solid',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all .2s',
              background: isSuccess ? '#d1fae5' : isError ? '#fee2e2' : '#eff6ff',
              borderColor: isSuccess ? '#10b981' : isError ? '#ef4444' : '#2454d4',
              color: isSuccess ? '#065f46' : isError ? '#991b1b' : '#2454d4',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isSuccess ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
            ) : isError ? (
              <ErrorOutlineIcon sx={{ fontSize: 14 }} />
            ) : (
              <RefreshIcon
                sx={{
                  fontSize: 14,
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                }}
              />
            )}
            {isSuccess
              ? 'Updated!'
              : isError
                ? 'Failed'
                : isLoading
                  ? 'Refreshing…'
                  : 'Refresh Scorecard'}
          </button>
        </div>
      )}
      <CricTab optionList={updatedTabs} padding={true}>
        <Overview scoreCardData={matchDetailEntity} />
        <ScoreCard scoreCardData={matchDetailEntity} />
        <AdminCentre scoreCardData={matchDetailEntity} />
      </CricTab>
    </div>
  )
}

export default MatchDetail
