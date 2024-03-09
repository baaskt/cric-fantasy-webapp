import { Typography } from '@mui/material'
import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react'
import CricTextField from '../ui/CricTextField'
import { TEAM } from '@/util/constants/constants'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'
import { getErrorHelperTxt, validateName } from '@/util/validation'
import CricButton from '../ui/CricButton'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import CricAlert from '../ui/CricAlert'
import { TEAMS, TOURNAMENTS } from '@/util/constants/endpoints'
import { useTournament } from '@/providers/TournamentProvider'
import { CricResponse } from '@/model/types/cric-response.type'
import { CreateTeamRequest } from '@/model/request/create-team-request.type'
import { CreateTeamResponse } from '@/model/response/create-team-response.interface'
import CricMultiSelect from '../ui/CricMultiSelect'
import { useRequest } from '@/hooks/useRequest'
import { OptionsEntity } from '@/model/entities/options.interface'
import { GetParticipantsResponse } from '@/model/response/get-participants-response.interface'

type CreateTeamFormProps = {
  onCreate: () => void
}

function CreateTeamForm(props: CreateTeamFormProps) {
  const { activeTournament } = useTournament()
  const [formData, setFormData] = useState<CreateTeamRequest>({
    teamName: '',
    teamMembers: [],
    tournamentId: activeTournament?.tournamentId || '',
  })
  const [nameValidity, setNameValidity] = useState<NameValidationEntity>({
    valid: true,
  })

  const [participants, setParticipants] = useState<OptionsEntity[]>([])
  const [mandatoryError, setMandatoryError] = useState<boolean>(false)

  const PARTICIPANTS_URL = `${TOURNAMENTS.GET_PARTICIPANTS}${activeTournament?.tournamentId}`
  const getParticipantsRequest = useRequest(PARTICIPANTS_URL)
  const getParticipantsResponse: CricResponse<GetParticipantsResponse[]> =
    getParticipantsRequest.data as CricResponse<GetParticipantsResponse[]>

  const createTeamRequest = useMutateRequest(TEAMS.CREATE_TEAM_URL, HttpMethod.POST)

  useEffect(() => {
    const response = getParticipantsResponse?.result
    if (response) {
      const participantsList: OptionsEntity[] = []
      response.forEach(data => {
        const tempParticipant: OptionsEntity = {
          id: data.userId,
          label: data.name,
          value: data.name,
        }
        participantsList.push(tempParticipant)
      })
      setParticipants(participantsList)
    }
  }, [getParticipantsResponse?.result])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const onParticipantsSelect = (selectedValues: OptionsEntity[]) => {
    if (selectedValues?.length) {
      const participantIds: string[] = selectedValues.map(data => data.id) as string[]
      setFormData(prevData => ({
        ...prevData,
        teamMembers: participantIds,
      }))
    }
  }

  const handleSubmit = () => {
    void createTeam()
  }

  //   const mutateTeam = (payload: CreateTeamRequest, teamId: string) => {
  //     const teamEntity: TeamEntity = {
  //       ...payload,
  //       teamId: teamId,
  //     }
  //   }

  const createTeam = async () => {
    if (formData.teamName && nameValidity?.valid) {
      const payload: CreateTeamRequest = {
        ...formData,
        tournamentId: activeTournament?.tournamentId || '',
      }
      try {
        const response: CricResponse<CreateTeamResponse> = (await createTeamRequest.trigger(
          payload as never,
        )) as CricResponse<CreateTeamResponse>
        if (response.result) {
          //   mutateTeam(payload, response.result?.teamId)
          props.onCreate()
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      setFormError()
    }
  }

  const setFormError = () => {
    setMandatoryError(true)
    setTimeout(function () {
      setMandatoryError(false)
    }, 3000)
  }

  const validateTeamName = (event: FocusEvent<HTMLInputElement>) => {
    const userInput: string = event?.target?.value
    if (userInput) {
      const validityEntity: NameValidationEntity = validateName(userInput, true)
      setNameValidity(validityEntity)
    }
  }

  return (
    <div>
      <Typography id='modal-modal-title' variant='h6' component='h2'>
        Create Team
      </Typography>
      <form className='mt-5 flex flex-col gap-4 self-center'>
        <CricTextField
          type='text'
          id='team-name'
          label={TEAM.CREATE_FORM.NAME.label}
          variant='filled'
          name='teamName'
          onChange={handleChange}
          onBlur={validateTeamName}
          error={!nameValidity?.valid}
          placeholder={TEAM.CREATE_FORM.NAME.placeholder}
          helperText={getErrorHelperTxt(nameValidity, TEAM.CREATE_FORM.NAME)}
          inputProps={{ minLength: 5, maxLength: 35 }}
          required
        />
        <CricMultiSelect label='' menuList={participants} onChange={onParticipantsSelect} />
        <CricAlert
          error={createTeamRequest.error || mandatoryError}
          message={mandatoryError ? TEAM.CREATE_FORM.mandatory : TEAM.CREATE_FORM.error}
        ></CricAlert>
        <div className='mt-3'>
          <CricButton
            isFullWidth={true}
            isValid={createTeamRequest.error || !nameValidity?.valid ? false : true}
            onClick={() => handleSubmit()}
            btnTxt={createTeamRequest.isMutating ? TEAM.CREATING : TEAM.CREATE}
          ></CricButton>
        </div>
      </form>
    </div>
  )
}

export default CreateTeamForm
