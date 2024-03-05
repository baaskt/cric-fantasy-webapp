import React from 'react'
import TournamentAdminActionBtn from './TournamentAdminActionBtn'
import TournamentUserActionBtn from './TournamentUserActionBtn'
import { TournamentEntity } from '@/model/response/tournament.interface'

type TournamentActionProps = {
  tournamentData: TournamentEntity
}

function TournamentAction(props: TournamentActionProps) {
  const { isHost } = props.tournamentData
  if (isHost)
    return (
      <TournamentAdminActionBtn
        tournamentData={props.tournamentData}
      ></TournamentAdminActionBtn>
    )
  else
    return (
      <TournamentUserActionBtn
        tournamentData={props.tournamentData}
      ></TournamentUserActionBtn>
    )
}

export default TournamentAction
