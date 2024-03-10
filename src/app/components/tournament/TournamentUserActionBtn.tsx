import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'
import { TournamentEntity } from '@/model/response/tournament.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { getTournamentUserActionConfig } from '@/util/helper'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CricButton from '../ui/CricButton'

type TournamentUserActionBtnProps = {
  tournamentData: TournamentEntity
}

function TournamentUserActionBtn(props: TournamentUserActionBtnProps) {
  const { markActiveTournament, updateTournament } = useTournament()
  const router = useRouter()
  const { tournamentId, isParticipant, isHost, tournamentStatus } = props.tournamentData
  const [isLoading, setIsLoading] = useState<boolean>()
  const [actionTheme, setActionTheme] = useState({
    bg: '',
    color: '',
    txt: '',
  })

  useEffect(() => {
    const config = getTournamentUserActionConfig(isParticipant, isHost, tournamentStatus)
    setActionTheme(config)
  }, [isParticipant, isHost, tournamentStatus])

  const joinTournamentRequest = useMutateRequest(
    `${TOURNAMENTS.JOIN_URL}${tournamentId}`,
    HttpMethod.PUT,
  )

  const onUserAction = () => {
    if (tournamentStatus === (TournamentStatusLabel.InAuction as string)) {
      markActiveTournament(props.tournamentData)
      router.push(`${'tournaments'}/${tournamentId}/auction`)
    } else {
      void updateUserAction()
    }
  }

  const mutateTournament = () => {
    const tournamentEntity: TournamentEntity = {
      ...props.tournamentData,
      isParticipant: true,
    }
    updateTournament(tournamentId, tournamentEntity)
    const updatedConfig = getTournamentUserActionConfig(
      tournamentEntity.isParticipant,
      tournamentEntity.isHost,
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
    <CricButton
      bgColor={actionTheme.bg}
      color={actionTheme.color}
      btnTxt={actionTheme?.txt}
      isLoading={isLoading}
      onClick={onUserAction}
    ></CricButton>
  )
}

export default TournamentUserActionBtn
