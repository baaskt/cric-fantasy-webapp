import { AuctionContextType } from '@/model/context/auctionContextType'
import { BiddingEntity } from '@/model/entities/bidding.interface'
import { OptionsEntity } from '@/model/entities/options.interface'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import { LastAuctionPlayerDetailEntity } from '@/model/response/last-aucton-player.response.interface'
import { PlayerRandomEntity } from '@/model/response/player-response.interface'
import { maxBidCap } from '@/util/bidding'
import React, { createContext, useContext, useState } from 'react'

const AuctionContext = createContext<AuctionContextType>({} as AuctionContextType)
const { Provider } = AuctionContext

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
    setBiddingList(updatedList)
  }

  const updateHighestBidder = (newBiddingList: BiddingEntity[]) => {
    let highestEntity, secondHighestEntity
    if (newBiddingList.length === 0) {
      highestEntity = null
      secondHighestEntity = null
    } else if (newBiddingList.length === 1) {
      highestEntity = newBiddingList[0]
      secondHighestEntity = null
    } else {
      const sortedBidding = newBiddingList.slice().sort((a, b) => b.amount - a.amount)
      const maxCapBidders = sortedBidding.filter(bidding => bidding.amount === maxBidCap)
      const isPurseBalanceSame = hasSamePurseBalance(maxCapBidders)
      const sortedPurseBidders = maxCapBidders.sort((a, b) => b.purseBalance - a.purseBalance)
      if (sortedBidding[0].amount < maxBidCap || maxCapBidders.length < 2) {
        highestEntity = sortedBidding[0]
        secondHighestEntity = sortedBidding[1]
      } else if (maxCapBidders.length >= 2 && !isPurseBalanceSame) {
        highestEntity = sortedPurseBidders[0]
        secondHighestEntity = sortedPurseBidders[1]
      } else {
        const equalPurseBidders = sortedPurseBidders.filter(
          bidder => bidder.purseBalance === sortedPurseBidders[0].purseBalance,
        )
        const shuffledList = shuffleList(equalPurseBidders)
        highestEntity = shuffledList[0]
        secondHighestEntity = shuffledList[1]
      }
    }
    setHighestBidder(highestEntity)
    setSecondHighestBidder(secondHighestEntity)
  }

  const hasSamePurseBalance = (bidders: BiddingEntity[]) => {
    const balances = bidders.map(bidder => bidder.purseBalance)
    const uniqueBalances = new Set(balances)
    return balances.length !== uniqueBalances.size
  }

  const shuffleList = (bidders: BiddingEntity[]) => {
    for (let i = bidders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)) // Generate random index between 0 and i (inclusive)
      ;[bidders[i], bidders[j]] = [bidders[j], bidders[i]] // Swap elements at positions i and j
    }
    return bidders
  }

  // const updateSecondHighestBidder = (newBiddingList: BiddingEntity[]) => {
  //   let highestEntity
  //   if (newBiddingList.length < 2) {
  //     highestEntity = null
  //   } else {
  //     const sortedBidding = newBiddingList.slice().sort((a, b) => b.amount - a.amount)
  //     const maxCapBidders = sortedBidding.filter(bidding => bidding.amount === twentyFiveCrores);
  //     if (
  //       sortedBidding[1].amount < twentyFiveCrores ||
  //       (sortedBidding[1].amount === twentyFiveCrores &&
  //         sortedBidding[1].amount >= sortedBidding[0].amount &&
  //         sortedBidding[0].purseBalance > sortedBidding[1].purseBalance)
  //     ) {
  //       highestEntity = sortedBidding[1]
  //     } else {
  //       highestEntity = sortedBidding[0]
  //     }
  //   }
  //   setSecondHighestBidder(highestEntity)
  // }

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

export const useAuction = () => useContext(AuctionContext)
