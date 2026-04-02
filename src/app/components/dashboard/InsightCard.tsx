import React, { useMemo } from 'react'
import { InsightsType } from '@/model/enum/insight-type.enum'
import { InsightsEntity } from '@/model/response/insights-response.interface'
import { useRouter } from 'next/navigation'
import { TITLES } from '@/util/constants/constants'
import { useTournament } from '@/providers/TournamentProvider'

// ─── Theme config per insight type ───────────────────────────────────────────
const THEME = {
  runs: {
    bg: 'bg-violet-600',
    badge: 'bg-violet-500',
    glow: 'bg-violet-400',
    label: 'text-violet-200',
    value: 'text-white',
    watermark: 'text-violet-500',
  },
  wickets: {
    bg: 'bg-blue-600',
    badge: 'bg-blue-500',
    glow: 'bg-blue-400',
    label: 'text-blue-200',
    value: 'text-white',
    watermark: 'text-blue-500',
  },
  points: {
    bg: 'bg-indigo-500',
    badge: 'bg-indigo-400',
    glow: 'bg-indigo-300',
    label: 'text-indigo-100',
    value: 'text-white',
    watermark: 'text-indigo-400',
  },
} as const

type ThemeKey = keyof typeof THEME

type InsightCardProps = {
  title: string
  type: string
  data: InsightsEntity[]
}

function InsightCard({ title, type, data }: InsightCardProps) {
  const router = useRouter()
  const { activeTournament } = useTournament()
  const themeKey: ThemeKey = useMemo(() => {
    if (type === InsightsType.RUNS.toString()) return 'runs'
    if (type === InsightsType.WICKETS.toString()) return 'wickets'
    return 'points'
  }, [type])

  const t = THEME[themeKey]
  const topValue = data[0]?.value ?? 0
  const playerNames = data.map(p => p.name)
  const displayName =
    playerNames.length > 1 ? `${playerNames[0]} +${playerNames.length - 1}` : playerNames[0] ?? '—'
  const hasMultiple = playerNames.length > 1

  const navigateToPlayerDetail = () => {
    const playerId = data[0]?.playerId
    if (playerId && activeTournament)
      router.push(
        TITLES.PLAYER_DETAIL.fullPath
          .replace('tournamentId', activeTournament.tournamentId.toString())
          .replace('playerId', playerId.toString()),
      )
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl ${t.bg}
        w-full sm:w-fit sm:min-w-[200px]
        transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]
        cursor-default select-none
      `}
      onClick={navigateToPlayerDetail}
    >
      {/* Decorative background orbs */}
      <div
        className={`pointer-events-none absolute -right-5 -top-5 w-24 h-24 rounded-full ${t.glow} opacity-30`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute -right-2 -bottom-6 w-16 h-16 rounded-full opacity-20`}
        style={{ backgroundColor: 'white' }}
        aria-hidden
      />

      {/* Ghost watermark numeral */}
      <span
        className={`pointer-events-none absolute right-3 bottom-0 top-[10%] font-black leading-none ${t.watermark} select-none`}
        style={{ fontSize: 50, color: 'white' }}
        aria-hidden
      >
        {topValue}
      </span>

      <div className='relative p-3 flex flex-col gap-2.5'>
        {/* Top row: label + icon */}
        <div className='flex items-start justify-between gap-2'>
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.15em] ${t.label} leading-tight`}
          >
            {title}
          </span>
        </div>

        {/* Player name(s) */}
        <div className='flex items-center gap-1.5 min-w-0'>
          <span className='text-white font-black text-[13px] leading-tight truncate'>
            {displayName}
          </span>
          {hasMultiple && (
            <span
              className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${t.badge} text-white/90`}
              title={playerNames.join(', ')}
            >
              tied
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default InsightCard
