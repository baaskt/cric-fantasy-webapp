import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import { COLORS } from '@/util/colors'
import PlayerHeroCard from './PlayerHeroCard'
import PlayerInsights from '../PlayerInsights'
import PlayerMilestoneBreakdown from '../PlayerMilestoneBreakdown'
import { motion } from 'framer-motion'
import { BattingComparison, SectionTitle, StatCard } from '../PlayerDetailUtil'
import PointsTimelineChart from '../PointsTimelineChart'
import PlayerBidHistory from './PlayerBidHistory'
import { useState } from 'react'
import { PlayerMatchHistory } from '../PlayerMatchHistory'

interface PlayerAllDetailProps {
  playerDetailEntity: PlayerDetailEntity
}
const PlayerAllDetail = (props: PlayerAllDetailProps) => {
  const { playerDetailEntity } = props
  const [tab, setTab] = useState<'tournament' | 't20 stats' | 'bid history'>('tournament')

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
              team={playerDetailEntity.tournamentPlayingXIStats}
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SectionTitle>Match Diary</SectionTitle>
        <div className='space-y-2'>
          {playerDetailEntity.matchDetails.map((m, i) => (
            <PlayerMatchHistory
              key={m.matchId}
              match={m}
              rank={i}
              playerId={playerDetailEntity.playerId}
              playerName={playerDetailEntity.name}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
export default PlayerAllDetail
