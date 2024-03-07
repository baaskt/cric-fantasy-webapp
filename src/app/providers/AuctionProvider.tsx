import { AuctionContextType } from '@/model/context/auctionContextType'
import { AuctionPlayersResponse } from '@/model/response/auction-players-response.interface'
import React, { createContext, useContext, useState } from 'react'

const ListContext = createContext<AuctionContextType>({} as AuctionContextType)
const { Provider } = ListContext

export const AuctionProvider = ({ children }: { children: React.ReactNode }) => {
  const [playersList, setPlayersList] = useState<AuctionPlayersResponse[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')

  const updatePlayer = (id: string, newData: AuctionPlayersResponse) => {
    const updatedList = playersList.map((item: AuctionPlayersResponse) => {
      if (item.playerId === id) {
        return { ...item, ...newData }
      }
      return item
    })
    setPlayersList(updatedList)
  }

  const value: AuctionContextType = {
    playersList,
    setPlayersList,
    updatePlayer,
    activeCategory,
    setActiveCategory,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useAuction = () => useContext(ListContext)
