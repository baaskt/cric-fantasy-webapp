import type { FieldType, ModeName, Operator, PointsOpName, ScoreOpName } from './types'

export const SCORE_OPS: ScoreOpName[] = [
  'field',
  'fixed',
  'multiply',
  'sum',
  'weighted_sum',
  'ratio',
  'difference',
]
export const OPERATORS: Operator[] = [
  'gte',
  'gt',
  'lte',
  'lt',
  'eq',
  'neq',
  'contains',
  'startsWith',
]

// Customizable: add/remove modes or change their category lists here
export const MODES: Record<ModeName, { label: string; categories: string[] }> = {
  match: { label: 'Match', categories: ['batting', 'bowling', 'fielding', 'bonus'] },
  tournament: { label: 'Tournament', categories: ['batting', 'bowling', 'allRounder', 'fielding'] },
}

// Derived: all unique category names across all modes
export const CATEGORIES: string[] = [
  ...new Set(Object.values(MODES).flatMap(m => m.categories)),
] as string[]

export const POINTS_OPS: PointsOpName[] = ['fixed', 'as_is', 'multiply', 'add']
export const STAT_FIELDS: string[] = [
  'runsScored',
  'wickets',
  'ballsBowled',
  'ballsFaced',
  'runsConceded',
  'dots',
  'maidens',
  'isKnockOff',
  'noBalls',
  'fours',
  'sixes',
  'duck',
  'catches',
  'runouts',
  'stumpings',
  'isKeeper',
  'wicketCode',
  'wides',
  'isWinningTeam',
  'isPlayerOfMatch',
  'strikeRate',
  'Eco',
  'oversBowled',
]

export const OP_SYMBOLS: Record<Operator, string> = {
  gte: '≥',
  gt: '>',
  lte: '≤',
  lt: '<',
  eq: '=',
  neq: '≠',
  contains: 'contains',
  startsWith: 'starts with',
}

export const OPERATORS_BY_TYPE: Record<FieldType, Operator[]> = {
  boolean: ['eq'],
  string: ['eq', 'neq', 'contains', 'startsWith'],
  number: ['gte', 'gt', 'lte', 'lt', 'eq'],
}

// "boolean" | "string" | "number" (default when not listed)
export const FIELD_TYPES: Partial<Record<string, FieldType>> = {
  isKeeper: 'boolean',
  isWinningTeam: 'boolean',
  isPlayerOfMatch: 'boolean',
  isKnockOff: 'boolean',
  duck: 'boolean',
  wicketCode: 'string',
}

export const DEFAULT_VALUE: Record<FieldType, boolean | string | number> = {
  boolean: true,
  string: '',
  number: 0,
}

export function fieldType(field: string): FieldType {
  return FIELD_TYPES[field] ?? 'number'
}
