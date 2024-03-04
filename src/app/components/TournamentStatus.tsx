import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'
import { COLORS } from '@/util/colors'
import React from 'react'

type TournamentStatusProps = {
  status: string
}
function TournamentStatus(props: TournamentStatusProps) {
  const defaultTheme = { bg: COLORS.statusBg.upcoming, txt: COLORS.white }
  let statusTheme = defaultTheme

  if (props.status === (TournamentStatusLabel.Upcoming as string))
    statusTheme = { bg: COLORS.statusBg.upcoming, txt: COLORS.white }
  else if (props.status === (TournamentStatusLabel.PreAuction as string))
    statusTheme = {
      bg: COLORS.statusBg.preauction,
      txt: COLORS.statusTxt.preauction,
    }
  else if (props.status === (TournamentStatusLabel.InAuction as string))
    statusTheme = {
      bg: COLORS.statusBg.inauction,
      txt: COLORS.statusTxt.inauction,
    }
  else if (props.status === (TournamentStatusLabel.InProgress as string))
    statusTheme = {
      bg: COLORS.statusBg.inprogress,
      txt: COLORS.statusTxt.inprogress,
    }
  else if (props.status === (TournamentStatusLabel.Completed as string))
    statusTheme = {
      bg: COLORS.statusBg.completed,
      txt: COLORS.statusTxt.completed,
    }

  return (
    <div
      className={`rounded-xl p-2.5`}
      style={{ backgroundColor: statusTheme?.bg, color: statusTheme.txt }}
    >
      {props.status}
    </div>
  )
}

export default TournamentStatus
