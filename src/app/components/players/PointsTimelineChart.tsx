'use client'

import { MatchDetail } from '@/model/response/player-detail.response.interface'
import React from 'react'
import { motion } from 'framer-motion'
import { COLORS } from '@/util/colors'
import { MatchTimeline, SectionTitle } from './PlayerDetailUtil'

type PointsTimelineChartProps = {
  matchDetails: MatchDetail[]
}

const PointsTimelineChart = (props: PointsTimelineChartProps) => {
  const { matchDetails } = props

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className='rounded-3xl p-4 mb-4'
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.gray}`,
        boxShadow: `0 2px 16px ${COLORS.cricPrimaryLight}`,
      }}
    >
      <SectionTitle>Match Points Timeline</SectionTitle>
      <MatchTimeline matches={matchDetails} />

      <div className='flex gap-4 justify-center mt-2'>
        {[
          { label: '150+ pts', color: COLORS.stockGreen },
          { label: '80–149', color: COLORS.cricPrimary },
          { label: 'Under 80', color: COLORS.unsold },
        ].map(l => (
          <span
            key={l.label}
            className='flex items-center gap-1 text-[11px]'
            style={{ color: COLORS.darkGray }}
          >
            <span className='w-2 h-2 rounded-full' style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default PointsTimelineChart
