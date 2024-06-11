import { PlayingXIStatus } from '@/model/enum/playingxi-status.enum'
import {
  CricCellObj,
  CricHeaderRow,
  CricTableCell,
  KeyValueType,
} from '@/model/types/cric-table.type'
import { COLORS } from '../colors'
import { TeamPointsEntity } from '@/model/response/team-points.interface'

export const prepareDashboardTable = (
  headerEntity: CricHeaderRow,
  teamEntity: TeamPointsEntity,
): CricTableCell => {
  const cellType = headerEntity.type
  const cellKey = headerEntity.key
  const iconPath = headerEntity.iconPath
  const value = getDashboardCellValue(cellType, cellKey, iconPath, teamEntity)
  const color = getDashboardCellColor(value)
  const tableCell: CricTableCell = {
    cellKey: cellKey,
    cellType: cellType,
    value: value,
    color: color,
    isMobileView: headerEntity.isMobile ? true : false,
    headerName: headerEntity.label,
  }
  return tableCell
}

const getDashboardCellValue = (
  cellType: string,
  cellKey: string,
  iconPath: string | undefined,
  teamEntity: TeamPointsEntity,
) => {
  const teamData = teamEntity as never as KeyValueType
  let cellValue
  if (cellType === 'icon') {
    cellValue = iconPath
  } else if (cellType === 'stock') {
    if (cellKey === 'position') {
      cellValue = {
        original: teamEntity.position,
        delta: teamEntity.prevPosition - teamEntity.position,
        iconType: 'arrow',
      }
    } else if (cellKey === 'tournamentPoints') {
      cellValue = {
        original: teamEntity.tournamentPoints,
        delta: teamEntity.tournamentPoints - teamEntity.prevPoints,
        iconType: 'trend',
      }
    }
  } else {
    cellValue = teamData[cellKey]
  }
  return cellValue
}

const getDashboardCellColor = (
  cellValue: string | number | string[] | null | undefined | CricCellObj,
): string => {
  if (cellValue === PlayingXIStatus.SET) return COLORS.sold
  else if (cellValue === PlayingXIStatus.UNSET) return COLORS.unsold
  else return ''
}
