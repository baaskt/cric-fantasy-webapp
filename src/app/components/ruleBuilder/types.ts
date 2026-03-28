// ── Primitives ────────────────────────────────────────────────────────────
export type Operator = 'gte' | 'gt' | 'lte' | 'lt' | 'eq' | 'neq' | 'contains' | 'startsWith'
export type ScoreOpName =
  | 'field'
  | 'fixed'
  | 'multiply'
  | 'sum'
  | 'weighted_sum'
  | 'ratio'
  | 'difference'
export type PointsOpName = 'fixed' | 'as_is' | 'multiply' | 'add'
export type FieldType = 'boolean' | 'string' | 'number'
export type ModeName = 'match' | 'tournament'

// ── Score (discriminated union on `operation`) ────────────────────────────
export type ScoreOp =
  | { operation: 'field'; field: string }
  | { operation: 'fixed'; value: number }
  | { operation: 'multiply'; field: string; factor: number }
  | { operation: 'sum'; fields: string[] }
  | { operation: 'weighted_sum'; fields: string[]; weights: number[] }
  | { operation: 'ratio'; numerator: string; denominator: string; factor: number }
  | { operation: 'difference'; fields: string[]; allowNegative: boolean }

// ── Points (number or dynamic object) ────────────────────────────────────
export type PointsDynamic =
  | { operation: 'as_is' }
  | { operation: 'multiply'; factor: number }
  | { operation: 'add'; value: number }
export type PointsValue = number | PointsDynamic

// ── Condition ─────────────────────────────────────────────────────────────
export interface Condition {
  id: string
  field: string
  operator: Operator
  value: number | string | boolean
}

// ── Threshold ────────────────────────────────────────────────────────────
export interface Threshold {
  id: string
  operator: Operator
  value: number
  points: PointsValue
}

// ── Segment ───────────────────────────────────────────────────────────────
export interface Segment {
  id: string
  label: string
  when: Condition[]
  score: ScoreOp
  thresholds: Threshold[]
  default: PointsValue
}

// ── Rule (discriminated union on `type`) ──────────────────────────────────
export interface ScoredSegmentsRule {
  id: string
  name: string
  type: 'scored_segments'
  segments: Segment[]
}
export interface GroupRule {
  id: string
  name: string
  type: 'group'
  rules: ScoredSegmentsRule[]
}
export type Rule = ScoredSegmentsRule | GroupRule

// ── Category ──────────────────────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  rules: Rule[]
}

// ── ModeData ──────────────────────────────────────────────────────────────
export type ModeData = Record<ModeName, Category[]>

// ── Formula preview ───────────────────────────────────────────────────────
export interface FormulaPart {
  t: string
  c: string
}
export interface FormulaPreviewResult {
  parts: FormulaPart[]
  note: string
}

// ── Selected rule pointer ─────────────────────────────────────────────────
export interface SelectedRule {
  catId: string
  ruleId: string
}

// ── Raw (unhydrated) config shape — used by initModeData / parseJsonToModes ──
export type RawCondition = Omit<Condition, 'id'>
export type RawThreshold = Omit<Threshold, 'id'>
export interface RawSegment {
  label: string
  when: RawCondition[]
  score: ScoreOp
  thresholds: RawThreshold[]
  default: PointsValue
}
export interface RawScoredSegmentsRule {
  type: 'scored_segments'
  segments: RawSegment[]
}
export interface RawGroupRule {
  type: 'group'
  rules: Record<string, RawScoredSegmentsRule>
}
export type RawRule = RawScoredSegmentsRule | RawGroupRule
export type RawModeConfig = Record<string, Record<string, RawRule>>
export type DefaultRulesConfig = Partial<Record<ModeName, RawModeConfig>>
