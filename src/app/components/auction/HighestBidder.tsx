import { useAuction } from '@/providers/AuctionProvider'
import { currencyToString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import React from 'react'
import CricButton from '../ui/CricButton'
import GavelIcon from '@mui/icons-material/Gavel'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { PLAYERS } from '@/util/constants/endpoints'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { SoldStatus } from '@/model/enum/sold-status.enum'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/navigation'
import { SellPlayerRequest } from '@/model/request/sell-player-request.type'

function HighestBidder() {
  const { activeTournament } = useTournament()
  const { auctionPlayer, activeCategory, biddingList, updatePlayer, highestBidder } = useAuction()
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const tournamentId = activeTournament?.tournamentId || ''

  const SELL_PLAYER_URL =
    tournamentId && auctionPlayer?.player && auctionPlayer.player.playerId
      ? PLAYERS.SELL_PLAYER.replace('tournamentId', tournamentId).replace(
          'playerId',
          auctionPlayer?.player.playerId.toString(),
        )
      : ''
  const sellPlayerRequest = useMutateRequest(SELL_PLAYER_URL, HttpMethod.PUT)

  if (!auctionPlayer) return <></>
  const playerEntity = auctionPlayer?.player

  const handlePlayerSelling = () => {
    void setPlayerSold()
  }

  const setPlayerSold = async () => {
    if (highestBidder) {
      const payload: SellPlayerRequest = {
        soldStatus: SoldStatus.SOLD,
        teamId: highestBidder.teamId,
        soldAmount: highestBidder?.amount,
        teamMaxBid: biddingList.map(({ teamId, amount }) => ({ teamId, amount })),
      }
      try {
        const response: CricResponse<string> = (await sellPlayerRequest.trigger(
          payload as never,
        )) as CricResponse<string>
        console.log(response)
      } catch (e) {
        console.log(e)
      } finally {
        void mutatePlayersList()
        router.push(`${'/tournaments/'}${activeTournament?.tournamentId}${'/auction'}`)
      }
    }
  }

  const mutatePlayersList = async () => {
    const updatedPlayer: AuctionPlayerEntity = {
      playerId: playerEntity.playerId,
      name: playerEntity.name,
      role: playerEntity.role,
      basePrice: playerEntity.basePrice,
      clubName: playerEntity.clubName,
      soldStatus: SoldStatus.SOLD,
      category: playerEntity.category,
    }
    const PLAYERS_URL = `${PLAYERS.GET_AUCTION_PLAYERS_URL.replace('tournamentId', tournamentId)}${activeCategory?.value}`
    const updatedList = updatePlayer(playerEntity.playerId, updatedPlayer)
    await mutate(PLAYERS_URL, updatedList)
  }

  return (
    highestBidder && (
      <div
        className='rounded-lg shadow-lg'
        style={{ backgroundColor: COLORS.cricPrimary, color: COLORS.white }}
      >
        <div className='text-center'>
          <div className='ml-5 mr-5 p-2 rounded-b-xl text-sm bg-amber-300 text-black'>
            Highest Bidder
          </div>
          <div className='p-3'>
            <div className='mt-5'>{highestBidder.teamName}</div>
            <div className='mt-3 text-2xl font-bold'>₹ {highestBidder.amount}</div>
            <div className='text-md'>( {currencyToString(highestBidder.amount)} )</div>
          </div>
        </div>
        <div className='p-4 mt-5 flex justify-center'>
          <CricButton
            btnTxt='Hammer Down'
            startIcon={<GavelIcon />}
            color={COLORS.cricPrimary}
            bgColor={COLORS.white}
            onClick={() => handlePlayerSelling()}
            isLoading={sellPlayerRequest.isMutating}
            isFullWidth={true}
          ></CricButton>
        </div>
      </div>
    )
  )
}

export default HighestBidder
