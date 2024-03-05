import { Button, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { getTournamentAdminActionConfig } from '@/util/helper'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { UpdateTournamentRequest } from '@/model/request/update-tournament-request.type'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'
import { TournamentEntity } from '@/model/response/tournament.interface'
import { useTournament } from '@/providers/TournamentProvider'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

type TournamentAdminActionBtnProps = {
  tournamentData: TournamentEntity
}

function TournamentAdminActionBtn(props: TournamentAdminActionBtnProps) {
  const { updateTournament } = useTournament()
  const { tournamentId, tournamentStatus } = props.tournamentData
  const [isLoading, setIsLoading] = useState<boolean>()
  const config = getTournamentAdminActionConfig(tournamentStatus)
  const [actionTheme, setActionTheme] = useState(config)

  const adminActionRequest = useMutateRequest(
    TOURNAMENTS.UPDATE_STATUS_URL,
    HttpMethod.PUT,
  )

  const onAdminAction = () => {
    void updateAdminAction()
  }

  const getAdminStatus = () => {
    if (tournamentStatus === (TournamentStatusLabel.Upcoming as string))
      return TournamentStatusLabel.PreAuction
    else if (tournamentStatus === (TournamentStatusLabel.PreAuction as string))
      return TournamentStatusLabel.InAuction
    else if (tournamentStatus === (TournamentStatusLabel.InAuction as string))
      return TournamentStatusLabel.InProgress
    else if (tournamentStatus === (TournamentStatusLabel.InProgress as string))
      return TournamentStatusLabel.Completed
    else return ''
  }

  const mutateTournament = (status: string) => {
    const tournamentEntity: TournamentEntity = {
      ...props.tournamentData,
      tournamentStatus: status,
    }
    updateTournament(tournamentId, tournamentEntity)
    const updatedConfig = getTournamentAdminActionConfig(status)
    setActionTheme(updatedConfig)
  }

  const updateAdminAction = async () => {
    if (!isLoading) {
      setIsLoading(true)
      const payload: UpdateTournamentRequest = {
        tournamentId: tournamentId,
        tournamentStatus: getAdminStatus(),
      }
      try {
        await adminActionRequest.trigger(payload as never)
        mutateTournament(payload.tournamentStatus)
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
      startIcon={<AdminPanelSettingsIcon />}
      sx={{
        backgroundColor: actionTheme.bg,
        color: actionTheme.color,
        textTransform: 'capitalize',
        fontSize: 18,
        '&:hover': {
          backgroundColor: actionTheme.bg,
        },
      }}
      onClick={onAdminAction}
    >
      <div className='flex flex-row gap-2 items-center'>
        <div>{actionTheme?.txt}</div>
        {isLoading && <CircularProgress />}
      </div>
    </Button>
  )
}

export default TournamentAdminActionBtn
