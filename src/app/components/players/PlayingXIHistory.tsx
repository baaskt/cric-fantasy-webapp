'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CloseIcon from '@mui/icons-material/Close'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { SquadEntity } from '@/model/entities/squad.interface'
import { useMatch } from '@/providers/MatchProvider'
import { groupMatchesByPlayingXI, mapMatchesWithPlayingXI } from '@/util/matches'
import HistoryIcon from '@mui/icons-material/History'
import { MatchEntity } from '@/model/response/match.response'
import CommonHero from '../CommonHero'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
// ─── Constants ───────────────────────────────────────────────────────────────

const ROLE_ORDER = ['Batsman', 'WK-Batsman', 'Wicket-Keeper', 'All-Rounder', 'Bowler']

const ROLE_META: Record<string, { color: string; bg: string; border: string; short: string }> = {
  Batter: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', short: 'BAT' },
  'WK-Batsman': { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', short: 'WK' },
  'Wicket-Keeper': { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', short: 'WK' },
  'All-Rounder': { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', short: 'AR' },
  Bowler: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', short: 'BWL' },
}

const DEFAULT_ROLE_META = { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', short: '—' }

function getRoleMeta(role: string) {
  const normalizeAlRole =
    role === 'Batting Allrounder' || role === 'Bowling Allrounder' ? 'All-Rounder' : role
  return ROLE_META[normalizeAlRole] ?? DEFAULT_ROLE_META
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

function parseDateKey(dateStr: string) {
  const y = dateStr.slice(0, 4)
  const m = dateStr.slice(4, 6)
  const d = dateStr.slice(6, 8)
  const dt = new Date(`${y}-${m}-${d}`)
  return {
    day: d,
    month: dt.toLocaleString('default', { month: 'short' }),
    year: y,
    full: dt.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }
}

function groupByRole(players: SquadEntity[]): Record<string, SquadEntity[]> {
  const groups: Record<string, SquadEntity[]> = {}
  players.forEach(p => {
    const normalizeAlRole =
      p.role === 'Batting Allrounder' || p.role === 'Bowling Allrounder' ? 'All-Rounder' : p.role
    if (!groups[normalizeAlRole]) groups[normalizeAlRole] = []
    groups[normalizeAlRole].push(p)
  })

  const sorted: Record<string, SquadEntity[]> = {}
  ROLE_ORDER.forEach(r => {
    if (groups[r]) sorted[r] = groups[r]
  })
  Object.keys(groups).forEach(r => {
    if (!sorted[r]) sorted[r] = groups[r]
  })
  return sorted
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PlayerAvatar({ player, size = 40 }: { player: SquadEntity; size?: number }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      style={{ width: size, height: size }}
      className='relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-500 text-white font-semibold'
    >
      {player.imageUrl && !imgError ? (
        <Image
          src={player.imageUrl}
          alt={player.name}
          fill
          className='object-cover rounded-full'
          onError={() => setImgError(true)}
        />
      ) : (
        <span style={{ fontSize: size * 0.35 }}>{getInitials(player.name)}</span>
      )}
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const meta = getRoleMeta(role)
  return (
    <span
      className='text-xs font-medium px-2 py-0.5 rounded-full'
      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
    >
      {role}
    </span>
  )
}

function PlayerDetailDrawer({ player, onClose }: { player: SquadEntity; onClose: () => void }) {
  return (
    <div
      className='col-span-full rounded-xl p-3 mt-1 animate-in fade-in slide-in-from-top-1 duration-200'
      style={{ background: 'linear-gradient(135deg, #eef2ff, #fff)', border: '1px solid #c7d2fe' }}
    >
      <div className='flex items-center gap-3'>
        <PlayerAvatar player={player} size={48} />
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold text-indigo-950 truncate'>{player.name}</p>
          <div className='flex gap-1.5 mt-1.5 flex-wrap'>
            <RoleBadge role={player.role} />
            <span
              className='text-xs font-medium px-2 py-0.5 rounded-full'
              style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}
            >
              {player.clubSName}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className='p-1 rounded-full hover:bg-indigo-100 transition-colors text-gray-400 hover:text-indigo-600 flex-shrink-0'
          aria-label='Close'
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  )
}

function PlayerCard({
  player,
  isSelected,
  onSelect,
}: {
  player: SquadEntity
  isSelected: boolean
  onSelect: () => void
}) {
  const meta = getRoleMeta(player.role)
  const firstName = player.name.split(' ')[0]
  const lastName = player.name.split(' ').slice(1).join(' ')

  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-150 text-left w-full active:scale-95 ${
        isSelected
          ? 'bg-indigo-50 border-indigo-400 shadow-sm'
          : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
      }`}
    >
      <div className='relative'>
        <PlayerAvatar player={player} size={40} />
        <span
          className='absolute -top-0.5 -right-0.5 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none'
          style={{ background: meta.color }}
        >
          {meta.short.slice(0, 2)}
        </span>
      </div>
      <div className='text-center w-full'>
        <p className='text-[10px] font-semibold text-gray-800 leading-tight truncate'>
          {firstName}
        </p>
        {lastName && <p className='text-[10px] text-gray-600 leading-tight truncate'>{lastName}</p>}
      </div>
      <span
        className='text-[9px] font-medium px-1.5 py-0.5 rounded-md truncate max-w-full'
        style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}
      >
        {player.clubSName}
      </span>
    </button>
  )
}

function RoleSection({
  role,
  players,
  selectedId,
  onSelect,
}: {
  role: string
  players: SquadEntity[]
  selectedId: number | null
  onSelect: (id: number) => void
}) {
  const selected = players.find(p => p.playerId === selectedId) ?? null

  return (
    <div className='px-4 pt-3'>
      <div className='flex items-center gap-2 mb-2'>
        <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
          {role}
        </span>
        <div className='flex-1 h-px bg-gray-100' />
        <RoleBadge role={role} />
      </div>

      <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 mb-2'>
        {players.map(player => (
          <PlayerCard
            key={player.playerId}
            player={player}
            isSelected={selectedId === player.playerId}
            onSelect={() => onSelect(player.playerId)}
          />
        ))}

        {/* Detail drawer spans full row — rendered inside grid via col-span-full */}
        {selected && (
          <PlayerDetailDrawer player={selected} onClose={() => onSelect(selected.playerId)} />
        )}
      </div>
    </div>
  )
}

function MatchCard({
  dateKey,
  playerIds,
  squad,
  matches,
}: {
  dateKey: string
  playerIds: number[]
  squad: SquadEntity[]
  matches: MatchEntity[]
}) {
  const [expanded, setExpanded] = useState(false)
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  const allPlayers = playerIds
    .map(id => squad.find(p => p.playerId === id))
    .filter(Boolean) as SquadEntity[]

  const grouped = groupByRole(allPlayers)
  const dp = parseDateKey(dateKey)

  const roleCounts = Object.entries(grouped).map(([role, ps]) => {
    const m = getRoleMeta(role)
    return { role, count: ps.length, meta: m }
  })

  const handlePlayerSelect = useCallback((id: number) => {
    setSelectedPlayerId(prev => (prev === id ? null : id))
  }, [])

  if (allPlayers.length === 0) return null

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        expanded ? 'border-indigo-200 shadow-[0_4px_24px_rgba(99,102,241,0.12)]' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <button
        onClick={() => {
          setExpanded(e => !e)
          setSelectedPlayerId(null)
        }}
        className='w-full flex items-center gap-3 px-4 py-3.5 active:bg-indigo-50 transition-colors'
      >
        {/* Date badge */}
        <div
          className='flex flex-col items-center justify-center rounded-xl px-2.5 py-2 min-w-[44px] flex-shrink-0'
          style={{ background: '#eef2ff', border: '1px solid #e0e7ff' }}
        >
          <span className='text-lg font-bold leading-none text-indigo-600'>{dp.day}</span>
          <span className='text-[10px] font-semibold uppercase tracking-wide text-indigo-400 mt-0.5'>
            {dp.month}
          </span>
        </div>

        {/* Meta */}
        <div className='flex-1 text-left min-w-0'>
          <div className='flex flex-wrap gap-1.5 mt-1.5'>
            {roleCounts.map(({ role, count, meta }) => (
              <span
                key={role}
                className='text-[10px] font-medium px-1.5 py-0.5 rounded-md'
                style={{ background: meta.bg, color: meta.color }}
              >
                {count} {meta.short}
              </span>
            ))}
          </div>
          <div className='flex flex-wrap gap-1.5 mt-1.5'>
            {matches.map(matchEntity => (
              <span
                key={matchEntity.matchId}
                className='text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-500'
              >
                {matchEntity.team1SName} vs {matchEntity.team2SName}
              </span>
            ))}
          </div>
        </div>

        {/* Chevron */}
        <div
          className='transition-transform duration-300 text-gray-400 flex-shrink-0'
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ExpandMoreIcon sx={{ fontSize: 22 }} />
        </div>
      </button>

      {/* Expandable body */}
      <div
        className='overflow-hidden transition-all duration-300 ease-in-out'
        style={{ maxHeight: expanded ? '2000px' : '0px' }}
      >
        <div className='border-t border-gray-100'>
          {Object.entries(grouped).map(([role, rolePlayers]) => (
            <RoleSection
              key={role}
              role={role}
              players={rolePlayers}
              selectedId={selectedPlayerId}
              onSelect={handlePlayerSelect}
            />
          ))}

          {/* Footer */}
          <div className='flex items-center justify-between px-4 py-3 mt-1 border-t border-gray-50'>
            <span className='text-xs text-gray-400'>{dp.full}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

type PlayingXIHistoryProps = {
  playingXIHistory: Record<string, number[]>
  squad: SquadEntity[]
}

export default function PlayingXIHistory(props: PlayingXIHistoryProps) {
  const { playingXIHistory, squad } = props
  const { matchList } = useMatch()

  const mappedMatches = mapMatchesWithPlayingXI(matchList, playingXIHistory)
  console.log(mappedMatches)

  const daysMatchesMapping = groupMatchesByPlayingXI(matchList, playingXIHistory)
  const latestDate = daysMatchesMapping[0] ? parseDateKey(daysMatchesMapping[0].date) : null

  return (
    <div className='mt-5 bg-[#f5f3ff]'>
      <CommonHero
        title='Playing XI History'
        desc='Any changes made during the playing XI window will reflect only after the window closes.'
        icon={<HistoryIcon sx={{ fontSize: 22 }} />}
        stats={[
          {
            icon: <CalendarTodayIcon sx={{ fontSize: 14 }} />,
            label: latestDate ? `Latest: ${latestDate.month} ${latestDate.day}` : '—',
          },
          {
            icon: <CalendarMonthIcon sx={{ fontSize: 14 }} />,
            label: daysMatchesMapping ? `${daysMatchesMapping.length} days` : '—',
          },
        ]}
      />
      <div className='mt-4 px-3 pb-8 space-y-2.5'>
        {daysMatchesMapping.length === 0 ? (
          <div className='text-center py-16 text-gray-400 text-sm'>No match history available</div>
        ) : (
          daysMatchesMapping.map(historyEntity => (
            <MatchCard
              key={historyEntity.date}
              dateKey={historyEntity.date}
              playerIds={historyEntity.playingXI}
              squad={squad}
              matches={historyEntity.matches}
            />
          ))
        )}
      </div>
    </div>
  )
}
