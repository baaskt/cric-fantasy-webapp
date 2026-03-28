// ─── SectionTitle ─────────────────────────────────────────────────────────────

import { COLORS } from '@/util/colors'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconButton, Tooltip, Chip } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'
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
} from 'recharts'
import {
  MatchDetail,
  TournamentPointDetails,
  TournamentStats,
} from '@/model/response/player-detail.response.interface'

const trend = (pts: number) =>
  pts >= 150
    ? { color: COLORS.stockGreen, icon: null, label: 'Great' }
    : pts >= 80
      ? { color: COLORS.darkGray, icon: null, label: 'Good' }
      : { color: COLORS.unsold, icon: null, label: 'Low' }

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

// ─── StatCard ─────────────────────────────────────────────────────────────────

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

// ─── Radar ────────────────────────────────────────────────────────────────────

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
      <RadarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
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

// ─── Area timeline ────────────────────────────────────────────────────────────

export function MatchTimeline({ matches }: { matches: MatchDetail[] }) {
  const data = [...matches].map((m, i) => ({
    name: `M${i + 1}`,
    pts: m.totalMatchPoints,
    desc: m.matchDesc,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomDot = (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { cx, cy, payload } = props
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id='ptsFillLight' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={COLORS.cricPrimary} stopOpacity={0.18} />
            <stop offset='95%' stopColor={COLORS.cricPrimary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={COLORS.gray} strokeDasharray='4 4' vertical={false} />
        <XAxis
          dataKey='name'
          tick={{ fill: COLORS.darkGray, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: COLORS.darkGray, fontSize: 11 }} axisLine={false} tickLine={false} />
        <ReTooltip
          contentStyle={{
            background: COLORS.white,
            border: `1px solid ${COLORS.gray}`,
            borderRadius: 10,
            fontSize: 12,
            boxShadow: `0 4px 20px ${COLORS.cricPrimaryLight}`,
          }}
          labelStyle={{ color: COLORS.cricDark, fontWeight: 700 }}
          itemStyle={{ color: COLORS.cricPrimary }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v: number, _, { payload }: any) => [v, payload?.desc ?? 'Points']}
        />
        <Area
          type='monotone'
          dataKey='pts'
          stroke={COLORS.cricPrimary}
          strokeWidth={2.5}
          fill='url(#ptsFillLight)'
          dot={<CustomDot />}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Bar comparison ───────────────────────────────────────────────────────────

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
      <BarChart data={data} barGap={4} margin={{ top: 0, right: 8, bottom: 0, left: -24 }}>
        <CartesianGrid stroke={COLORS.gray} strokeDasharray='4 4' vertical={false} />
        <XAxis
          dataKey='label'
          tick={{ fill: COLORS.darkGray, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: COLORS.darkGray, fontSize: 11 }} axisLine={false} tickLine={false} />
        <ReTooltip
          contentStyle={{
            background: COLORS.white,
            border: `1px solid ${COLORS.gray}`,
            borderRadius: 10,
            fontSize: 12,
            boxShadow: `0 4px 20px ${COLORS.cricPrimaryLight}`,
          }}
          labelStyle={{ color: COLORS.cricDark }}
        />
        <Bar dataKey='player' name='Player' radius={[5, 5, 0, 0]} fill={COLORS.cricPrimary} />
        <Bar dataKey='team' name='Team avg' radius={[5, 5, 0, 0]} fill={COLORS.cricPrimaryLight} />
      </BarChart>
    </ResponsiveContainer>
  )
}

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
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.gray}`,
      }}
    >
      {/* rank bubble */}
      <span
        className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0'
        style={{
          background: COLORS.inputBg,
          color: COLORS.darkGray,
        }}
      >
        {rank + 1}
      </span>

      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold truncate' style={{ color: COLORS.cricDark }}>
          {match.matchDesc}
        </p>
        <div className='flex items-center gap-2 mt-0.5'>
          {match.inPlayingXI ? (
            <Chip
              label='Playing XI'
              size='small'
              icon={<VerifiedIcon style={{ fontSize: 11, color: COLORS.stockGreen }} />}
              style={{
                height: 18,
                fontSize: 10,
                background: COLORS.stockGreen + '18',
                color: COLORS.stockGreen,
              }}
            />
          ) : (
            <Chip
              label='Bench'
              size='small'
              style={{
                height: 18,
                fontSize: 10,
                background: COLORS.inputBg,
                color: COLORS.darkGray,
              }}
            />
          )}
        </div>
      </div>

      <div className='flex items-center gap-1' style={{ color: COLORS.cricPrimary }}>
        <span className='text-xl font-black tabular-nums'>{match.totalMatchPoints}</span>
        <span className='text-[10px]' style={{ color: COLORS.placeholder }}>
          pts
        </span>
      </div>

      <Tooltip title='Match breakdown' placement='left'>
        <IconButton size='small' onClick={() => onInfo(match)}>
          <InfoOutlinedIcon fontSize='small' style={{ color: COLORS.black }} />
        </IconButton>
      </Tooltip>
    </motion.div>
  )
}

// ─── Match drawer ─────────────────────────────────────────────────────────────

export function MatchDrawer({
  match,
  onClose,
}: {
  match: MatchDetail | null
  onClose: () => void
}) {
  const matchDescSplit = match?.matchDesc.split(':')
  const matchTitle = matchDescSplit && matchDescSplit[1]
  const matchDesc = matchDescSplit && matchDescSplit[0]
  return (
    <AnimatePresence>
      {match && (
        <>
          <motion.div
            className='fixed inset-0 z-40'
            style={{ background: 'rgba(23,26,31,0.3)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className='fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 pb-10'
            style={{
              background: COLORS.white,
              boxShadow: `0 -8px 40px ${COLORS.cricPrimaryLight}`,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div
              className='w-10 h-1 rounded-full mx-auto mb-5'
              style={{ background: COLORS.gray }}
            />

            <div className='flex items-start justify-between mb-5'>
              <div>
                <h3 className='text-lg font-black' style={{ color: COLORS.cricDark }}>
                  {matchTitle}
                </h3>
                <p className='text-sm' style={{ color: COLORS.darkGray }}>
                  {matchDesc}
                </p>
              </div>
              <IconButton size='small' onClick={onClose}>
                <CloseIcon fontSize='small' style={{ color: COLORS.darkGray }} />
              </IconButton>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              {/* Points */}
              <div
                className='rounded-2xl p-4'
                style={{
                  background: COLORS.cricPrimaryUltraLight,
                  border: `1px solid ${COLORS.cricPrimaryLight}`,
                }}
              >
                <p
                  className='text-[10px] uppercase tracking-widest font-semibold mb-1'
                  style={{ color: COLORS.cricPrimary }}
                >
                  Points Earned
                </p>
                <p className='text-4xl font-black' style={{ color: COLORS.cricPrimary }}>
                  {match.totalMatchPoints}
                </p>
                <p
                  className='text-xs mt-1 font-semibold'
                  style={{ color: trend(match.totalMatchPoints).color }}
                >
                  {trend(match.totalMatchPoints).label} performance
                </p>
              </div>

              {/* Status */}
              <div
                className='rounded-2xl p-4'
                style={{
                  background: match.inPlayingXI ? COLORS.stockGreen + '12' : COLORS.inputBg,
                  border: `1px solid ${match.inPlayingXI ? COLORS.stockGreen + '35' : COLORS.gray}`,
                }}
              >
                <p
                  className='text-[10px] uppercase tracking-widest font-semibold mb-1'
                  style={{ color: match.inPlayingXI ? COLORS.stockGreen : COLORS.darkGray }}
                >
                  Match Status
                </p>
                <p
                  className='text-xl font-black'
                  style={{ color: match.inPlayingXI ? COLORS.stockGreen : COLORS.darkGray }}
                >
                  {match.inPlayingXI ? 'Playing XI' : 'Benched'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className='mt-5 w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-95'
              style={{ background: COLORS.cricPrimary, color: COLORS.white }}
            >
              Done
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
