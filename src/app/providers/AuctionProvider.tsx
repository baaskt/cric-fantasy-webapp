import { AuctionContextType } from '@/model/context/auctionContextType'
import { BiddingEntity } from '@/model/entities/bidding.interface'
import { OptionsEntity } from '@/model/entities/options.interface'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import { LastAuctionPlayerDetailEntity } from '@/model/response/last-aucton-player.response.interface'
import { PlayerRandomEntity } from '@/model/response/player-response.interface'
import { twentyFiveCrores } from '@/util/bidding'
import React, { createContext, useContext, useState } from 'react'

const ListContext = createContext<AuctionContextType>({} as AuctionContextType)
const { Provider } = ListContext

export const AuctionProvider = ({ children }: { children: React.ReactNode }) => {
  const [playersList, setPlayersList] = useState<AuctionPlayerEntity[]>([])
  const [activeCategory, setActiveCategory] = useState<OptionsEntity>()
  const [auctionPlayer, setAuctionPlayer] = useState<PlayerRandomEntity>()
  const [lastAuctionPlayer, setLastAuctionplayer] = useState<LastAuctionPlayerDetailEntity>()
  const [biddingList, setBiddingList] = useState<BiddingEntity[]>([])
  const [highestBidder, setHighestBidder] = useState<BiddingEntity | null>(null)
  const [secondHighestBidder, setSecondHighestBidder] = useState<BiddingEntity | null>(null)
  const [isAuctionCompleted, setAuctionCompleted] = useState<boolean>(false)

  const updatePlayer = (id: number, newData: AuctionPlayerEntity): AuctionPlayerEntity[] => {
    const updatedList = playersList.map((item: AuctionPlayerEntity) => {
      if (item.playerId === id) {
        return { ...item, ...newData }
      }
      return item
    })
    setPlayersList(updatedList)
    return updatedList
  }

  const updateBiddingList = (newData?: BiddingEntity) => {
    if (!newData) {
      setBiddingList([])
      setHighestBidder(null)
      setSecondHighestBidder(null)
      return
    }
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
    if (newBiddingList.length === 0) {
      highestEntity = null
    } else if (newBiddingList.length === 1) {
      highestEntity = newBiddingList[0]
    } else {
      const sortedBidding = newBiddingList.slice().sort((a, b) => b.amount - a.amount)
      if (
        sortedBidding[0].amount <= twentyFiveCrores ||
        (sortedBidding[0].amount > sortedBidding[1].amount &&
          sortedBidding[0].purseBalance > sortedBidding[1].purseBalance)
      ) {
        highestEntity = sortedBidding[0]
      } else {
        highestEntity = sortedBidding[1]
      }
    }
    setHighestBidder(highestEntity)
  }

  const updateSecondHighestBidder = (newBiddingList: BiddingEntity[]) => {
    let highestEntity
    if (newBiddingList.length < 2) {
      highestEntity = null
    } else {
      const sortedBidding = newBiddingList.slice().sort((a, b) => b.amount - a.amount)
      if (
        sortedBidding[1]?.amount <= twentyFiveCrores ||
        (sortedBidding[0].amount > sortedBidding[1].amount &&
          sortedBidding[0].purseBalance > sortedBidding[1].purseBalance)
      ) {
        highestEntity = sortedBidding[1]
      } else {
        highestEntity = sortedBidding[0]
      }
    }
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
    isAuctionCompleted,
    setAuctionCompleted,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useAuction = () => useContext(ListContext)
