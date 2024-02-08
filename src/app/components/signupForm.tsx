'use client'

import React, { FocusEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from './ui/cricPwdField'
import CricEmailField from './ui/cricEmailField'
import CricButton from './ui/cricButton'
import { AUTH } from '@/util/constants'
import { validateEmail, validateName, validatePassword } from '@/util/helper'
import { useAuth } from '@/providers/AuthProvider'
import { SIGNUP_URL } from '@/util/endpoints'
import useSWRMutation from 'swr/mutation'
import { apiHelper } from '@/lib/apiHelper'
import CricAlert from './ui/cricAlert'
import CricTextField from './ui/cricTextField'

export default function SignupForm() {
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')
  const [isNameValid, setNameValidity] = useState<boolean>(true)

  const { signup } = useAuth()
  const { data, error, isMutating, trigger } = useSWRMutation<unknown, Error>(
    SIGNUP_URL,
    apiHelper().POST,
  )

  useEffect(() => {
    redirectSignup()
  }, [data])

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
      await trigger()
      signup({ email: email })
    }
  }

  const redirectSignup = () => {
    //reidrect
  }

  const validateFullName = (event: FocusEvent<HTMLInputElement>) => {
    const userInput: string = event?.target?.value
    if (userInput) {
      const isValidName: boolean = validateName(userInput)
      setNameValidity(isValidName)
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
        error={!isNameValid}
        placeholder={AUTH.NAME.PLACEHOLDER}
        helperText={!isNameValid ? AUTH.NAME.ERROR : ''}
        inputProps={{ maxLength: 35 }}
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
        error={error}
        message='Incorrect username / password'
      ></CricAlert>
      <div className='mt-3'>
        <CricButton variant='contained' onClick={() => handleSubmit()}>
          {isMutating ? 'creating account...' : AUTH.SIGN_UP.TXT_SIGNUP}
        </CricButton>
      </div>
    </Box>
  )
}
