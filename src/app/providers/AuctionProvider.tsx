import { AuctionContextType } from '@/model/context/auctionContextType'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import { PlayerRandomEntity } from '@/model/response/player-response.interface'
import React, { createContext, useContext, useState } from 'react'

const ListContext = createContext<AuctionContextType>({} as AuctionContextType)
const { Provider } = ListContext

export const AuctionProvider = ({ children }: { children: React.ReactNode }) => {
  const [playersList, setPlayersList] = useState<AuctionPlayerEntity[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [auctionPlayer, setAuctionPlayer] = useState<PlayerRandomEntity>()
  // const [biddingEntity, setBiddingEntity] = useState<PlayerRandomEntity>()

  const updatePlayer = (id: string, newData: AuctionPlayerEntity) => {
    const updatedList = playersList.map((item: AuctionPlayerEntity) => {
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
    auctionPlayer,
    setAuctionPlayer,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useAuction = () => useContext(ListContext)
