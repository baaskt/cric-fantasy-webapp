export interface TenderPlayerEntity {
  playerId: string
  bids: TenderBidEntity[]
}

export interface TenderBidEntity {
  teamId: string
  teamName: string
  amount: number
}
