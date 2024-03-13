export type SellPlayerRequest = {
  teamId: string
  soldAmount: number
  soldStatus: string
  teamMaxBid: BidPlayerEntity[]
}

export type BidPlayerEntity = {
  teamId: string
  amount: number
}
