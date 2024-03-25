import { SquadEntity } from '@/model/entities/squad.interface'
import { TableType } from '@/model/enum/table-type.enum'
import { PlayerEntity } from '@/model/response/player-response.interface'
import {
  CricHeaderRow,
  CricTableCell,
  CricTableRow,
  KeyValueType,
} from '@/model/types/cric-table.type'
import { getPlayerTableData } from './player'

export type SortOrderType = 'asc' | 'desc'

function comparator(orderBy: string, order: string) {
  return function (a: CricTableRow, b: CricTableRow) {
    const valueA = a.dataList.find(item => item.cellKey === orderBy)?.value || 0
    const valueB = b.dataList.find(item => item.cellKey === orderBy)?.value || 0
    if (order === 'asc') {
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB)
      } else {
        return Number(valueA) - Number(valueB)
      }
    } else {
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueB.localeCompare(valueA)
      } else {
        return Number(valueB) - Number(valueA)
      }
    }
  }
}

export function sortSearchTable(
  tableRows: CricTableRow[],
  searchStr: string,
  orderBy: string,
  order: string,
): CricTableRow[] {
  const tableData = searchStr ? searchItems(tableRows, searchStr) : tableRows
  const sortedData =
    orderBy && order ? tableData.slice().sort(comparator(orderBy, order)) : tableData
  return sortedData
}

export const preparePlayingXITable = (
  playersList: SquadEntity[],
  headersList: CricHeaderRow[],
  isTeamOwner: boolean,
): CricTableRow[] => {
  const tempTableData: CricTableRow[] = []
  playersList.forEach((playerEntity: SquadEntity, playerIndex: number) => {
    const rowData: CricTableCell[] = []
    headersList.forEach((headerEntity: CricHeaderRow) => {
      const cellType = headerEntity.type
      const cellKey = headerEntity.key
      const iconPath = headerEntity.iconPath
      const cellValue = getPlayingXICellValue(
        cellType,
        cellKey,
        iconPath,
        playerIndex,
        playerEntity,
      )
      const tableCell: CricTableCell = {
        cellKey: cellKey,
        cellType: cellType,
        value: cellValue,
        isDisabled:
          (headerEntity.key === 'playingXI' && isTeamOwner) || headerEntity.key !== 'playingXI'
            ? false
            : true,
      }
      rowData.push(tableCell)
    })
    tempTableData.push({
      rowId: playerEntity.playerId,
      dataList: rowData,
    })
  })
  return tempTableData
}

const getPlayingXICellValue = (
  cellType: string,
  cellKey: string,
  iconPath: string | undefined,
  teamIndex: number,
  playerEntity: SquadEntity,
) => {
  const playerData = playerEntity as never as KeyValueType
  let cellValue
  if (cellType === 'icon') {
    cellValue = iconPath
  } else if (cellKey === 'sno') {
    cellValue = teamIndex + 1
  } else {
    cellValue = playerData[cellKey]
  }
  return cellValue
}

function searchItems(data: CricTableRow[], searchTerm: string): CricTableRow[] {
  // Convert the search term to lowercase for case-insensitive search
  const term = searchTerm.toLowerCase().trim()

  // Filter the array based on the search term
  return data.filter(
    item =>
      // Check if any of the properties contain the search term
      (typeof item.rowId === 'string' && item.rowId.toLowerCase().includes(term)) ||
      (typeof item.rowId === 'number' && item.rowId.toString().toLowerCase().includes(term)) ||
      item.dataList.some(
        cell =>
          (typeof cell.value === 'string' && cell.value.toLowerCase().includes(term)) ||
          (typeof cell.value === 'number' && cell.value.toString().toLowerCase().includes(term)),
      ),
  )
}

export const prepareTableData = <T>(
  rowList: T[],
  headersList: CricHeaderRow[],
  rowIdParam: string,
  tableType: string,
) => {
  const tempTableData: CricTableRow[] = []
  rowList.forEach((rowEntity: T, rowIndex: number) => {
    const tableRows: CricTableCell[] = []
    headersList.forEach((headerEntity: CricHeaderRow) => {
      let tableCell: CricTableCell | undefined = undefined
      if (tableType === TableType.PLAYERS.toString()) {
        tableCell = getPlayerTableData(headerEntity, rowEntity as PlayerEntity, rowIndex)
      } else if (tableType === TableType.TEAMS.toString()) {
        tableCell = getPlayerTableData(headerEntity, rowEntity as PlayerEntity, rowIndex)
      }
      tableRows.push(tableCell as CricTableCell)
    })
    const rowData = rowEntity as never as KeyValueType
    tempTableData.push({
      rowId: rowData[rowIdParam] as string | number,
      dataList: tableRows,
    })
  })
  return tempTableData
}
