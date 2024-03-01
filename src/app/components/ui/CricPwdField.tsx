import React, { FocusEvent, useState, ComponentProps } from 'react'
import TextField from '@mui/material/TextField'
import CricTextField from './CricTextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { validatePassword } from '@/util/helper'
import PwdChecklist from '../PwdChecklist'

type CricPwdProps = ComponentProps<typeof TextField> & {
  validatePwd?: boolean
}

export default function CricPwdField({ validatePwd, ...props }: CricPwdProps) {
  const [pwd, setPwd] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isPwdValid, setPwdValidity] = useState<boolean>(true)

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const onPwdChange = (event: FocusEvent<HTMLInputElement>) => {
    setPwdValidity(true)
    setPwd(event.target.value)
    props.onChange && props.onChange(event)
  }

  const validateUserPassword = (event: FocusEvent<HTMLInputElement>) => {
    //Validate only for signup screen and not for login screen
    if (validatePwd) {
      const userInput: string = event?.target?.value
      if (userInput) {
        const isValidPwd: boolean = validatePassword(userInput)
        setPwdValidity(isValidPwd)
      }
    }
  }

  return (
    <>
      <CricTextField
        {...props}
        type={showPassword ? 'text' : 'password'}
        onChange={onPwdChange}
        error={!isPwdValid}
        onBlur={validateUserPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {!isPwdValid && <PwdChecklist value={pwd} />}
    </>
  )
}
