export interface LastAuctionPlayerEntity {
  player: LastAuctionPlayerDetailEntity
  completedAuctionCategories: string[]
}

export interface LastAuctionPlayerDetailEntity {
  category: string
  clubName: string
  imageUrl: string
  name: string
  playerId: number
  role: string
  soldAmount: number
  soldStatus: string
  teamId: string
  teamName: string
}
