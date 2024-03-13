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

const tabOptions: OptionsEntity[] = [
  { id: STATS.ipl, label: 'IPL' },
  { id: STATS.t20, label: 'T20' },
]

function PlayerAuctionCard() {
  const { activeTournament } = useTournament()
  const { auctionPlayer, highestBidder } = useAuction()
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
      router.push(`${'/tournaments/'}${activeTournament?.tournamentId}${'/auction'}`)
    }
  }

  return (
    <>
      <div className='flex items-center flex-col justify-between'>
        <PlayerCard playerData={playerEntity}></PlayerCard>
        <div className='mt-5 flex flex-col items-center'>
          <div className='text-2xl'>{playerEntity.basePrice}</div>
          <div className='text-sm'>Base Price</div>
        </div>
        <div className='mt-5 text-base'>{playerEntity.intlTeam}</div>
        {!highestBidder?.amount && (
          <CricButton
            btnTxt='Mark as unsold'
            startIcon={<NotInterestedIcon />}
            bgColor={COLORS.lightRed}
            onClick={() => handleUnSoldPlayer()}
          ></CricButton>
        )}
      </div>
      <div className='pl-5 pr-5'>
        <CricTab optionList={tabOptions} onChange={handleChange} />
        <PlayerStats title={selectedTab.id as string} playerData={playerEntity}></PlayerStats>
      </div>
    </>
  )
}

export default PlayerAuctionCard
