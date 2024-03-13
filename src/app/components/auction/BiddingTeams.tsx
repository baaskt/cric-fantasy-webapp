import { useRequest } from '@/hooks/useRequest'
import { TeamEntity } from '@/model/response/team.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { TEAMS } from '@/util/constants/endpoints'
import React from 'react'
import Loading from '../Loading'
import { TEAM } from '@/util/constants/constants'
import BiddingTeamCard from './BiddingTeamCard'
import { useAuction } from '@/providers/AuctionProvider'
import { getBiddingValue } from '@/util/bidding'

function BiddingTeams() {
  const { auctionPlayer, highestBidder, updateBiddingList } = useAuction()
  const teamRequest = useRequest(TEAMS.GET_ALL_TEAMS)
  const teamResponse: CricResponse<TeamEntity[]> = teamRequest.data as CricResponse<TeamEntity[]>

  if (teamRequest.isLoading) {
    return <Loading txt={TEAM.LOADING_TXT}></Loading>
  }

  if (!teamResponse?.result?.length) {
    return <p className='p-5'>No teams found</p>
  }

  const bidPlayer = (teamData: TeamEntity) => {
    const { teamId, teamName } = teamData
    const basePrice = auctionPlayer?.player.basePrice || 0
    const highestBid = highestBidder?.amount || 0
    const tempBidding = {
      teamId: teamId,
      teamName: teamName,
      amount: getBiddingValue(basePrice, highestBid),
    }
    updateBiddingList(tempBidding)
  }

  const teamList = [...teamResponse.result]

  return (
    <div className='flex flex-wrap flex-row gap-5 justify-center basis-1/2'>
      {teamList.map(team => (
        <BiddingTeamCard key={team.teamId} teamData={team} onBidding={bidPlayer} />
      ))}
    </div>
  )
}

export default BiddingTeams
