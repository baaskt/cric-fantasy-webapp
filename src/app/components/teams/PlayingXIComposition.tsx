import { SquadEntity } from '@/model/entities/squad.interface'
import { PLAYER_ROLES } from '@/util/player'
import React from 'react'
import { TeamCompositionEntity } from '@/model/entities/team-composition.interface'

type PlayingXICompositionProps = {
  playersCount: number
  playingXISquad: Map<string, SquadEntity[]>
  composition: TeamCompositionEntity
}

const RULES = [
  {
    key: 'count',
    validate: (val: number) => val === 11,
    message: (val: number) =>
      val < 11 ? 'You need 11 players in the playing XI' : 'More than 11 players in the playing XI',
  },
  { key: 'bat', min: 3, message: 'At least 3 Batters required' },
  { key: 'bowl', min: 3, message: 'At least 3 Bowlers required' },
  { key: 'allRound', min: 1, message: 'At least 1 All Rounder required' },
  { key: 'wk', min: 1, message: 'At least 1 Wicket Keeper required' },
]

// 🔗 Map UI roles → composition keys
const ROLE_KEY_MAP: Record<string, keyof TeamCompositionEntity> = {
  Batter: 'bat',
  Bowler: 'bowl',
  'All Rounder': 'allRound',
  'Wicket Keeper': 'wk',
}

function PlayingXIComposition(props: PlayingXICompositionProps) {
  const { playersCount, playingXISquad, composition } = props

  // ✅ Get all validation issues
  const getIssues = () => {
    return RULES.reduce<string[]>((issues, rule) => {
      const value = composition[rule.key as keyof TeamCompositionEntity]

      if (rule.validate) {
        if (!rule.validate(value as number)) {
          issues.push(rule.message(value as number))
        }
      } else if (rule.min !== undefined && (value as number) < rule.min) {
        issues.push(rule.message)
      }

      return issues
    }, [])
  }

  const issues = getIssues()
  const isValid = issues.length === 0

  // ✅ Per-role validation
  const getRoleValidity = (role: string) => {
    const key = ROLE_KEY_MAP[role]
    if (!key) return true

    const rule = RULES.find(r => r.key === key)
    if (!rule || rule.min === undefined) return true

    const value = composition[key] as number
    return value >= rule.min
  }

  return (
    <div className='mt-6 space-y-3'>
      {/* 🎯 Composition Grid */}
      <div className='grid grid-cols-5 gap-3'>
        {PLAYER_ROLES.map(role => {
          const roleCount = playingXISquad.get(role)?.length || 0
          const roleValid = getRoleValidity(role)

          const rule = RULES.find(r => r.key === ROLE_KEY_MAP[role])

          return (
            <div
              key={role}
              className={`flex flex-col items-center justify-center text-center h-20 rounded-xl border text-sm font-medium transition-all
              ${
                roleValid
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-500'
              }`}
            >
              <span className='text-xs min-h-8'>{role}</span>
              <span className='text-lg font-semibold'>{roleCount}</span>

              {/* Optional hint */}
              {!roleValid && rule?.min && (
                <span className='text-[10px] opacity-70'>Min {rule.min}</span>
              )}
            </div>
          )
        })}

        {/* ✅ Total */}
        <div
          className={`flex flex-col items-center justify-center h-20 rounded-xl text-white transition-all
          ${isValid ? 'bg-green-600' : 'bg-gray-900'}`}
        >
          <span className='text-xs'>Total</span>
          <span className='text-lg font-bold'>{playersCount}/11</span>
        </div>
      </div>

      {/* ⚠️ Issues */}
      {!isValid && playersCount > 0 && (
        <div className='p-3 rounded-lg bg-red-50 border border-red-200'>
          <div className='font-semibold text-red-700 mb-1'>Fix your team</div>
          <ul className='text-sm text-red-600 space-y-1'>
            {issues.map(issue => (
              <li key={issue}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PlayingXIComposition
