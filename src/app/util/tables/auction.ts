import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import {
  CricCellObj,
  CricHeaderRow,
  CricTableCell,
  KeyValueType,
} from '@/model/types/cric-table.type'
import { SoldStatus } from '@/model/enum/sold-status.enum'
import { COLORS } from '../colors'

export const getAuctionTableData = (
  headerEntity: CricHeaderRow,
  playerListEntity: AuctionPlayerEntity,
  playerIndex: number,
): CricTableCell => {
  const cellType = headerEntity.type
  const cellKey = headerEntity.key
  const iconPath = headerEntity.iconPath
  const value = getPlayerCellValue(cellType, cellKey, iconPath, playerListEntity, playerIndex)
  const tableCell: CricTableCell = {
    cellKey: cellKey,
    cellType: cellType,
    value: value,
    color: getPlayersCellColor(value),
    isMobileView: headerEntity.isMobile ? true : false,
    headerName: headerEntity.label,
  }
  return tableCell
}

const getPlayerCellValue = (
  cellType: string,
  cellKey: string,
  iconPath: string | undefined,
  playerListEntity: AuctionPlayerEntity,
  playerIndex: number,
) => {
  const playerData = playerListEntity as never as KeyValueType
  let cellValue
  if (cellKey === 'sno') {
    cellValue = playerIndex + 1
  } else if (cellKey === 'soldStatus' && playerData[cellKey] === SoldStatus.NOT_AUCTIONED) {
    cellValue = 'To be auctioned'
  } else {
    cellValue = playerData[cellKey]
  }
  return cellValue
}

const getPlayersCellColor = (
  cellValue: string | number | string[] | null | undefined | CricCellObj,
): string => {
  if (cellValue === SoldStatus.SOLD) return COLORS.sold
  else if (cellValue === SoldStatus.UNSOLD) return COLORS.unsold
  else return ''
}
