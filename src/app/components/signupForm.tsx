'use client'

import React, { FocusEvent, useState } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from './ui/CricPwdField'
import CricEmailField from './ui/CricEmailField'
import CricButton from './ui/CricButton'
import { AUTH } from '@/util/constants/constants'
import {
  getErrorHelperTxt,
  validateEmail,
  validateName,
  validatePassword,
} from '@/util/helper'
import { useAuth } from '@/providers/AuthProvider'
import { SIGNUP_URL } from '@/util/constants/endpoints'
import CricAlert from './ui/CricAlert'
import CricTextField from './ui/CricTextField'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { SignupRequest } from '@/model/request/signup-request.type'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { CricResponse } from '@/model/types/cric-response.type'

export default function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [formValidity, setFormValidity] = useState<boolean>(true)
  const [nameValidity, setNameValidity] = useState<NameValidationEntity>({
    valid: true,
  })

  const { signup } = useAuth()
  const signupRequest = useMutateRequest(SIGNUP_URL, HttpMethod.POST)

  const onNameChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setFullName(value)
  }

  const onEmailChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setEmail(value)
  }

  const onPwdChange = (event: FocusEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    setPwd(value)
  }

  const handleSubmit = () => {
    void signupUser()
  }

  const isValidForm = () => {
    const isFormValid =
      validateName(fullName) && validateEmail(email) && validatePassword(pwd)
    if (!isFormValid) {
      setFormValidity(false)
    }
    return isFormValid
  }

  const signupUser = async () => {
    if (isValidForm()) {
      const payload: SignupRequest = {
        fullName: fullName,
        email: email,
        password: pwd,
      }
      try {
        await signupRequest.trigger(payload as never)
        signup({ name: fullName, email: email })
        router.push('/login')
      } catch (error) {
        const axiosError = error as AxiosError
        const errorResult: CricResponse<string> = axiosError.response
          ?.data as CricResponse<string>
        console.log(errorResult)
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
    <Box
      component='form'
      className='flex flex-col'
      sx={{
        '& .MuiTextField-root': { mb: 3 },
        width: '100%',
      }}
      noValidate
      autoComplete='off'
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
      <CricEmailField
        id='signup-email'
        label={AUTH.EMAIL.label}
        variant='filled'
        placeholder={AUTH.EMAIL.placeholder}
        helperText={AUTH.EMAIL.error}
        onChange={onEmailChange}
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
          onClick={() => handleSubmit()}
          btnTxt={
            signupRequest.isMutating
              ? 'creating account...'
              : AUTH.SIGN_UP.txtSignup
          }
        ></CricButton>
      </div>
    </Box>
  )
}
