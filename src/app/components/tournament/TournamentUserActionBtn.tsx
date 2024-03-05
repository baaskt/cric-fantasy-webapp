import React from 'react'

type TournamentUserActionBtnProps = {
  tournamentId: string
  status: string
  isParticipant: boolean
}

function TournamentUserActionBtn(props: TournamentUserActionBtnProps) {
  const { isParticipant, status } = props
  return <div>{isParticipant + status}</div>
}

export default TournamentUserActionBtn
