import { AuctionContextType } from '@/model/context/auctionContextType'
import { AuctionPlayersResponse } from '@/model/response/auction-players-response.interface'
import React, { createContext, useContext, useState } from 'react'

const ListContext = createContext<AuctionContextType>({} as AuctionContextType)
const { Provider } = ListContext

export const AuctionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [playersList, setPlayersList] = useState<AuctionPlayersResponse[]>([])

  const value: AuctionContextType = {
    playersList,
    setPlayersList,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useAuction = () => useContext(ListContext)
