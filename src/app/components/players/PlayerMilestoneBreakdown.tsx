import React from 'react'
import { motion } from 'framer-motion'
import { COLORS } from '@/util/colors'
import { PointRadar, SectionTitle } from './PlayerDetailUtil'
import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'

type PlayerMilestoneBreakdownProps = {
  playerDetailEntity: PlayerDetailEntity
}
function PlayerMilestoneBreakdown(props: PlayerMilestoneBreakdownProps) {
  const { playerDetailEntity } = props

  if (!playerDetailEntity.tournamentStats.tournamentPoints) return <></>
  return (
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
  )
}

export default PlayerMilestoneBreakdown
