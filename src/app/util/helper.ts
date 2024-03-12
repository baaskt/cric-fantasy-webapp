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
  } else if (isParticipant && status === (TournamentStatusLabel.PreAuction as string)) {
    actionTheme = {
      bg: COLORS.statusBg.completed,
      color: COLORS.statusTxt.completed,
      txt: TOURNAMENT.STATUS.LEAVE_TOURNAMENT,
    }
  } else if ((isHost || isParticipant) && status === (TournamentStatusLabel.InAuction as string)) {
    actionTheme = {
      bg: COLORS.statusBg.inprogress,
      color: COLORS.statusTxt.inprogress,
      txt: TOURNAMENT.STATUS.ENTER_AUCTION,
    }
  }
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
      const cellValue =
        cellKey === 'sno'
          ? playerIndex + 1
          : cellKey === 'isSold' && !playerData[cellKey]
            ? 'To be auctioned'
            : playerData[cellKey]
      const tableCell: CricTableCell = {
        cellType: cellType,
        value: cellValue,
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
        cellType: cellType,
        value: cellValue,
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
  const cellValue =
    cellType === 'icon' ? iconPath : cellKey === 'pos' ? teamIndex + 1 : teamData[cellKey]
  return cellValue
}
