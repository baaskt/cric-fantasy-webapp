'use client'

import React, { FocusEvent, useState } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from './ui/cricPwdField'
import CricEmailField from './ui/cricEmailField'
import CricButton from './ui/cricButton'
import { AUTH } from '@/util/constants'
import {
  getNameErrorHelperTxt,
  validateEmail,
  validateName,
  validatePassword,
} from '@/util/helper'
import { useAuth } from '@/providers/AuthProvider'
import { SIGNUP_URL } from '@/util/endpoints'
import useSWRMutation from 'swr/mutation'
import { apiHelper } from '@/lib/apiHelper'
import CricAlert from './ui/cricAlert'
import CricTextField from './ui/cricTextField'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'

export default function SignupForm() {
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')
  const [nameValidity, setNameValidity] = useState<NameValidationEntity>({
    valid: true,
  })

  const { signup } = useAuth()
  const signupRequest = useSWRMutation<unknown, Error>(
    SIGNUP_URL,
    apiHelper().POST,
  )

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

  const signupUser = async () => {
    if (
      validateName(fullName) &&
      validateEmail(email) &&
      validatePassword(pwd)
    ) {
      const payload = {
        fullName: fullName,
        username: email,
        password: pwd,
      }
      console.log(payload)
      try {
        const response = await signupRequest.trigger(payload)
        console.log(response)
        signup({ name: fullName, email: email })
      } catch (e) {
        console.log(e)
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
        label={AUTH.NAME.LABEL}
        variant='filled'
        onChange={onNameChange}
        onBlur={validateFullName}
        error={!nameValidity?.valid}
        placeholder={AUTH.NAME.PLACEHOLDER}
        helperText={getNameErrorHelperTxt(nameValidity)}
        inputProps={{ minLength: 5, maxLength: 35 }}
      />
      <CricEmailField
        id='signup-email'
        label={AUTH.EMAIL.LABEL}
        variant='filled'
        placeholder={AUTH.EMAIL.PLACEHOLDER}
        helperText={AUTH.EMAIL.ERROR}
        onChange={onEmailChange}
      />
      <CricPwdField
        id='signup-password'
        label={AUTH.PASSWORD.LABEL}
        variant='filled'
        autoComplete='current-password'
        placeholder={AUTH.PASSWORD.PLACEHOLDER}
        validatePwd={true}
        onChange={onPwdChange}
      />
      <CricAlert
        error={signupRequest.error}
        message={AUTH.SIGN_UP.ERROR}
      ></CricAlert>
      <div className='mt-3'>
        <CricButton variant='contained' onClick={() => handleSubmit()}>
          {signupRequest.isMutating
            ? 'creating account...'
            : AUTH.SIGN_UP.TXT_SIGNUP}
        </CricButton>
      </div>
    </Box>
  )
}
