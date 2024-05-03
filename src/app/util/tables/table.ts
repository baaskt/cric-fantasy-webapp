import { SquadEntity } from '@/model/entities/squad.interface'
import { TableType } from '@/model/enum/table-type.enum'
import {
  CricHeaderRow,
  CricTableCell,
  CricTableRow,
  KeyValueType,
} from '@/model/types/cric-table.type'
import { getPlayerTableData, getPlayingXITableData } from '../player'
import { prepareTeamTable } from './team'
import { TeamEntity } from '@/model/response/team.interface'
import { PlayersListEntity } from '@/model/response/player-list.response.interface'
import { prepareDashboardTable } from './dashboard'
import { TeamPointsEntity } from '@/model/response/team-points.interface'

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
  sortParam?: string,
  otherData?: OtherTableData,
) => {
  const tableRows: CricTableRow[] = []
  const sortedRowList = sortParam
    ? rowList.sort(
        (a: T, b: T) => (b[sortParam as keyof T] as number) - (a[sortParam as keyof T] as number),
      )
    : rowList
  sortedRowList.forEach((rowEntity: T, rowIndex: number) => {
    const tableCells: CricTableCell[] = []
    headersList.forEach((headerEntity: CricHeaderRow) => {
      let tableCell: CricTableCell | undefined = undefined
      if (tableType === TableType.PLAYERS.toString()) {
        tableCell = getPlayerTableData(
          headerEntity,
          rowEntity as PlayersListEntity,
          rowIndex,
          otherData,
        )
      } else if (tableType === TableType.TEAMS.toString()) {
        tableCell = prepareTeamTable(headerEntity, rowEntity as TeamEntity, rowIndex)
      } else if (tableType === TableType.PLAYING_XI.toString()) {
        tableCell = getPlayingXITableData(
          headerEntity,
          rowEntity as SquadEntity,
          rowIndex,
          otherData,
        )
      } else if (tableType === TableType.DASHBOARD.toString()) {
        tableCell = prepareDashboardTable(headerEntity, rowEntity as TeamPointsEntity)
      }
      tableCells.push(tableCell as CricTableCell)
    })
    const rowData = rowEntity as never as KeyValueType
    tableRows.push({
      rowId: rowData[rowIdParam] as string | number,
      dataList: tableCells,
    })
  })
  return tableRows
}

export interface OtherTableData {
  isXIChangeAllowed?: boolean
  teamName?: string
}
