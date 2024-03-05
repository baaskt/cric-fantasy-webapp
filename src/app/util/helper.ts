import { User } from '@/model/entities/user.interface'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'
import { UserResponse } from '@/model/response/user-me.interface'
import { COLORS } from './colors'
import { TOURNAMENT } from './constants/constants'

export const getUserObject = (
  user: User | undefined,
  userData?: UserResponse,
): User => {
  const userEntity = user || new User()
  const userResponse = userData?.user
  const fullName = userResponse?.fullName ? userResponse?.fullName : ''
  const email = userResponse?.email ? userResponse?.email : ''
  const roles = userResponse?.roles ? userResponse?.roles : []
  const userObject: User = {
    ...userEntity,
    fullName: fullName,
    email: email,
    roles: roles,
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
  } else if (status === (TournamentStatusLabel.Completed as string))
    actionTheme = defaultTheme

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

  if (
    !isParticipant &&
    status === (TournamentStatusLabel.PreAuction as string)
  ) {
    actionTheme = {
      bg: COLORS.statusBg.inauction,
      color: COLORS.statusTxt.inauction,
      txt: TOURNAMENT.STATUS.JOIN_TOURNAMENT,
    }
  } else if (
    isParticipant &&
    status === (TournamentStatusLabel.PreAuction as string)
  ) {
    actionTheme = {
      bg: COLORS.statusBg.completed,
      color: COLORS.statusTxt.completed,
      txt: TOURNAMENT.STATUS.LEAVE_TOURNAMENT,
    }
  } else if (
    (isHost || isParticipant) &&
    status === (TournamentStatusLabel.InAuction as string)
  ) {
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
