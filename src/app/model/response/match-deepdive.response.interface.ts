export interface MatchDeepDiveEntity {
  playerId: string
  name: string
  inPlayingXI: string
  team: string
  totalMatchPoints: string
  [key: string]: string // Allow any additional dynamic fields
}
