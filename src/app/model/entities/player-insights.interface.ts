import { MatchWiseDetailEntity } from '../response/player-detail.response.interface'

export interface PlayerInsightsEntity {
  totalMatches: number
  averagePoints: number
  consistency: number
  bestMatch: MatchWiseDetailEntity
  worstMatch: MatchWiseDetailEntity
  matchesAbove100: number
  matchesAbove50: number
  negativeMatches: number
}
