import { useRequest } from '@/hooks/useRequest'
// import { CricResponse } from '@/model/types/cric-response.type'
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

const headersList: CricHeaderRow[] = [
  { key: 'name', label: 'Players', type: 'string' },
  { key: 'BasePrice', label: 'Base Price', type: 'number' },
  { key: 'role', label: 'Role', type: 'string' },
  { key: 'isSold', label: 'Auction Status', type: 'string' },
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
  const auctionPlayersResponse: AuctionPlayersResponse[] =
    auctionPlayersRequest.data as AuctionPlayersResponse[]

  useEffect(() => {
    if (auctionPlayersResponse) {
      setPlayersList(auctionPlayersResponse)
      prepareTableData(auctionPlayersResponse)
    }
  }, [setPlayersList, auctionPlayersResponse])

  const prepareTableData = (playersList: AuctionPlayersResponse[]) => {
    if (playersList.length) {
      const tempTableData: CricTableRow[] = []
      playersList.forEach((playerEntity: AuctionPlayersResponse) => {
        const playerData = playerEntity as unknown as KeyValueType
        const rowData: CricTableData[] = []
        headersList.forEach((headerEntity: CricHeaderRow) => {
          const cellKey = headerEntity.key
          const cellValue = playerData[cellKey]
          const tableCell: CricTableData = {
            cellType: headerEntity.type,
            value: cellValue,
          }
          rowData.push(tableCell)
        })
        tempTableData.push({ dataList: rowData })
      })
      setTableData(tempTableData)
    }
  }

  if (auctionPlayersRequest.isLoading) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (auctionPlayersRequest.error) {
    return <p>Error: {auctionPlayersRequest.error.message}</p>
  }

  return (
    <div className='p-5'>
      <CricTable headerList={headersList} rowList={tableData} />
    </div>
  )
}

export default AuctionPlayersList
