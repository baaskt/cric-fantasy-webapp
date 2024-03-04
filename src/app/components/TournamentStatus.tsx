// import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'
// import { COLORS } from '@/util/colors'
import React from 'react'

type TournamentStatusProps = {
  status: string
}
function TournamentStatus(props: TournamentStatusProps) {
  const statusTheme = { bg: '' }

  // switch (props.status) {
  //   case TournamentStatusLabel.Upcoming:
  //     statusTheme = { bg: COLORS.statusBg.upcoming }
  //     break
  // }

  return (
    <div className={`rounded-xl p-2.5 ${'bg-[' + statusTheme?.bg + ']'}`}>
      {props.status}
    </div>
  )
}

export default TournamentStatus
