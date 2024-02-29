import { Typography } from '@mui/material'
import React, { ChangeEvent, FocusEvent, useState } from 'react'
import CricTextField from './ui/CricTextField'
import { TOURNAMENT } from '@/util/constants/constants'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'
import { getErrorHelperTxt, validateName } from '@/util/helper'
import CricDateRangePicker from './ui/CricDateRangePicker'
import { CricDateRangeType } from '@/model/types/date-range.type'
import { TournamentStatus } from '@/model/enum/tournament-status.enum'
import CricFileInput from './ui/CricFileInput'
import CricButton from './ui/CricButton'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { TOURNAMENT_URL } from '@/util/constants/endpoints'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { CreateTournamentRequest } from '@/model/request/create-tournament-request.type'
import CricAlert from './ui/CricAlert'

type CreateTournamentResult = {
  result: string
}

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
    tournamentStatus: TournamentStatus.Upcoming,
    seriesId: 0,
  })

  const [nameValidity, setNameValidity] = useState<NameValidationEntity>({
    valid: true,
  })

  const [mandatoryError, setMandatoryError] = useState<boolean>(false)

  const createTournamentRequest = useMutateRequest(
    TOURNAMENT_URL,
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

  const createTournament = async () => {
    if (formData.tournamentName && nameValidity?.valid) {
      const payload: CreateTournamentRequest = {
        ...formData,
        userId: '',
        seriesId: Number(formData.seriesId),
      }
      try {
        const response: CreateTournamentResult =
          (await createTournamentRequest.trigger(
            payload as never,
          )) as CreateTournamentResult
        console.log(response)
      } catch (e) {
        console.log(e)
      } finally {
        props.onCreate()
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
        <CricFileInput btnName={'Upload Image'} />
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
