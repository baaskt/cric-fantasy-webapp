import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { PLAYERS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import { PLAYER } from '@/util/constants/constants'
import CricTable from '../ui/CricTable'
import { OptionsEntity } from '@/model/entities/options.interface'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import { useAuction } from '@/providers/AuctionProvider'
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import { COLORS } from '@/util/colors'
import { prepareAuctionPlayersTable } from '@/util/helper'
import { useTournament } from '@/providers/TournamentProvider'
import CricButton from '../ui/CricButton'
import FlagIcon from '@mui/icons-material/Flag'
import { useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'

const headersList: CricHeaderRow[] = [
  { key: 'sno', label: 'S.No', type: 'number' },
  { key: 'name', label: 'Players', type: 'string' },
  { key: 'clubName', label: 'Club', type: 'string' },
  { key: 'basePrice', label: 'Base Price', type: 'number' },
  { key: 'role', label: 'Role', type: 'number' },
  { key: 'soldStatus', label: 'Auction Status', type: 'number' },
]

type AuctionPlayersListProps = {
  selectedTab: OptionsEntity
  categories: OptionsEntity[]
}

function AuctionPlayersList(props: AuctionPlayersListProps) {
  const router = useRouter()
  const { activeTournament } = useTournament()
  const { activeCategory, playersList, setPlayersList, lastAuctionPlayer } = useAuction()
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const playerSetType = props.selectedTab.value
  const tournamentId = activeTournament?.tournamentId || ''
  const PLAYERS_URL = tournamentId
    ? `${PLAYERS.GET_AUCTION_PLAYERS_URL.replace('tournamentId', tournamentId)}${playerSetType}`
    : ''
  const auctionPlayersRequest = useRequest(PLAYERS_URL)
  const { cache } = useSWRConfig()

  useEffect(() => {
    if (auctionPlayersRequest?.data) {
      const auctionPlayersResponse: CricResponse<AuctionPlayerEntity[]> =
        auctionPlayersRequest.data as CricResponse<AuctionPlayerEntity[]>
      if (auctionPlayersResponse.result) {
        setPlayersList(auctionPlayersResponse.result)
      }
    }
  }, [setPlayersList, auctionPlayersRequest?.data])

  useEffect(() => {
    if (playersList) {
      console.log(cache)
      console.log(playersList)
      console.log(props.selectedTab.value)
      prepareTableData(playersList)
    }
  }, [playersList, playerSetType])

  const prepareTableData = (playersList: AuctionPlayerEntity[]) => {
    if (playersList.length) {
      const tempTableData: CricTableRow[] = prepareAuctionPlayersTable(playersList, headersList)
      setTableData(tempTableData)
    }
  }

  if (auctionPlayersRequest.isValidating) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (auctionPlayersRequest.error) {
    return <p>Error: {auctionPlayersRequest.error.message}</p>
  }

  if (!playersList?.length && !auctionPlayersRequest.isValidating) {
    return <p className='p-5'>No players found</p>
  }

  const beginAuction = () => {
    const redirectUrl = 'auction/board'
    router.push(redirectUrl)
  }

  return (
    <div className='p-5'>
      <div className='pb-5' style={{ color: COLORS.cricPrimary }}>
        {tableData?.length} {tableData?.length > 1 ? 'players' : 'player'}
      </div>
      <CricTable headerList={headersList} rowList={tableData} fullWidth={false} />
      <div className='flex justify-center pt-16'>
        {activeTournament?.isHost && !lastAuctionPlayer && (
          <CricButton
            startIcon={<FlagIcon />}
            onClick={() => beginAuction()}
            btnTxt={`Begin auction for ${activeCategory?.label}`}
          ></CricButton>
        )}
      </div>
    </div>
  )
}

export default AuctionPlayersList
