'use client'
import useMobile from '@/hooks/useMobile'
import { useTournament } from '@/providers/TournamentProvider'
import React from 'react'
import CricButton from '../ui/CricButton'
import { TEAMS } from '@/util/constants/endpoints'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { CricResponse } from '@/model/types/cric-response.type'

function ResetSpin() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const isMobileView = useMobile()

  const spinEnableRequest = useMutateRequest(TEAMS.ENABLE_SPIN, HttpMethod.PUT)

  const handleSpinEnable = () => {
    void enableSpin()
  }

  const enableSpin = async () => {
    const payload = {
      tournamentId: tournamentId,
    }
    try {
      const response: CricResponse<string> = (await spinEnableRequest.trigger(
        payload as never,
      )) as CricResponse<string>
      const responseData: string | null = response?.result ? response.result : null
      console.log(responseData)
    } catch (e) {
      console.log(e)
    }
  }

  if (!(activeTournament?.isHost && isMobileView)) return <></>

  return (
    <div className='flex justify-center p-4'>
      <CricButton
        onClick={handleSpinEnable}
        btnTxt={'Enable Spin'}
        isLoading={spinEnableRequest.isMutating}
      ></CricButton>
    </div>
  )
}

export default ResetSpin
