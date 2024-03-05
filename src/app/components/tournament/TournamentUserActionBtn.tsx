import { TournamentEntity } from '@/model/response/tournament.interface'
import React from 'react'

type TournamentUserActionBtnProps = {
  tournamentData: TournamentEntity
}

function TournamentUserActionBtn(props: TournamentUserActionBtnProps) {
  const { isParticipant, tournamentStatus } = props.tournamentData
  return <div>{isParticipant + tournamentStatus}</div>
}

export default TournamentUserActionBtn
