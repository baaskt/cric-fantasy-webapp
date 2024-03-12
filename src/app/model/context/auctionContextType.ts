import { BiddingEntity } from '../entities/bidding.interface'
import { AuctionPlayerEntity } from '../response/auction-player-response.interface'
import { PlayerRandomEntity } from '../response/player-response.interface'

export type AuctionContextType = {
  playersList: AuctionPlayerEntity[]
  setPlayersList: (tournament: AuctionPlayerEntity[]) => void
  updatePlayer: (id: string, newData: AuctionPlayerEntity) => void
  activeCategory: string
  setActiveCategory: (activeCategory: string) => void
  auctionPlayer: PlayerRandomEntity | undefined
  setAuctionPlayer: (auctionPlayer: PlayerRandomEntity) => void
  biddingList: BiddingEntity[]
  updateBiddingList: (biddingEntity: BiddingEntity) => void
  highestBidder: BiddingEntity | undefined
  secondHighestBidder: BiddingEntity | undefined
}
