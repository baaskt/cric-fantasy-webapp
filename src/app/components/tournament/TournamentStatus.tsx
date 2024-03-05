import { getTournamentStatusConfig } from '@/util/helper'
import React from 'react'

type TournamentStatusProps = {
  status: string
}

function TournamentStatus(props: TournamentStatusProps) {
  const { status } = props
  const statusTheme = getTournamentStatusConfig(status)

  return (
    <div
      className={`self-end text-sm rounded-xl p-2.5 w-fit`}
      style={{ backgroundColor: statusTheme?.bg, color: statusTheme.color }}
    >
      {props.status}
    </div>
  )
}

export default TournamentStatus
