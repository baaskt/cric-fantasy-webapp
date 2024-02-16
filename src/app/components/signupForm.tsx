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
import CricAlert from './ui/cricAlert'
import CricTextField from './ui/cricTextField'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { SignupRequest } from '@/model/request/signup-request.type'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')
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
      shakeButton()
    }
    return isFormValid
  }

  const shakeButton = () => {
    setFormValidity(false)
    setTimeout(function () {
      setFormValidity(true)
    }, 500)
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
      } catch (e) {
        console.log(e)
      } finally {
        router.push('/login')
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
        <CricButton
          variant='contained'
          fullWidth
          className={!formValidity ? 'btn_shake' : ''}
          onClick={() => handleSubmit()}
        >
          {signupRequest.isMutating
            ? 'creating account...'
            : AUTH.SIGN_UP.TXT_SIGNUP}
        </CricButton>
      </div>
    </Box>
  )
}
