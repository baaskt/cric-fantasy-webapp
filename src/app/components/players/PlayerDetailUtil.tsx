// ─── SectionTitle ─────────────────────────────────────────────────────────────

import { COLORS } from '@/util/colors'

import React from 'react'

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

type MatchTimelineData = {
  name: string
  pts: number
  desc: string
}

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
  const data = [...matches]
    .sort((a, b) => a.totalMatchPoints - b.totalMatchPoints)
    .map((m, i) => ({
      name: `M${i + 1}`,
      pts: m.totalMatchPoints,
      desc: m.matchDesc,
    })) as MatchTimelineData[]

  const CustomDot = (props: DotProps & { payload?: MatchTimelineData }) => {
    const { cx, cy, payload } = props

    if (cx == null || cy == null || !payload) return null

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
          formatter={(v: number, _, ctx: { payload?: MatchTimelineData }) => [
            v,
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
