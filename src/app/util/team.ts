import { PlayingXIStatus } from '@/model/enum/playingxi-status.enum'
import { TeamEntity } from '@/model/response/team.interface'
import { CricHeaderRow, CricTableCell, KeyValueType } from '@/model/types/cric-table.type'
import { COLORS } from './colors'

export const prepareTeamTable = (
  headerEntity: CricHeaderRow,
  teamEntity: TeamEntity,
  teamIndex: number,
): CricTableCell => {
  const cellType = headerEntity.type
  const cellKey = headerEntity.key
  const iconPath = headerEntity.iconPath
  const value = getTeamCellValue(cellType, cellKey, iconPath, teamEntity, teamIndex)
  const color = getTeamCellColor(value)
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

const getTeamCellValue = (
  cellType: string,
  cellKey: string,
  iconPath: string | undefined,
  teamEntity: TeamEntity,
  teamIndex: number,
) => {
  const teamData = teamEntity as never as KeyValueType
  let cellValue
  if (cellType === 'icon') {
    cellValue = iconPath
  } else if (cellKey === 'pos') {
    cellValue = teamIndex + 1
  } else if (cellKey === 'teamMembers') {
    cellValue = teamEntity.teamMembers.map(data => data.name)
  } else if (cellKey === 'playingXI') {
    cellValue = teamEntity.playingXI?.length === 11 ? 'SET' : 'UNSET'
  } else {
    cellValue = teamData[cellKey]
  }
  return cellValue
}

const getTeamCellColor = (cellValue: string | number | string[] | null | undefined): string => {
  if (cellValue === PlayingXIStatus.SET) return COLORS.sold
  else if (cellValue === PlayingXIStatus.UNSET) return COLORS.unsold
  else return ''
}
