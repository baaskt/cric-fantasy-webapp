'use client'

import React, { FormEvent, FocusEvent, useState } from 'react'
import Box from '@mui/material/Box'
import CricPwdField from '../ui/CricPwdField'
import CricEmailField from '../ui/CricEmailField'
import CricButton from '../ui/CricButton'
import { AUTH, TITLES } from '@/util/constants/constants'
import { getErrorHelperTxt, validateEmail, validateName, validatePassword } from '@/util/validation'
import { useAuth } from '@/providers/AuthProvider'
import { USERS } from '@/util/constants/endpoints'
import CricAlert from '../ui/CricAlert'
import CricTextField from '../ui/CricTextField'
import { NameValidationEntity } from '@/model/entities/name-validation.interface'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { SignupRequest } from '@/model/request/signup-request.type'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { CricResponse } from '@/model/types/cric-response.type'
import CricToast from '../ui/CricToast'

export default function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [pwd, setPwd] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isSignupSuccess, setSignupSuccess] = useState<boolean>(false)
  const [formValidity, setFormValidity] = useState<boolean>(true)
  const [nameValidity, setNameValidity] = useState<NameValidationEntity>({
    valid: true,
  })

  const { signup } = useAuth()
  const signupRequest = useMutateRequest(USERS.SIGNUP_URL, HttpMethod.POST)

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void signupUser()
  }

  const isValidForm = () => {
    const isFormValid = validateName(fullName) && validateEmail(email) && validatePassword(pwd)
    if (!isFormValid) {
      setFormValidity(false)
    }
    return isFormValid
  }

  const signupUser = async () => {
    setSignupSuccess(false)
    if (isValidForm()) {
      const payload: SignupRequest = {
        fullName: fullName,
        email: email,
        password: pwd,
      }
      try {
        await signupRequest.trigger(payload as never)
        signup(fullName, email)
        setSignupSuccess(true)
        setTimeout(() => {
          router.push(TITLES.SIGNIN.path)
        }, 2000)
      } catch (error) {
        const axiosError = error as AxiosError
        const errorResult: CricResponse<string> = axiosError.response?.data as CricResponse<string>
        setError(errorResult?.error ? errorResult?.error : '')
        setSignupSuccess(false)
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
          onClick={() => {}}
          btnTxt={signupRequest.isMutating ? 'creating account...' : AUTH.SIGN_UP.txtSignup}
        ></CricButton>
      </div>
      <CricToast open={isSignupSuccess} message='Account Created, please login to continue...' />
    </Box>
  )
}
