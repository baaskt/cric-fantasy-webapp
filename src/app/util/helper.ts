import { User } from '@/model/entities/user.interface'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'
import { UserResponse } from '@/model/response/user-me.interface'
import { COLORS } from './colors'
import { TOURNAMENT } from './constants/constants'
import { KeyValueType } from '@/model/types/cric-table.type'

export const getUserObject = (user: User | undefined, userData: UserResponse): User => {
  const userEntity = user || new User()
  const userObject: User = {
    ...userEntity,
    id: userData.id,
    fullName: userData.fullName,
    email: userData.email,
    roles: userData.roles,
    tournament: userData.tournament,
    isPlayingXIUpdateOpen: userData.isPlayingXIUpdateOpen,
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

export function convertUtcToLocal(utcString: string): string {
  const utcDate = new Date(utcString)
  utcDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset())
  return `${utcDate.toLocaleDateString()} - ${utcDate.toLocaleTimeString()}`
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

export const convertDriveUrl = (url: string): string => {
  const match = url?.match(/id=([\w-]+)/)
  return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : ''
}

export function convertToSentenceCase(key: string): string {
  // If key is all lowercase (no uppercase letters), return as-is
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces (if needed)
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize each word
}

export function isSameDate(valueYYYYMMDD: string, startTime: string) {
  const formattedValue =
    valueYYYYMMDD.slice(0, 4) + '-' + valueYYYYMMDD.slice(4, 6) + '-' + valueYYYYMMDD.slice(6, 8)

  const d1 = new Date(formattedValue)
  const d2 = new Date(startTime)

  return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0]
}
export function formatTimeAgo(dateString: string | number | Date) {
  const now = new Date()
  const past = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 5) return 'Just now'
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`

  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`

  return past.toLocaleDateString()
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

export function convertTimeStrToUtc(timeStr: string): string {
  const timeStrSplit = timeStr.split(':')
  return toUTC(timeStrSplit[0], timeStrSplit[1])
}

export function convertToUtcAndFormat(timeStr: string | undefined): string {
  if (!timeStr) return formatTimeFromDate()
  const timeStrSplit = timeStr.split(':')
  const utcTime = toUTC(timeStrSplit[0], timeStrSplit[1])
  return formatTimeFromDate(utcTime)
}

export function toUTC(hours: string, minutes: string): string {
  const now = new Date()
  now.setHours(Number(hours), Number(minutes), 0, 0)
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')
  const utcHour = String(now.getUTCHours()).padStart(2, '0')
  const utcMinute = String(now.getUTCMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${utcHour}:${utcMinute}:00`
}

export function convertUtcTimeStrToLocal(timeStr: string | undefined): string {
  if (!timeStr) return formatTimeFromDate()
  const [hours, minutes] = timeStr.split(':').map(Number)
  const date = new Date()
  date.setUTCHours(hours, minutes, 0, 0)
  const localHours = String(date.getHours()).padStart(2, '0')
  const localMinutes = String(date.getMinutes()).padStart(2, '0')
  return `${localHours}:${localMinutes}`
}

export function formatTimeFromDate(timeStr?: string): string {
  const date = timeStr ? new Date(timeStr) : new Date()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}
