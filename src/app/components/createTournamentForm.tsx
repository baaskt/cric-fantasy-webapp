import { Typography } from '@mui/material'
import React, { ChangeEvent, FocusEvent, useState } from 'react'
import CricTextField from './ui/cricTextField'
import { TOURNAMENT } from '@/util/constants/constants'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'
import { getErrorHelperTxt, validateName } from '@/util/helper'

function CreateTournamentForm() {
  const [formData, setFormData] = useState({
    tournamentName: '',
    tournamentStartDate: '',
    tournamentEndDate: '',
    tournamentLocation: '',
    imgUrl: '',
    seriesId: 0,
  })
  const [nameValidity, setNameValidity] = useState<NameValidationEntity>({
    valid: true,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Do something with formData, such as sending it to an API
    console.log(formData)
  }

  const validateTournamentName = (event: FocusEvent<HTMLInputElement>) => {
    const userInput: string = event?.target?.value
    if (userInput) {
      const validityEntity: NameValidationEntity = validateName(userInput)
      setNameValidity(validityEntity)
    }
  }

  return (
    <div>
      <Typography id='modal-modal-title' variant='h6' component='h2'>
        Create Tournament
      </Typography>
      <form onSubmit={handleSubmit} className='m-2 flex gap-2'>
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
        />
        <CricTextField
          type='text'
          id='tournament-location'
          label={TOURNAMENT.CREATE_FORM.LOCATION.label}
          variant='filled'
          name='tournamentLocation'
          onChange={handleChange}
          onBlur={validateTournamentName}
          error={!nameValidity?.valid}
          placeholder={TOURNAMENT.CREATE_FORM.LOCATION.placeholder}
          helperText={getErrorHelperTxt(
            nameValidity,
            TOURNAMENT.CREATE_FORM.LOCATION,
          )}
          inputProps={{ minLength: 5, maxLength: 35 }}
        />
        <CricTextField
          type='text'
          id='signup-name'
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
        />
      </form>
    </div>
  )
}

export default CreateTournamentForm
