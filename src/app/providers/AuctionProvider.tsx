import { AuctionContextType } from '@/model/context/auctionContextType'
import { BiddingEntity } from '@/model/entities/bidding.interface'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import { LastAuctionPlayerEntity } from '@/model/response/last-aucton-player.response.interface'
import { PlayerRandomEntity } from '@/model/response/player-response.interface'
import React, { createContext, useContext, useState } from 'react'

const ListContext = createContext<AuctionContextType>({} as AuctionContextType)
const { Provider } = ListContext

export const AuctionProvider = ({ children }: { children: React.ReactNode }) => {
  const [playersList, setPlayersList] = useState<AuctionPlayerEntity[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [auctionPlayer, setAuctionPlayer] = useState<PlayerRandomEntity>()
  const [lastAuctionPlayer, setLastAuctionplayer] = useState<LastAuctionPlayerEntity>()
  const [biddingList, setBiddingList] = useState<BiddingEntity[]>([])
  const [highestBidder, setHighestBidder] = useState<BiddingEntity>()
  const [secondHighestBidder, setSecondHighestBidder] = useState<BiddingEntity>()

  const updatePlayer = (id: number, newData: AuctionPlayerEntity) => {
    const updatedList = playersList.map((item: AuctionPlayerEntity) => {
      if (item.playerId === id) {
        return { ...item, ...newData }
      }
      return item
    })
    setPlayersList(updatedList)
  }

  const updateBiddingList = (newData: BiddingEntity) => {
    const isMatchingTeam = biddingList.find((item: BiddingEntity) => item.teamId === newData.teamId)
    let updatedList = []
    if (isMatchingTeam) {
      updatedList = biddingList.map((item: BiddingEntity) => {
        if (item.teamId === newData.teamId) {
          return { ...item, ...newData }
        }
        return item
      })
    } else {
      updatedList = [...biddingList, newData]
    }
    updateHighestBidder(updatedList)
    updateSecondHighestBidder(updatedList)
    setBiddingList(updatedList)
  }

  const updateHighestBidder = (newBiddingList: BiddingEntity[]) => {
    let highestEntity
    if (newBiddingList.length === 0) highestEntity = null
    highestEntity = newBiddingList.reduce((prev, current) => {
      return prev.amount > current.amount ? prev : current
    })
    setHighestBidder(highestEntity)
  }

  const updateSecondHighestBidder = (newBiddingList: BiddingEntity[]) => {
    let highestEntity
    if (newBiddingList.length < 2) highestEntity = null
    const sortedBidding = newBiddingList.slice().sort((a, b) => b.amount - a.amount)
    highestEntity = sortedBidding[1]
    setSecondHighestBidder(highestEntity)
  }

  const value: AuctionContextType = {
    playersList,
    setPlayersList,
    updatePlayer,
    activeCategory,
    setActiveCategory,
    auctionPlayer,
    setAuctionPlayer,
    biddingList,
    updateBiddingList,
    highestBidder,
    secondHighestBidder,
    lastAuctionPlayer,
    setLastAuctionplayer,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useAuction = () => useContext(ListContext)
