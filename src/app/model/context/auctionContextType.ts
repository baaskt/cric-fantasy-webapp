import { BiddingEntity } from '../entities/bidding.interface'
import { OptionsEntity } from '../entities/options.interface'
import { AuctionPlayerEntity } from '../response/auction-player-response.interface'
import { LastAuctionPlayerDetailEntity } from '../response/last-aucton-player.response.interface'
import { PlayerRandomEntity } from '../response/player-response.interface'

export type AuctionContextType = {
  playersList: AuctionPlayerEntity[]
  setPlayersList: (tournament: AuctionPlayerEntity[]) => void
  updatePlayer: (id: number, newData: AuctionPlayerEntity) => AuctionPlayerEntity[]
  activeCategory: OptionsEntity | undefined
  setActiveCategory: (activeCategory: OptionsEntity) => void
  auctionPlayer: PlayerRandomEntity | undefined
  setAuctionPlayer: (auctionPlayer: PlayerRandomEntity) => void
  biddingList: BiddingEntity[]
  updateBiddingList: (biddingEntity?: BiddingEntity) => void
  highestBidder: BiddingEntity | null
  secondHighestBidder: BiddingEntity | null
  lastAuctionPlayer: LastAuctionPlayerDetailEntity | undefined
  setLastAuctionplayer: (lastAuctionPlayer: LastAuctionPlayerDetailEntity) => void
  isAuctionCompleted: boolean
  setAuctionCompleted: (isAuctionCompleted: boolean) => void
}
