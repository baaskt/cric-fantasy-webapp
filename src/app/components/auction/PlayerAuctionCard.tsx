import React, { useState } from 'react'
import PlayerCard from '../PlayerCard'
import CricButton from '../ui/CricButton'
import { COLORS } from '@/util/colors'
import CricTab from '../ui/CricTab'
import PlayerStats from '../PlayerStats'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { OptionsEntity } from '@/model/entities/options.interface'
import { STATS } from '@/util/constants/constants'
import { useAuction } from '@/providers/AuctionProvider'
import { SellPlayerRequest } from '@/model/request/sell-player-request.type'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { PLAYERS } from '@/util/constants/endpoints'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { SoldStatus } from '@/model/enum/sold-status.enum'
import { CricResponse } from '@/model/types/cric-response.type'
import { useRouter } from 'next/navigation'
import { useTournament } from '@/providers/TournamentProvider'
import { currencyToString } from '@/util/bidding'
import { useSWRConfig } from 'swr'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'

const tabOptions: OptionsEntity[] = [
  { id: STATS.ipl, label: 'IPL' },
  { id: STATS.t20, label: 'T20' },
]

function PlayerAuctionCard() {
  const { activeTournament } = useTournament()
  const { activeCategory, auctionPlayer, highestBidder, updatePlayer } = useAuction()
  const { mutate } = useSWRConfig()

  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  const unsoldPlayerRequest = useMutateRequest(
    auctionPlayer?.player && auctionPlayer.player.playerId
      ? PLAYERS.SELL_PLAYER.replace('tournamentId', '088e579a-3966-4b49-9555-ea1b3a087496').replace(
          'playerId',
          auctionPlayer?.player.playerId.toString(),
        )
      : '',
    HttpMethod.PUT,
  )
  if (!auctionPlayer) return <></>
  const playerEntity = auctionPlayer?.player

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
  }

  const handleUnSoldPlayer = () => {
    void setPlayerUnsold()
  }

  const setPlayerUnsold = async () => {
    const payload: SellPlayerRequest = {
      soldStatus: SoldStatus.UNSOLD,
      teamId: '',
      soldAmount: 0,
      teamMaxBid: [],
    }
    try {
      const response: CricResponse<string> = (await unsoldPlayerRequest.trigger(
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

  const mutatePlayersList = async () => {
    const updatedPlayer: AuctionPlayerEntity = {
      playerId: playerEntity.playerId,
      name: playerEntity.name,
      role: playerEntity.role,
      basePrice: playerEntity.basePrice,
      clubName: playerEntity.clubName,
      soldStatus: SoldStatus.UNSOLD,
      category: playerEntity.category,
    }
    const PLAYERS_URL = `${PLAYERS.GET_AUCTION_PLAYERS_URL.replace('tournamentId', '088e579a-3966-4b49-9555-ea1b3a087496')}${activeCategory?.value}`
    const updatedList = updatePlayer(playerEntity.playerId, updatedPlayer)
    await mutate(PLAYERS_URL, updatedList)
  }

  return (
    <>
      <div className='flex items-center flex-col justify-between'>
        <PlayerCard playerData={playerEntity}></PlayerCard>
        <div className='mt-5 flex flex-col items-center'>
          <div className='text-2xl'>{playerEntity.basePrice}</div>
          <div>( {currencyToString(playerEntity.basePrice)} )</div>
          <div style={{ color: COLORS.cricPrimary }} className='text-md mt-2'>
            Base Price
          </div>
        </div>
        <div className='mt-5 text-base whitespace-nowrap italic text-slate-500'>
          {playerEntity.clubName}
        </div>
      </div>
      <div className='pl-5 pr-5 flex flex-col items-center'>
        <CricTab optionList={tabOptions} onChange={handleChange} />
        <PlayerStats title={selectedTab.id as string} playerData={playerEntity}></PlayerStats>
        {!highestBidder?.amount && (
          <div className='mt-5'>
            <CricButton
              btnTxt='Mark as unsold'
              startIcon={<NotInterestedIcon />}
              bgColor={COLORS.lightRed}
              onClick={() => handleUnSoldPlayer()}
              isLoading={unsoldPlayerRequest.isMutating}
              isFullWidth={true}
            ></CricButton>
          </div>
        )}
      </div>
    </>
  )
}

export default PlayerAuctionCard
