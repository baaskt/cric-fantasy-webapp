import { AuctionPlayersResponse } from '../response/auction-players-response.interface'

export type AuctionContextType = {
  playersList: AuctionPlayersResponse[]
  setPlayersList: (tournament: AuctionPlayersResponse[]) => void
}
