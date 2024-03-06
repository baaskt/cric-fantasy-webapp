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
import {
  CricHeaderRow,
  CricTableData,
  CricTableRow,
  KeyValueType,
} from '@/model/types/cric-table.type'
import { COLORS } from '@/util/colors'

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
  const { setPlayersList } = useAuction()
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

  const prepareTableData = (playersList: AuctionPlayersResponse[]) => {
    if (playersList.length) {
      const tempTableData: CricTableRow[] = []
      playersList.forEach(
        (playerEntity: AuctionPlayersResponse, playerIndex: number) => {
          const playerData = playerEntity as unknown as KeyValueType
          const rowData: CricTableData[] = []
          headersList.forEach((headerEntity: CricHeaderRow) => {
            const cellKey = headerEntity.key
            const cellType = headerEntity.type
            const cellValue =
              cellKey === 'sno'
                ? playerIndex + 1
                : cellKey === 'isSold' && !playerData[cellKey]
                  ? 'To be auctioned'
                  : playerData[cellKey]
            const tableCell: CricTableData = {
              cellType: cellType,
              value: cellValue,
            }
            rowData.push(tableCell)
          })
          tempTableData.push({
            rowId: playerEntity.playerId,
            dataList: rowData,
          })
        },
      )
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

  return (
    <div className='p-5'>
      <div className='pb-5' style={{ color: COLORS.cricPrimary }}>
        {tableData?.length} {tableData?.length > 1 ? 'players' : 'player'}
      </div>
      <CricTable headerList={headersList} rowList={tableData} />
    </div>
  )
}

export default AuctionPlayersList
