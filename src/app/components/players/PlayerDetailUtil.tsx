import { COLORS } from '@/util/colors'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconButton, Chip } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import VerifiedIcon from '@mui/icons-material/Verified'

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  DotProps,
} from 'recharts'

import {
  MatchDetail,
  TournamentPointDetails,
  TournamentStats,
} from '@/model/response/player-detail.response.interface'

/* ───────────────── TYPES ───────────────── */

type MatchTimelineData = {
  name: string
  pts: number
  desc: string
}

/* ───────────────── SectionTitle ───────────────── */

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex items-center gap-2 mb-4'>
      <span className='w-1 h-4 rounded-full' style={{ background: COLORS.cricPrimary }} />
      <h2
        className='text-[11px] font-bold uppercase tracking-[0.18em]'
        style={{ color: COLORS.darkGray }}
      >
        {children}
      </h2>
    </div>
  )
}

/* ───────────────── StatCard ───────────────── */

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className='flex flex-col items-center justify-center rounded-2xl p-3 text-center'
      style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.gray}` }}
    >
      <span
        className='text-[10px] font-semibold uppercase tracking-widest'
        style={{ color: COLORS.placeholder }}
      >
        {label}
      </span>
      <span className='text-xl font-black mt-1' style={{ color: COLORS.cricDark }}>
        {value}
      </span>
    </div>
  )
}

/* ───────────────── Radar ───────────────── */

export function PointRadar({ pts }: { pts: TournamentPointDetails }) {
  const data = [
    { subject: 'Runs', value: pts.runs },
    { subject: 'Boundaries', value: pts.boundaries },
    { subject: 'SR', value: Math.max(0, pts.strikeRate) },
    { subject: 'Wickets', value: pts.wickets },
    { subject: 'Economy', value: Math.max(0, pts.economyRate) },
    { subject: 'Fielding', value: pts.fielding },
    { subject: 'All-round', value: pts.allRounder },
  ]

  return (
    <ResponsiveContainer width='100%' height={210}>
      <RadarChart data={data}>
        <PolarGrid stroke={COLORS.gray} />
        <PolarAngleAxis dataKey='subject' tick={{ fill: COLORS.darkGray, fontSize: 11 }} />
        <Radar
          dataKey='value'
          stroke={COLORS.cricPrimary}
          fill={COLORS.cricPrimary}
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

/* ───────────────── MatchTimeline ───────────────── */

export function MatchTimeline({ matches }: { matches: MatchDetail[] }) {
  const data: MatchTimelineData[] = matches.map((m, i) => ({
    name: `M${i + 1}`,
    pts: m.totalMatchPoints,
    desc: m.matchDesc,
  }))

  const CustomDot = (props: DotProps & { payload: MatchTimelineData }) => {
    const { cx, cy, payload } = props

    if (cx == null || cy == null) return null

    const col =
      payload.pts >= 150
        ? COLORS.stockGreen
        : payload.pts >= 80
          ? COLORS.cricPrimary
          : COLORS.unsold

    return <circle cx={cx} cy={cy} r={5} fill={col} stroke={COLORS.white} strokeWidth={2} />
  }

  return (
    <ResponsiveContainer width='100%' height={180}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id='ptsFillLight' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={COLORS.cricPrimary} stopOpacity={0.18} />
            <stop offset='95%' stopColor={COLORS.cricPrimary} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke={COLORS.gray} strokeDasharray='4 4' vertical={false} />

        <XAxis dataKey='name' tick={{ fill: COLORS.darkGray, fontSize: 11 }} />

        <YAxis tick={{ fill: COLORS.darkGray, fontSize: 11 }} />

        <ReTooltip
          formatter={(value: number, _name, ctx: { payload?: MatchTimelineData }) => [
            value,
            ctx.payload?.desc ?? 'Points',
          ]}
        />

        <Area
          type='monotone'
          dataKey='pts'
          stroke={COLORS.cricPrimary}
          strokeWidth={2.5}
          fill='url(#ptsFillLight)'
          dot={props => <CustomDot {...props} />}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ───────────────── BattingComparison ───────────────── */

export function BattingComparison({ ts, team }: { ts: TournamentStats; team: TournamentStats }) {
  const data = [
    { label: 'Average', player: ts.average, team: +team.average.toFixed(1) },
    { label: 'SR', player: ts.strikeRate, team: +team.strikeRate.toFixed(1) },
    {
      label: 'Boundaries',
      player: ts.boundaries,
      team: +((team.boundaries * ts.runs) / Math.max(team.runs, 1)).toFixed(0),
    },
  ]

  return (
    <ResponsiveContainer width='100%' height={160}>
      <BarChart data={data}>
        <CartesianGrid stroke={COLORS.gray} strokeDasharray='4 4' vertical={false} />
        <XAxis dataKey='label' tick={{ fill: COLORS.darkGray, fontSize: 11 }} />
        <YAxis tick={{ fill: COLORS.darkGray, fontSize: 11 }} />
        <ReTooltip />
        <Bar dataKey='player' fill={COLORS.cricPrimary} radius={[5, 5, 0, 0]} />
        <Bar dataKey='team' fill={COLORS.cricPrimaryLight} radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ───────────────── MatchCard ───────────────── */

export function MatchCard({
  match,
  rank,
  onInfo,
}: {
  match: MatchDetail
  rank: number
  onInfo: (m: MatchDetail) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.06 }}
      className='flex items-center gap-3 rounded-2xl px-4 py-3'
      style={{ background: COLORS.white, border: `1px solid ${COLORS.gray}` }}
    >
      <span className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-black'>
        {rank + 1}
      </span>

      <div className='flex-1'>
        <p className='text-sm font-semibold'>{match.matchDesc}</p>

        {match.inPlayingXI ? (
          <Chip label='Playing XI' size='small' icon={<VerifiedIcon />} />
        ) : (
          <Chip label='Bench' size='small' />
        )}
      </div>

      <span className='text-xl font-black'>{match.totalMatchPoints}</span>

      <IconButton size='small' onClick={() => onInfo(match)}>
        <InfoOutlinedIcon fontSize='small' />
      </IconButton>
    </motion.div>
  )
}

/* ───────────────── MatchDrawer ───────────────── */

export function MatchDrawer({
  match,
  onClose,
}: {
  match: MatchDetail | null
  onClose: () => void
}) {
  if (!match) return null

  const [desc, title] = match.matchDesc.split(':')

  return (
    <AnimatePresence>
      <motion.div className='fixed inset-0' onClick={onClose} />

      <motion.div className='fixed bottom-0 left-0 right-0 p-6 bg-white'>
        <h3>{title}</h3>
        <p>{desc}</p>

        <p>{match.totalMatchPoints} pts</p>

        <button onClick={onClose}>Close</button>
      </motion.div>
    </AnimatePresence>
  )
}
