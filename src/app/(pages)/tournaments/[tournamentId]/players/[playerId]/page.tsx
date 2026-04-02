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
import { ALTERNATE_PLAYER_IMAGE_SRC, PLAYER } from '@/util/constants/constants'
import EmptyData from '@/components/EmptyData'
import { convertDriveUrl } from '@/util/helper'
import { currencyToString } from '@/util/bidding'
import {
  BattingComparison,
  MatchCard,
  PointRadar,
  SectionTitle,
  StatCard,
} from '@/components/players/PlayerDetailUtil'
import PlayerInsights from '@/components/players/PlayerInsights'
import PointsTimelineChart from '@/components/players/PointsTimelineChart'
import { PlayerDetailDrawer } from '@/components/players/PlayerDetailDrawer'

export default function PlayerDetail() {
  const params = useParams()
  const [activeMatch, setActiveMatch] = useState<MatchDetail | null>(null)
  const [playerDetailEntity, setPlayerDetailEntity] = useState<PlayerDetailEntity>()
  const [tab, setTab] = useState<'tournament' | 't20 stats' | 'overview'>('tournament')

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

  if (!playerDetailEntity) {
    return (
      <EmptyData
        title={'No Player Details Available'}
        subTitle={'Player is out for an emergency break. Please check back later for the insights.'}
        imagePath='/assets/images/empty-match.png'
      />
    )
  }

  const matchPoints = playerDetailEntity.matchDetails.reduce((s, m) => s + m.totalMatchPoints, 0)
  const playerUrl = convertDriveUrl(playerDetailEntity.imageUrl)

  return (
    <div
      className='min-h-screen pb-28 px-4 pt-4'
      style={{
        background: COLORS.cricPrimaryUltraLight,
        color: COLORS.cricDark,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative overflow-hidden rounded-3xl mb-4'
        style={{
          background: `linear-gradient(135deg, ${COLORS.cricPrimary} 0%, #9b59f7 55%, #c084fc 100%)`,
          boxShadow: `0 8px 32px ${COLORS.cricPrimaryLight}`,
        }}
      >
        {/* Decorative blobs */}
        <div
          className='absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 pointer-events-none'
          style={{ background: COLORS.white }}
        />
        <div
          className='absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10 pointer-events-none'
          style={{ background: COLORS.cricSecondary }}
        />

        <div className='relative flex items-start gap-4 p-4'>
          {/* Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex justify-between'>
              <div>
                <h1 className='text-2xl font-black text-white leading-tight'>
                  {playerDetailEntity.name}
                </h1>
                <p className='text-sm mt-0.5 text-white/70'>{playerDetailEntity.overview.club}</p>
                <p className='text-sm mt-0.5 text-white/70'>
                  {playerDetailEntity.overview.nationality}
                </p>
              </div>
              <div className='relative shrink-0'>
                <img
                  src={playerUrl || ALTERNATE_PLAYER_IMAGE_SRC}
                  alt={playerDetailEntity.name}
                  className='w-20 h-20 rounded-2xl object-cover'
                  style={{ border: '2.5px solid rgba(255,255,255,0.45)' }}
                />
                <span
                  className='absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase'
                  style={{ background: COLORS.cricSecondary, color: COLORS.white }}
                >
                  {playerDetailEntity.role}
                </span>
              </div>
            </div>

            <div className='flex gap-4 mt-3 items-center justify-center'>
              <div
                className='shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold max-w-[200px]'
                style={{ background: 'rgba(255,255,255,0.2)', color: COLORS.white }}
              >
                {playerDetailEntity.overview.fantasyTeam}
              </div>
              <div>
                <div>
                  <p className='text-[10px] uppercase tracking-widest text-white/50'>Auction</p>
                  <p className='font-black text-white'>
                    {playerDetailEntity.overview.auctionPrice
                      ? currencyToString(playerDetailEntity.overview.auctionPrice)
                      : 'Price N/A'}
                  </p>
                </div>
                <div className='w-px self-stretch bg-white/20' />
                <div>
                  <p className='text-[10px] uppercase tracking-widest text-white/50'>Base</p>
                  <p className='font-semibold text-white/60'>
                    {currencyToString(playerDetailEntity.overview.basePrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div
          className='grid grid-cols-3 text-center py-3'
          style={{ background: 'rgba(0,0,0,0.14)', borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          {[
            { label: 'Total Points', value: playerDetailEntity.tournamentStats.points },
            { label: 'Match Points', value: matchPoints },
            {
              label: 'Milestone Points',
              value: playerDetailEntity.tournamentStats.tournamentPoints,
            },
          ].map((k, i, arr) => (
            <div
              key={k.label}
              className='flex flex-col'
              style={{
                borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.15)' : undefined,
              }}
            >
              <span className='text-[10px] uppercase tracking-widest text-white/50'>{k.label}</span>
              <span className='text-lg font-black text-white'>{k.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <PlayerInsights playerDetailEntity={playerDetailEntity} />

      {/* ── POINT BREAKDOWN ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className='rounded-3xl p-4 mb-4'
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.gray}`,
          boxShadow: `0 2px 16px ${COLORS.cricPrimaryLight}`,
        }}
      >
        <SectionTitle>Milestone Points Breakdown</SectionTitle>
        <PointRadar pts={playerDetailEntity.tournamentPointDetails} />

        <div className='grid grid-cols-2 gap-2 mt-2'>
          {(Object.entries(playerDetailEntity.tournamentPointDetails) as [string, number][]).map(
            ([k, v]) => (
              <div
                key={k}
                className='flex justify-between items-center px-3 py-2.5 rounded-xl'
                style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.gray}` }}
              >
                <span className='text-xs capitalize font-medium' style={{ color: COLORS.darkGray }}>
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span
                  className='text-sm font-black'
                  style={{
                    color:
                      v < 0 ? COLORS.cricError : v === 0 ? COLORS.placeholder : COLORS.cricPrimary,
                  }}
                >
                  {v}
                </span>
              </div>
            ),
          )}
        </div>
      </motion.div>

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
          {(['tournament', 't20 stats', 'overview'] as const).map(t => (
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

        {tab === 'overview' && (
          <div className='space-y-2'>
            {[
              { label: 'Nationality', value: playerDetailEntity.overview.nationality },
              { label: 'Club', value: playerDetailEntity.overview.club },
              { label: 'Fantasy Team', value: playerDetailEntity.overview.fantasyTeam },
              {
                label: 'Base Price',
                value: currencyToString(playerDetailEntity.overview.basePrice),
              },
              {
                label: 'Auction Price',
                value: currencyToString(playerDetailEntity.overview.auctionPrice),
              },
            ].map(row => (
              <div
                key={row.label}
                className='flex justify-between items-center px-4 py-3 rounded-2xl'
                style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.gray}` }}
              >
                <span className='text-sm' style={{ color: COLORS.darkGray }}>
                  {row.label}
                </span>
                <span className='text-sm font-bold' style={{ color: COLORS.cricDark }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
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

      <PlayerDetailDrawer match={activeMatch} onClose={() => setActiveMatch(null)} />
    </div>
  )
}
