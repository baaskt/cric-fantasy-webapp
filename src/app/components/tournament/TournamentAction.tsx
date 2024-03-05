import React from 'react'
import TournamentAdminActionBtn from './TournamentAdminActionBtn'
import TournamentUserActionBtn from './TournamentUserActionBtn'

type TournamentActionProps = {
  tournamentId: string
  status: string
  isHost: boolean
  isParticipant: boolean
}

function TournamentAction(props: TournamentActionProps) {
  const { isHost, isParticipant, tournamentId, status } = props
  if (isHost)
    return (
      <TournamentAdminActionBtn
        status={status}
        tournamentId={tournamentId}
      ></TournamentAdminActionBtn>
    )
  else
    return (
      <TournamentUserActionBtn
        tournamentId={tournamentId}
        isParticipant={isParticipant}
        status={status}
      ></TournamentUserActionBtn>
    )
}

export default TournamentAction
