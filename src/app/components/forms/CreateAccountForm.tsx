'use client'

import React, { FormEvent, FocusEvent, useState } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from '../ui/CricPwdField'
import CricButton from '../ui/CricButton'
import { AUTH, TITLES } from '@/util/constants/constants'
import { getErrorHelperTxt, validateName, validatePassword } from '@/util/validation'
import { useAuth } from '@/providers/AuthProvider'
import { USERS } from '@/util/constants/endpoints'
import CricAlert from '../ui/CricAlert'
import CricTextField from '../ui/CricTextField'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { SignupRequest } from '@/model/request/signup-request.type'
import { AxiosError } from 'axios'
import { CricResponse } from '@/model/types/cric-response.type'
import CricModal from '../ui/CricModal'
import CreateAccountSuccess from '../CreateAccountSuccess'

type CreateAccountProps = {
  email: string
}

export default function CreateAccountForm(props: CreateAccountProps) {
  const [fullName, setFullName] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [formValidity, setFormValidity] = useState<boolean>(true)
  const [nameValidity, setNameValidity] = useState<NameValidationEntity>({
    valid: true,
  })
  const [open, setOpen] = useState<boolean>(false)

  const { signup } = useAuth()
  const signupRequest = useMutateRequest(USERS.SIGNUP_URL, HttpMethod.POST)

  const onNameChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setFullName(value)
  }

  const onPwdChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setPwd(value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void signupUser()
  }

  const isValidForm = () => {
    const isFormValid = validateName(fullName) && validatePassword(pwd)
    if (!isFormValid) {
      setFormValidity(false)
    }
    return isFormValid
  }

  const signupUser = async () => {
    if (isValidForm()) {
      const payload: SignupRequest = {
        fullName: fullName,
        email: props.email.toLowerCase(),
        password: pwd,
      }
      try {
        await signupRequest.trigger(payload as never)
        signup(fullName, props.email.toLowerCase())
        setOpen(true)
      } catch (error) {
        const axiosError = error as AxiosError
        const errorResult: CricResponse<string> = axiosError.response?.data as CricResponse<string>
        setError(errorResult?.error ? errorResult?.error : '')
      }
    }
  }

  const validateFullName = (event: FocusEvent<HTMLInputElement>) => {
    const userInput: string = event?.target?.value
    if (userInput) {
      const validityEntity: NameValidationEntity = validateName(userInput)
      setNameValidity(validityEntity)
    }
  }

  return (
    <>
      <div className='font-bold text-2xl mb-10'>{TITLES.SIGNUP.label}</div>
      <Box
        component='form'
        className='flex flex-col'
        sx={{
          '& .MuiTextField-root': { mb: 3 },
          width: '100%',
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <CricTextField
          type='text'
          id='signup-name'
          label={AUTH.NAME.label}
          variant='filled'
          onChange={onNameChange}
          onBlur={validateFullName}
          error={!nameValidity?.valid}
          placeholder={AUTH.NAME.placeholder}
          helperText={getErrorHelperTxt(nameValidity, AUTH.NAME)}
          inputProps={{ minLength: 5, maxLength: 35 }}
        />
        <CricPwdField
          id='signup-password'
          label={AUTH.PASSWORD.label}
          variant='filled'
          placeholder={AUTH.PASSWORD.placeholder}
          validatePwd={true}
          onChange={onPwdChange}
        />
        <CricAlert
          error={error || signupRequest.error}
          message={error ? error : AUTH.SIGN_UP.error}
        ></CricAlert>
        <div className='mt-3'>
          <CricButton
            isFullWidth={true}
            isValid={formValidity}
            onClick={() => {}}
            btnTxt={signupRequest.isMutating ? 'creating account...' : AUTH.SIGN_UP.txtSignup}
          ></CricButton>
        </div>
        <CricModal open={open} hideClose={true}>
          <CreateAccountSuccess />
        </CricModal>
      </Box>
    </>
  )
}
