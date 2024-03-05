import { Typography } from '@mui/material'
import React, { ChangeEvent, FocusEvent, useState } from 'react'
import CricTextField from '../ui/CricTextField'
import { TOURNAMENT } from '@/util/constants/constants'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'
import { getErrorHelperTxt, validateName } from '@/util/validation'
import CricDateRangePicker from '../ui/CricDateRangePicker'
import { CricDateRangeType } from '@/model/types/date-range.type'
// import CricFileInput from './ui/CricFileInput'
import CricButton from '../ui/CricButton'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { CreateTournamentRequest } from '@/model/request/create-tournament-request.type'
import CricAlert from '../ui/CricAlert'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { useTournament } from '@/providers/TournamentProvider'
import { TournamentEntity } from '@/model/response/tournament.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { CreateTournamentResponse } from '@/model/response/create-tournament-response.interface'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'

type CreateTournamentFormProps = {
  onCreate: () => void
}

function CreateTournamentForm(props: CreateTournamentFormProps) {
  const [formData, setFormData] = useState({
    tournamentName: '',
    tournamentStartDate: '',
    tournamentEndDate: '',
    tournamentLocation: '',
    imgUrl: '',
    seriesId: 0,
  })

  const { addTournament } = useTournament()

  const [nameValidity, setNameValidity] = useState<NameValidationEntity>({
    valid: true,
  })

  const [mandatoryError, setMandatoryError] = useState<boolean>(false)

  const createTournamentRequest = useMutateRequest(
    TOURNAMENTS.CREATE_URL,
    HttpMethod.POST,
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const onDateRangeChange = (dateRange: CricDateRangeType) => {
    setFormData(prevData => ({
      ...prevData,
      tournamentStartDate: dateRange.startDate,
      tournamentEndDate: dateRange.endDate,
    }))
  }

  const handleSubmit = () => {
    void createTournament()
  }

  const mutateTournament = (
    payload: CreateTournamentRequest,
    tournamentId: string,
  ) => {
    const tournamentEntity: TournamentEntity = {
      ...payload,
      tournamentId: tournamentId,
      tournamentStatus: TournamentStatusLabel.Upcoming,
      isHost: true,
      isParticipant: false,
    }
    addTournament(tournamentEntity)
  }

  const createTournament = async () => {
    if (formData.tournamentName && nameValidity?.valid) {
      const payload: CreateTournamentRequest = {
        ...formData,
        seriesId: Number(formData.seriesId),
      }
      try {
        const response: CricResponse<CreateTournamentResponse> =
          (await createTournamentRequest.trigger(
            payload as never,
          )) as CricResponse<CreateTournamentResponse>
        if (response.result?.tournamentId) {
          mutateTournament(payload, response.result?.tournamentId)
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

  const validateTournamentName = (event: FocusEvent<HTMLInputElement>) => {
    const userInput: string = event?.target?.value
    if (userInput) {
      const validityEntity: NameValidationEntity = validateName(userInput, true)
      setNameValidity(validityEntity)
    }
  }

  return (
    <div>
      <Typography id='modal-modal-title' variant='h6' component='h2'>
        Create Tournament
      </Typography>
      <form className='mt-5 flex flex-col gap-4 self-center'>
        <CricTextField
          type='text'
          id='tournament-name'
          label={TOURNAMENT.CREATE_FORM.NAME.label}
          variant='filled'
          name='tournamentName'
          onChange={handleChange}
          onBlur={validateTournamentName}
          error={!nameValidity?.valid}
          placeholder={TOURNAMENT.CREATE_FORM.NAME.placeholder}
          helperText={getErrorHelperTxt(
            nameValidity,
            TOURNAMENT.CREATE_FORM.NAME,
          )}
          inputProps={{ minLength: 5, maxLength: 35 }}
          required
        />
        <CricTextField
          type='number'
          id='tournament-series-id'
          label={TOURNAMENT.CREATE_FORM.SERIES_ID.label}
          variant='filled'
          name='seriesId'
          onChange={handleChange}
          error={!nameValidity?.valid}
          placeholder={TOURNAMENT.CREATE_FORM.SERIES_ID.placeholder}
          inputProps={{ minLength: 5, maxLength: 35 }}
          required
        />
        <CricTextField
          type='text'
          id='tournament-location'
          label={TOURNAMENT.CREATE_FORM.LOCATION.label}
          variant='filled'
          name='tournamentLocation'
          onChange={handleChange}
          error={!nameValidity?.valid}
          placeholder={TOURNAMENT.CREATE_FORM.LOCATION.placeholder}
          inputProps={{ minLength: 5, maxLength: 35 }}
        />
        <CricDateRangePicker onDateChange={onDateRangeChange} />
        <CricTextField
          type='text'
          id='img-url'
          label={TOURNAMENT.CREATE_FORM.IMAGE.label}
          variant='filled'
          name='imgUrl'
          onChange={handleChange}
          placeholder={TOURNAMENT.CREATE_FORM.IMAGE.placeholder}
          inputProps={{ minLength: 5, maxLength: 35 }}
        />
        {/* <CricFileInput btnName={'Upload Image'} /> */}
        <CricAlert
          error={createTournamentRequest.error || mandatoryError}
          message={
            mandatoryError
              ? TOURNAMENT.CREATE_FORM.mandatory
              : TOURNAMENT.CREATE_FORM.error
          }
        ></CricAlert>
        <div className='mt-3'>
          <CricButton
            isFullWidth={true}
            isValid={
              createTournamentRequest.error || !nameValidity?.valid
                ? false
                : true
            }
            onClick={() => handleSubmit()}
            btnTxt={
              createTournamentRequest.isMutating
                ? TOURNAMENT.CREATING
                : TOURNAMENT.CREATE
            }
          ></CricButton>
        </div>
      </form>
    </div>
  )
}

export default CreateTournamentForm
