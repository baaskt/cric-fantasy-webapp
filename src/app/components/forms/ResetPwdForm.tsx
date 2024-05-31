'use client'

import React, { FormEvent, FocusEvent, useState } from 'react'
import Box from '@mui/material/Box'
import CricButton from '../ui/CricButton'
import { AUTH } from '@/util/constants/constants'
import { USERS } from '@/util/constants/endpoints'
import CricAlert from '../ui/CricAlert'
import { useMutateRequest } from '@/hooks/useMutateRequest'
import { HttpMethod } from '@/model/enum/http-method.enum'
import { ResetPwdRequest } from '@/model/request/login-request.type'
import { CricResponse } from '@/model/types/cric-response.type'
import { LoginResponse } from '@/model/response/login.interface'
import CricPwdField from '../ui/CricPwdField'
import CricModal from '../ui/CricModal'
import ResetPwdSuccess from '../ResetPwdSuccess'

type ResetPwdFormProps = {
  email: string
}

export default function ResetPwdForm(props: ResetPwdFormProps) {
  const [pwd, setPwd] = useState<string>('')
  const [confirmPwd, setConfirmPwd] = useState<string>('')
  const [resetStatus, setResetStatus] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  const resetPwdRequest = useMutateRequest(USERS.RESET_PWD_URL, HttpMethod.POST)

  const onPwdChange = (event: FocusEvent<HTMLInputElement>) => {
    setResetStatus('')
    const value: string = event.target.value
    setPwd(value)
  }

  const onConfirmPwdChange = (event: FocusEvent<HTMLInputElement>) => {
    setResetStatus('')
    const value: string = event.target.value
    setConfirmPwd(value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void resetPwd()
  }

  const resetPwd = async () => {
    if (pwd === confirmPwd) {
      setResetStatus('')
      const payload: ResetPwdRequest = {
        email: props.email.toLowerCase(),
        password: pwd,
      }
      try {
        const response: CricResponse<LoginResponse> = (await resetPwdRequest.trigger(
          payload as never,
        )) as CricResponse<LoginResponse>
        if (response?.result) {
          setResetStatus('')
          setOpen(true)
        } else {
          setResetStatus('error')
        }
      } catch (e) {
        console.log(e)
        setResetStatus('error')
      }
    } else {
      setResetStatus('error')
    }
  }

  const handleClose = () => {
    // setOpen(false)
  }

  return (
    <>
      <div className='font-bold text-2xl mb-10'>{AUTH.RESET_PWD.label}</div>
      <Box
        component='form'
        className='flex flex-col'
        sx={{
          '& .MuiTextField-root': { mb: 3 },
          width: '100%',
        }}
        noValidate
        autoComplete='on'
        onSubmit={handleSubmit}
      >
        <CricPwdField
          id='reset-password'
          label={AUTH.PASSWORD.label}
          variant='filled'
          autoComplete='current-password'
          placeholder={AUTH.PASSWORD.placeholder}
          onChange={onPwdChange}
          showPwd={true}
        />
        <CricPwdField
          id='reset-confirm-password'
          label={AUTH.RESET_PWD.confirmPwd}
          variant='filled'
          autoComplete='current-password'
          placeholder={AUTH.RESET_PWD.confirmPwd}
          onChange={onConfirmPwdChange}
          validatePwd={true}
        />
        <CricAlert
          error={resetPwdRequest.error || resetStatus === 'error'}
          message={AUTH.RESET_PWD.error}
        ></CricAlert>
        <div className='mt-3'>
          <CricButton
            isFullWidth={true}
            onClick={() => {}}
            btnTxt={resetPwdRequest.isMutating ? 'resetting...' : AUTH.RESET_PWD.reset}
          ></CricButton>
        </div>
        <CricModal open={open} onClose={handleClose} hideClose={true}>
          <ResetPwdSuccess />
        </CricModal>
      </Box>
    </>
  )
}
