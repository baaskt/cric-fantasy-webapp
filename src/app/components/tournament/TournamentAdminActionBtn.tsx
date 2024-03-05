import { Button, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { getTournamentActionConfig } from '@/util/helper'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { UpdateTournamentRequest } from '@/model/request/update-tournament-request.type'

type TournamentAdminActionBtnProps = {
  tournamentId: string
  status: string
}

function TournamentAdminActionBtn(props: TournamentAdminActionBtnProps) {
  const { tournamentId, status } = props
  const [isLoading, setIsLoading] = useState<boolean>()
  const actionTheme = getTournamentActionConfig(status)

  const adminActionRequest = useMutateRequest(
    TOURNAMENTS.UPDATE_STATUS_URL,
    HttpMethod.PUT,
  )

  const onAdminAction = () => {
    void updateAdminAction()
  }

  const updateAdminAction = async () => {
    if (!isLoading) {
      setIsLoading(true)
      console.log(actionTheme.txt)
      const payload: UpdateTournamentRequest = {
        tournamentId: tournamentId,
        tournamentStatus: 'Upcoming',
      }
      try {
        const response = await adminActionRequest.trigger(payload as never)
        console.log(response)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }
  }

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
      onClick={onAdminAction}
    >
      <div className='flex flex-row gap-2 items-center'>
        <div>{actionTheme.txt}</div>
        {isLoading && <CircularProgress />}
      </div>
    </Button>
  )
}

export default TournamentAdminActionBtn
