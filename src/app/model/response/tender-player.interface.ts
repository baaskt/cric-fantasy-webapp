export interface TenderPlayerEntity {
  playerId: string
  playerName: string
  date: string
  tenderWindow: string
  bids: TenderBidEntity[]
}

export interface TenderBidEntity {
  teamId: string
  teamName: string
  amount: number
  timeOfBid: string
}
