import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import { COLORS } from '@/util/colors'
import React from 'react'
import { ALTERNATE_PLAYER_IMAGE_SRC } from '@/util/constants/constants'
import { motion } from 'framer-motion'
import { convertDriveUrl } from '@/util/helper'
import { currencyToString } from '@/util/bidding'

interface PlayerHeroCardProps {
  playerDetailEntity: PlayerDetailEntity
}

function PlayerHeroCard(props: PlayerHeroCardProps) {
  const { playerDetailEntity } = props

  const matchPoints = playerDetailEntity.matchDetails.reduce((s, m) => s + m.totalMatchPoints, 0)
  const playerUrl = convertDriveUrl(playerDetailEntity.imageUrl)
  return (
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
                className='w-24 h-24 rounded-full object-cover'
                style={{ border: '2.5px solid rgba(255,255,255,0.45)' }}
              />
              <span
                className='flex justify-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-center'
                style={{ background: COLORS.cricPrimary, color: COLORS.white }}
              >
                {playerDetailEntity.role}
              </span>
            </div>
          </div>

          <div className='mt-3'>
            <div
              className='shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold max-w-[200px]'
              style={{ background: 'rgba(255,255,255,0.2)', color: COLORS.white }}
            >
              {playerDetailEntity.overview.fantasyTeam}
            </div>
            <div className='mt-3 flex gap-4'>
              <div>
                <p className='text-[10px] uppercase tracking-widest text-white/50'>Bid Price</p>
                <p className='font-black text-white'>
                  {playerDetailEntity.auction.auctionPrice
                    ? currencyToString(playerDetailEntity.auction.auctionPrice)
                    : 'Price N/A'}
                </p>
              </div>
              <div className='w-px self-stretch bg-white/20' />
              <div>
                <p className='text-[10px] uppercase tracking-widest text-white/50'>Base Price</p>
                <p className='font-semibold text-white/60'>
                  {currencyToString(playerDetailEntity.auction.basePrice)}
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
  )
}

export default PlayerHeroCard
