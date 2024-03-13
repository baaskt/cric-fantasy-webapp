import { BiddingEntity } from '../entities/bidding.interface'
import { AuctionPlayerEntity } from '../response/auction-player-response.interface'
import { LastAuctionPlayerEntity } from '../response/last-aucton-player.response.interface'
import { PlayerRandomEntity } from '../response/player-response.interface'

export type AuctionContextType = {
  playersList: AuctionPlayerEntity[]
  setPlayersList: (tournament: AuctionPlayerEntity[]) => void
  updatePlayer: (id: number, newData: AuctionPlayerEntity) => void
  activeCategory: string
  setActiveCategory: (activeCategory: string) => void
  auctionPlayer: PlayerRandomEntity | undefined
  setAuctionPlayer: (auctionPlayer: PlayerRandomEntity) => void
  biddingList: BiddingEntity[]
  updateBiddingList: (biddingEntity: BiddingEntity) => void
  highestBidder: BiddingEntity | undefined
  secondHighestBidder: BiddingEntity | undefined
  lastAuctionPlayer: LastAuctionPlayerEntity | undefined
  setLastAuctionplayer: (lastAuctionPlayer: LastAuctionPlayerEntity) => void
}
