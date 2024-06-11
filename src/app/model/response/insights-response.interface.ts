export interface InsightsResponse {
  runs: InsightsEntity[]
  wickets: InsightsEntity[]
  points: InsightsEntity[]
}

export interface InsightsEntity {
  imageUrl: string
  name: string
  playerId: number
  value: number
}
