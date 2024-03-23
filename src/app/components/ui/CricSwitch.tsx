import { COLORS } from '@/util/colors'
import { Switch, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? COLORS.cricPrimary : COLORS.cricPrimary,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}))

type CricSwitchProps = {
  disabled: boolean
  isChecked: boolean
  onChange: (isToggled: boolean) => void
}

function CricSwitch(props: CricSwitchProps) {
  const { disabled, onChange } = props
  const [isChecked, setChecked] = useState(props.isChecked)

  useEffect(() => {
    setChecked(props.isChecked)
  }, [props.isChecked])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked)
    setChecked(event.target.checked)
  }

  return (
    <StyledSwitch checked={isChecked} disabled={disabled} onChange={handleChange}></StyledSwitch>
  )
}

export default CricSwitch
