import { BiddingEntity } from '../entities/bidding.interface'
import { OptionsEntity } from '../entities/options.interface'
import { AuctionPlayerEntity } from '../response/auction-player-response.interface'
import { LastAuctionPlayerEntity } from '../response/last-aucton-player.response.interface'
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
  lastAuctionPlayer: LastAuctionPlayerEntity | undefined
  setLastAuctionplayer: (lastAuctionPlayer: LastAuctionPlayerEntity) => void
  isAuctionCompleted: boolean
  setAuctionCompleted: (isAuctionCompleted: boolean) => void
}
