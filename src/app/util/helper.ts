import { User } from '@/model/entities/user.interface'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'
import { UserResponse } from '@/model/response/user-me.interface'
import { COLORS } from './colors'
import { TOURNAMENT } from './constants/constants'
import {
  CricHeaderRow,
  CricTableCell,
  CricTableRow,
  KeyValueType,
} from '@/model/types/cric-table.type'
import { AuctionPlayerEntity } from '@/model/response/auction-player-response.interface'
import { TeamEntity } from '@/model/response/team.interface'
import { SoldStatus } from '@/model/enum/sold-status.enum'
import { PlayingXIStatus } from '@/model/enum/playingxi-status.enum'

export const getUserObject = (user: User | undefined, userData: UserResponse): User => {
  const userEntity = user || new User()
  const userObject: User = {
    ...userEntity,
    id: userData.id,
    fullName: userData.fullName,
    email: userData.email,
    roles: userData.roles,
  }
  return userObject
}

export const getTournamentAdminActionConfig = (status: string) => {
  const defaultTheme = {
    bg: '',
    color: '',
    txt: '',
  }
  let actionTheme = defaultTheme

  if (status === (TournamentStatusLabel.Upcoming as string)) {
    actionTheme = {
      bg: COLORS.statusBg.preauction,
      color: COLORS.statusTxt.preauction,
      txt: TOURNAMENT.STATUS.START_TOURNAMENT,
    }
  } else if (status === (TournamentStatusLabel.PreAuction as string)) {
    actionTheme = {
      bg: COLORS.statusBg.inauction,
      color: COLORS.statusTxt.inauction,
      txt: TOURNAMENT.STATUS.START_AUCTION,
    }
  } else if (status === (TournamentStatusLabel.InAuction as string)) {
    actionTheme = {
      bg: COLORS.statusBg.inprogress,
      color: COLORS.statusTxt.inprogress,
      txt: TOURNAMENT.STATUS.END_AUCTION,
    }
  } else if (status === (TournamentStatusLabel.InProgress as string)) {
    actionTheme = {
      bg: COLORS.statusBg.completed,
      color: COLORS.statusTxt.completed,
      txt: TOURNAMENT.STATUS.END_TOURNAMENT,
    }
  } else if (status === (TournamentStatusLabel.Completed as string)) actionTheme = defaultTheme

  return actionTheme
}

export const getTournamentUserActionConfig = (
  isParticipant: boolean,
  isHost: boolean,
  status: string,
) => {
  const defaultTheme = {
    bg: '',
    color: '',
    txt: '',
  }
  let actionTheme = defaultTheme

  if (!isParticipant && status === (TournamentStatusLabel.PreAuction as string)) {
    actionTheme = {
      bg: COLORS.statusBg.inauction,
      color: COLORS.statusTxt.inauction,
      txt: TOURNAMENT.STATUS.JOIN_TOURNAMENT,
    }
  }
  //TODO: Disabling leave option for now
  // else if (isParticipant && status === (TournamentStatusLabel.PreAuction as string)) {
  //   actionTheme = {
  //     bg: COLORS.statusBg.completed,
  //     color: COLORS.statusTxt.completed,
  //     txt: TOURNAMENT.STATUS.LEAVE_TOURNAMENT,
  //   }
  // }
  return actionTheme
}

export const getTournamentStatusConfig = (status: string) => {
  const defaultTheme = { bg: COLORS.statusBg.upcoming, color: COLORS.white }
  let statusTheme = defaultTheme

  if (status === (TournamentStatusLabel.Upcoming as string))
    statusTheme = { bg: COLORS.statusBg.upcoming, color: COLORS.white }
  else if (status === (TournamentStatusLabel.PreAuction as string)) {
    statusTheme = {
      bg: COLORS.statusBg.preauction,
      color: COLORS.statusTxt.preauction,
    }
  } else if (status === (TournamentStatusLabel.InAuction as string)) {
    statusTheme = {
      bg: COLORS.statusBg.inauction,
      color: COLORS.statusTxt.inauction,
    }
  } else if (status === (TournamentStatusLabel.InProgress as string)) {
    statusTheme = {
      bg: COLORS.statusBg.inprogress,
      color: COLORS.statusTxt.inprogress,
    }
  } else if (status === (TournamentStatusLabel.Completed as string)) {
    statusTheme = {
      bg: COLORS.statusBg.completed,
      color: COLORS.statusTxt.completed,
    }
  }
  return statusTheme
}

export const prepareAuctionPlayersTable = (
  playersList: AuctionPlayerEntity[],
  headersList: CricHeaderRow[],
): CricTableRow[] => {
  const tempTableData: CricTableRow[] = []
  playersList.forEach((playerEntity: AuctionPlayerEntity, playerIndex: number) => {
    const playerData = playerEntity as never as KeyValueType
    const rowData: CricTableCell[] = []
    headersList.forEach((headerEntity: CricHeaderRow) => {
      const cellKey = headerEntity.key
      const cellType = headerEntity.type
      const cellValue = getPlayerCellValue(playerData, cellKey, playerIndex)
      const tableCell: CricTableCell = {
        cellKey: cellKey,
        cellType: cellType,
        value: cellValue,
        color:
          playerData[cellKey] === SoldStatus.SOLD
            ? COLORS.sold
            : playerData[cellKey] === SoldStatus.UNSOLD
              ? COLORS.unsold
              : '',
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

const getPlayerCellValue = (playerData: KeyValueType, cellKey: string, playerIndex: number) => {
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

export const prepareTeamTable = (
  teamList: TeamEntity[],
  headersList: CricHeaderRow[],
): CricTableRow[] => {
  const tempTableData: CricTableRow[] = []
  teamList.forEach((teamEntity: TeamEntity, teamIndex: number) => {
    const rowData: CricTableCell[] = []
    headersList.forEach((headerEntity: CricHeaderRow) => {
      const cellType = headerEntity.type
      const cellKey = headerEntity.key
      const iconPath = headerEntity.iconPath
      const cellValue = getTeamCellValue(cellType, cellKey, iconPath, teamIndex, teamEntity)
      const tableCell: CricTableCell = {
        cellKey: cellKey,
        cellType: cellType,
        value: cellValue,
        color:
          cellValue === PlayingXIStatus.SET
            ? COLORS.sold
            : cellValue === PlayingXIStatus.UNSET
              ? COLORS.unsold
              : '',
      }
      rowData.push(tableCell)
    })
    tempTableData.push({
      rowId: teamEntity.teamId,
      dataList: rowData,
    })
  })
  return tempTableData
}

const getTeamCellValue = (
  cellType: string,
  cellKey: string,
  iconPath: string | undefined,
  teamIndex: number,
  teamEntity: TeamEntity,
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

export const groupListByProp = <T>(prop: string, list: T[]) => {
  const grouped = new Map<string, T[]>()
  for (const item of list) {
    const itemData = item as never as KeyValueType
    const key = itemData[prop] as never
    const existingArray = grouped.get(key) || []
    existingArray.push(item)
    grouped.set(key, existingArray)
  }
  return grouped
}

export function hasMismatch(data1: number[], data2: number[]) {
  const array1 = data1.sort((a, b) => a - b)
  const array2 = data2.sort((a, b) => a - b)
  console.log(array1)
  console.log(array2)

  if (array1.length !== array2.length) {
    return true
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return true
    }
  }

  return false
}
