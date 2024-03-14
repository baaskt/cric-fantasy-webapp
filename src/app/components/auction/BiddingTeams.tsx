import { useRequest } from '@/hooks/useRequest'
import { TeamEntity } from '@/model/response/team.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { TEAMS } from '@/util/constants/endpoints'
import React from 'react'
import Loading from '../Loading'
import { NO_CACHE, TEAM } from '@/util/constants/constants'
import BiddingTeamCard from './BiddingTeamCard'
import { useAuction } from '@/providers/AuctionProvider'
import { getBiddingValue } from '@/util/bidding'

function BiddingTeams() {
  const { auctionPlayer, highestBidder, secondHighestBidder, updateBiddingList } = useAuction()
  const teamRequest = useRequest(TEAMS.GET_ALL_TEAMS, NO_CACHE)
  const teamResponse: CricResponse<TeamEntity[]> = teamRequest.data as CricResponse<TeamEntity[]>

  if (teamRequest.isLoading) {
    return <Loading txt={TEAM.LOADING_TXT}></Loading>
  }

  if (!teamResponse?.result?.length) {
    return <p className='p-5'>No teams found</p>
  }

  const bidPlayer = (teamData: TeamEntity) => {
    const { teamId, teamName, purseBalance } = teamData
    if (highestBidder?.teamId === teamId) return

    const basePrice = auctionPlayer?.player.basePrice || 0
    const highestBid = highestBidder?.amount || 0
    const tempBidding = {
      teamId: teamId,
      purseBalance: purseBalance,
      teamName: teamName,
      amount: getBiddingValue(basePrice, highestBid),
    }
    updateBiddingList(tempBidding)
  }

  const teamList = [...teamResponse.result]

  return (
    <div className='flex flex-wrap flex-row gap-5 justify-center basis-1/2 p-2'>
      {teamList.map(team => (
        <BiddingTeamCard
          key={team.teamId}
          teamData={team}
          onBidding={bidPlayer}
          isHighestBidder={highestBidder?.teamId === team.teamId}
          isSecondHighestBidder={secondHighestBidder?.teamId === team.teamId}
        />
      ))}
    </div>
  )
}

export default BiddingTeams
