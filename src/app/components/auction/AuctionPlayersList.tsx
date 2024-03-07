import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { ROOSTER } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import { PLAYER } from '@/util/constants/constants'
import CricTable from '../ui/CricTable'
import { OptionsEntity } from '@/model/entities/options.interface'
import { AuctionPlayersResponse } from '@/model/response/auction-players-response.interface'
import { useAuction } from '@/providers/AuctionProvider'
import { CricHeaderRow, CricTableRow } from '@/model/types/cric-table.type'
import { COLORS } from '@/util/colors'
import { prepareAuctionPlayersTable } from '@/util/helper'
import { useTournament } from '@/providers/TournamentProvider'
import CricButton from '../ui/CricButton'
import FlagIcon from '@mui/icons-material/Flag'

const headersList: CricHeaderRow[] = [
  { key: 'sno', label: 'S.No', type: 'number' },
  { key: 'name', label: 'Players', type: 'string' },
  { key: 'basePrice', label: 'Base Price', type: 'number' },
  { key: 'role', label: 'Role', type: 'number' },
  { key: 'isSold', label: 'Auction Status', type: 'number' },
]

type AuctionPlayersListProps = {
  selectedTab: OptionsEntity
}

function AuctionPlayersList(props: AuctionPlayersListProps) {
  const { activeTournament } = useTournament()
  const { playersList, setPlayersList } = useAuction()
  const [tableData, setTableData] = useState<CricTableRow[]>([])
  const playerSetType = props.selectedTab.value
  const PLAYERS_URL = `${ROOSTER.GET_AUCTION_PLAYERS_URL}${playerSetType}`

  const auctionPlayersRequest = useRequest(PLAYERS_URL)
  const auctionPlayersResponse: CricResponse<AuctionPlayersResponse[]> =
    auctionPlayersRequest.data as CricResponse<AuctionPlayersResponse[]>

  useEffect(() => {
    if (auctionPlayersResponse?.result) {
      setPlayersList(auctionPlayersResponse.result)
      prepareTableData(auctionPlayersResponse.result)
    }
  }, [setPlayersList, auctionPlayersResponse])

  useEffect(() => {
    if (playersList) {
      prepareTableData(playersList)
    }
  }, [playersList])

  const prepareTableData = (playersList: AuctionPlayersResponse[]) => {
    if (playersList.length) {
      const tempTableData: CricTableRow[] = prepareAuctionPlayersTable(playersList, headersList)
      setTableData(tempTableData)
    }
  }

  if (auctionPlayersRequest.isLoading) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (auctionPlayersRequest.error) {
    return <p>Error: {auctionPlayersRequest.error.message}</p>
  }

  if (!auctionPlayersResponse?.result?.length) {
    return <p className='p-5'>No players found</p>
  }

  const beginAuction = () => {}

  return (
    <div className='p-5'>
      <div className='pb-5' style={{ color: COLORS.cricPrimary }}>
        {tableData?.length} {tableData?.length > 1 ? 'players' : 'player'}
      </div>
      <CricTable headerList={headersList} rowList={tableData} />
      <div className='flex justify-center pt-5'>
        {activeTournament?.isHost && (
          <CricButton
            startIcon={<FlagIcon />}
            onClick={() => beginAuction()}
            btnTxt={`Begin auction for ${props.selectedTab.label} players`}
          ></CricButton>
        )}
      </div>
    </div>
  )
}

export default AuctionPlayersList
