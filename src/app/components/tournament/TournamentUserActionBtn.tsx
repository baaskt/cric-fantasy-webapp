import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { TournamentEntity } from '@/model/response/tournament.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { getTournamentUserActionConfig } from '@/util/helper'
import { Button, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'

type TournamentUserActionBtnProps = {
  tournamentData: TournamentEntity
}

function TournamentUserActionBtn(props: TournamentUserActionBtnProps) {
  const { updateTournament } = useTournament()
  const { tournamentId, isParticipant, tournamentStatus } = props.tournamentData
  const [isLoading, setIsLoading] = useState<boolean>()
  const [actionTheme, setActionTheme] = useState({
    bg: '',
    color: '',
    txt: '',
  })

  useEffect(() => {
    const config = getTournamentUserActionConfig(
      isParticipant,
      tournamentStatus,
    )
    setActionTheme(config)
  }, [isParticipant, tournamentStatus])

  const joinTournamentRequest = useMutateRequest(
    `${TOURNAMENTS.JOIN_URL}/${tournamentId}`,
    HttpMethod.PUT,
  )

  const onUserAction = () => {
    void updateUserAction()
  }

  const mutateTournament = () => {
    const tournamentEntity: TournamentEntity = {
      ...props.tournamentData,
      isParticipant: true,
    }
    updateTournament(tournamentId, tournamentEntity)
    const updatedConfig = getTournamentUserActionConfig(
      tournamentEntity.isParticipant,
      tournamentStatus,
    )
    setActionTheme(updatedConfig)
  }

  const updateUserAction = async () => {
    if (!isLoading) {
      setIsLoading(true)
      try {
        await joinTournamentRequest.trigger()
        mutateTournament()
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!actionTheme.txt) return <></>

  return (
    <Button
      variant='contained'
      sx={{
        backgroundColor: actionTheme.bg,
        color: actionTheme.color,
        textTransform: 'capitalize',
        fontSize: 18,
        '&:hover': {
          backgroundColor: actionTheme.bg,
        },
      }}
      onClick={onUserAction}
    >
      <div className='flex flex-row gap-2 items-center'>
        <div>{actionTheme?.txt}</div>
        {isLoading && <CircularProgress />}
      </div>
    </Button>
  )
}

export default TournamentUserActionBtn
