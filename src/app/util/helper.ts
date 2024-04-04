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
import { SoldStatus } from '@/model/enum/sold-status.enum'

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

export function formatDateAndTime(dateTimeString: string) {
  if (!dateTimeString) return ''
  const dateComponents = dateTimeString.split(' ')
  const utcTimeString = `${dateComponents[0]}T${dateComponents[1]}Z`
  const localTime = new Date(utcTimeString)

  // Get the date components
  const year = localTime.getFullYear()
  const month = String(localTime.getMonth() + 1).padStart(2, '0')
  const day = String(localTime.getDate()).padStart(2, '0')

  // Get the time components
  const hours = String(localTime.getHours()).padStart(2, '0')
  const minutes = String(localTime.getMinutes()).padStart(2, '0')

  // Combine date and time components into a formatted string
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`
  return formattedDateTime
}

export const getTeamColors = (team1: string | undefined, team2: string | undefined) => {
  const team1Name = team1 || ''
  const team2Name = team2 || ''
  const fromColor = getColor(team1Name)
  const toColor = getColor(team2Name)
  return { fromColor, toColor }
}

const getColor = (team: string): string => {
  if (team === 'RCB') return COLORS.iplTeam.rcb
  else if (team === 'CSK') return COLORS.iplTeam.csk
  else if (team === 'DC') return COLORS.iplTeam.dc
  else if (team === 'PBKS') return COLORS.iplTeam.pbks
  else if (team === 'KKR') return COLORS.iplTeam.kkr
  else if (team === 'SRH') return COLORS.iplTeam.srh
  else if (team === 'RR') return COLORS.iplTeam.rr
  else if (team === 'LSG') return COLORS.iplTeam.lsg
  else if (team === 'GT') return COLORS.iplTeam.gt
  else if (team === 'MI') return COLORS.iplTeam.mi
  else return COLORS.cricPrimary
}
