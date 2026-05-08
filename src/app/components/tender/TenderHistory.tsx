import { useRequest } from '@/hooks/useRequest'
import { TenderPlayerEntity } from '@/model/response/tender-player.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { getInitials } from '@/util/helper'
import { Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { COLORS } from '@/util/colors'
import GavelIcon from '@mui/icons-material/Gavel'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TenderBidHistory from './TenderBidHistory' // adjust import path as needed

interface TenderHistoryProps {
  activePlayerId: string
  myTeamId?: string
  tenderStatus: string
}

function TenderHistory(props: TenderHistoryProps) {
  const { activePlayerId, myTeamId, tenderStatus } = props
  const { activeTournament } = useTournament()
  const [tenderHistoryData, setTenderHistoryData] = useState<TenderPlayerEntity[]>()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const tournamentId = activeTournament?.tournamentId || ''
  const TENDER_PLAYER_URL = tournamentId
    ? TOURNAMENTS.GET_TENDER_PLAYER.replace('tournamentId', tournamentId).concat('?isAll=true')
    : null

  const tenderHistoryRequest = useRequest(TENDER_PLAYER_URL)

  useEffect(() => {
    if (tenderHistoryRequest.data) {
      const tenderHistoryResponse: CricResponse<TenderPlayerEntity[]> =
        tenderHistoryRequest.data as CricResponse<TenderPlayerEntity[]>
      if (tenderHistoryResponse) {
        const tempHistory = tenderHistoryResponse.result
          ?.filter(history => history.playerId !== activePlayerId)
          ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setTenderHistoryData(tempHistory as TenderPlayerEntity[])
      }
    }
  }, [tenderHistoryRequest.data])

  return (
    <div className='flex flex-col gap-2'>
      {!tenderHistoryData?.length ? (
        <p className='text-center text-sm text-indigo-300 py-6'>No history yet - Make one !</p>
      ) : (
        tenderHistoryData?.map((history, historyIndex) => {
          const winningBid = history.bids.reduce(
            (maxBid, bid) => (bid.amount > maxBid.amount ? bid : maxBid),
            history.bids[0],
          )
          const isExpanded = expandedIndex === historyIndex

          return (
            <div key={history.playerId} className='flex flex-col gap-1'>
              <div
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${'bg-purple-50 border-purple-300'} ${history.bids.length ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (history.bids.length) {
                    setExpandedIndex(isExpanded ? null : historyIndex)
                  }
                }}
              >
                {/* Rank badge */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${'bg-emerald-100 text-emerald-700'}`}
                >
                  {historyIndex + 1}
                </div>

                {/* Team avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${'bg-purple-100 text-purple-700'}`}
                >
                  {getInitials(history.playerName)}
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-purple-900 truncate'>
                    {history.playerName}
                  </p>
                  <p className='text-[10px] text-gray-800'>{history.date}</p>
                </div>

                {/* Amount */}
                <div className='flex flex-col justify-center items-center gap-1 shrink-0'>
                  {history.bids.length ? (
                    <div className='flex flex-col justify-center items-center'>
                      <div className={`text-sm font-bold text-purple-600`}>
                        {winningBid?.amount}
                      </div>
                      <Chip
                        label={winningBid?.teamName}
                        size='small'
                        icon={<GavelIcon style={{ fontSize: 11, color: COLORS.cricPrimary }} />}
                        style={{
                          height: 18,
                          fontSize: 10,
                          background: COLORS.cricPrimary + '18',
                          color: COLORS.cricPrimary,
                        }}
                      />
                    </div>
                  ) : (
                    <Chip
                      label='Unsold'
                      size='small'
                      icon={<NotInterestedIcon style={{ fontSize: 11, color: COLORS.cricError }} />}
                      style={{
                        height: 18,
                        fontSize: 10,
                        background: COLORS.cricError + '18',
                        color: COLORS.cricError,
                        marginRight: 30,
                      }}
                    />
                  )}
                </div>

                {/* Expand icon */}
                {history.bids.length > 0 && (
                  <ExpandMoreIcon
                    style={{
                      fontSize: 16,
                      color: COLORS.cricPrimary,
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                )}
              </div>

              {/* Expanded bid history */}
              {isExpanded && history.bids.length > 0 && (
                <div className='mt-2 mb-2 flex flex-col gap-2 pl-4'>
                  {history.bids
                    ?.sort((a, b) => b.amount - a.amount)
                    .map((bid, bidIndex) => (
                      <TenderBidHistory
                        isHistory={true}
                        allBids={history.bids}
                        key={bid.teamId}
                        bid={bid}
                        rank={bidIndex + 1}
                        myTeamId={myTeamId}
                        tenderStatus={tenderStatus}
                      />
                    ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export default TenderHistory
