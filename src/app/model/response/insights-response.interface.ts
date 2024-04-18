export interface InsightsResponse {
  runs: InsightsEntity[]
  wickets: InsightsEntity[]
}

export interface InsightsEntity {
  imageUrl: string
  name: string
  playerId: number
  value: number
}
