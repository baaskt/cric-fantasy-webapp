'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { COLORS } from '@/util/colors'
import { MatchDetail, PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { useRequest } from '@/hooks/useRequest'
import { PLAYERS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { useParams } from 'next/navigation'
import Loading from '@/components/Loading'
import { PLAYER } from '@/util/constants/constants'
import EmptyData from '@/components/EmptyData'
import {
  BattingComparison,
  MatchCard,
  SectionTitle,
  StatCard,
} from '@/components/players/PlayerDetailUtil'
import PlayerInsights from '@/components/players/PlayerInsights'
import PointsTimelineChart from '@/components/players/PointsTimelineChart'
import { PlayerDetailDrawer } from '@/components/players/PlayerDetailDrawer'
import PlayerHeroCard from '@/components/players/detail/PlayerHeroCard'
import PlayerMilestoneBreakdown from '@/components/players/PlayerMilestoneBreakdown'
import PlayerBidHistory from '@/components/players/detail/PlayerBidHistory'

export default function PlayerDetail() {
  const params = useParams()
  const [activeMatch, setActiveMatch] = useState<MatchDetail | null>(null)
  const [playerDetailEntity, setPlayerDetailEntity] = useState<PlayerDetailEntity>()
  const [tab, setTab] = useState<'tournament' | 't20 stats' | 'bid history'>('tournament')

  const playerId = params.playerId
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const PLAYER_DETAIL_URL = tournamentId
    ? `${PLAYERS.GET_PLAYER_DETAIL_URL.replace('{tournamentId}', tournamentId).replace(
        '{playerId}',
        playerId.toString(),
      )}`
    : ''
  const playerDetailRequest = useRequest(PLAYER_DETAIL_URL)

  useEffect(() => {
    if (playerDetailRequest.data) {
      const playerDetailResponse: CricResponse<PlayerDetailEntity> =
        playerDetailRequest.data as CricResponse<PlayerDetailEntity>
      if (playerDetailResponse.result) {
        const tempPlayerDetail = playerDetailResponse.result
        if (tempPlayerDetail) {
          tempPlayerDetail.matchDetails = tempPlayerDetail.matchDetails.sort(
            (a, b) => Number(b.matchId) - Number(a.matchId),
          )
          setPlayerDetailEntity(tempPlayerDetail)
        }
      }
    }
  }, [playerDetailRequest.data])

  if (playerDetailRequest.isValidating || playerDetailRequest.isLoading) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (playerDetailRequest.error && !playerDetailEntity) {
    return (
      <EmptyData
        title={'No Player Details Available'}
        subTitle={'Player is out for an emergency break. Please check back later for the insights.'}
        imagePath='/assets/images/empty-match.png'
      />
    )
  }

  if (!playerDetailEntity) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  return (
    <div
      className='min-h-screen pb-8 px-4 pt-4'
      style={{
        background: COLORS.cricPrimaryUltraLight,
        color: COLORS.cricDark,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <PlayerHeroCard playerDetailEntity={playerDetailEntity} />
      <PlayerInsights playerDetailEntity={playerDetailEntity} />
      <PlayerMilestoneBreakdown playerDetailEntity={playerDetailEntity} />
      {/* ── STATS TABS ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className='rounded-3xl p-4 mb-4'
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.gray}`,
          boxShadow: `0 2px 16px ${COLORS.cricPrimaryLight}`,
        }}
      >
        {/* Tab switcher */}
        <div className='flex gap-1 mb-5 p-1 rounded-2xl' style={{ background: COLORS.inputBg }}>
          {(['tournament', 't20 stats', 'bid history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className='flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all'
              style={{
                background: tab === t ? COLORS.cricPrimary : 'transparent',
                color: tab === t ? COLORS.white : COLORS.darkGray,
                boxShadow: tab === t ? `0 2px 8px ${COLORS.cricPrimaryLight}` : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'tournament' && (
          <>
            <SectionTitle>Playing XI vs Total Stats</SectionTitle>
            <BattingComparison
              ts={playerDetailEntity.tournamentStats}
              team={playerDetailEntity.teamStats}
            />
            <div className='flex gap-4 mt-1 mb-4 justify-center'>
              <span
                className='flex items-center gap-1.5 text-xs'
                style={{ color: COLORS.darkGray }}
              >
                <span className='w-3 h-3 rounded' style={{ background: COLORS.cricPrimary }} />{' '}
                Player
              </span>
              <span
                className='flex items-center gap-1.5 text-xs'
                style={{ color: COLORS.darkGray }}
              >
                <span className='w-3 h-3 rounded' style={{ background: COLORS.cricPrimaryLight }} />{' '}
                Team avg
              </span>
            </div>
            <div className='grid grid-cols-3 gap-2'>
              {[
                { label: 'Average', value: playerDetailEntity.tournamentStats.average },
                {
                  label: 'Strike Rate',
                  value: Math.round(playerDetailEntity.tournamentStats.strikeRate),
                },
                { label: 'Boundaries', value: playerDetailEntity.tournamentStats.boundaries },
                { label: 'Catches', value: playerDetailEntity.tournamentStats.catches },
                { label: '50s', value: playerDetailEntity.tournamentStats['50s'] },
                { label: '100s', value: playerDetailEntity.tournamentStats['100s'] },
              ].map(s => (
                <StatCard key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </>
        )}

        {tab === 't20 stats' && (
          <div className='grid grid-cols-3 gap-2'>
            {(Object.entries(playerDetailEntity.t20) as [string, string][]).map(([k, v]) => (
              <StatCard key={k} label={k} value={v} />
            ))}
          </div>
        )}

        {tab === 'bid history' && (
          <PlayerBidHistory auction={playerDetailEntity.auction}></PlayerBidHistory>
        )}
      </motion.div>

      {playerDetailEntity.matchDetails?.length > 3 && (
        <PointsTimelineChart matchDetails={playerDetailEntity.matchDetails} />
      )}

      {/* ── MATCH DIARY ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SectionTitle>Match Diary</SectionTitle>
        <div className='space-y-2'>
          {playerDetailEntity.matchDetails.map((m, i) => (
            <MatchCard key={m.matchId} match={m} rank={i} onInfo={setActiveMatch} />
          ))}
        </div>
      </motion.div>

      <PlayerDetailDrawer
        match={activeMatch}
        playerDetailEntity={playerDetailEntity}
        onClose={() => setActiveMatch(null)}
      />
    </div>
  )
}
