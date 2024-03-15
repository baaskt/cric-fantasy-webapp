import React, { MouseEvent, useState } from 'react'
import { Avatar, IconButton } from '@mui/material'
import { COLORS } from '@/util/colors'
import { useAuth } from '@/providers/AuthProvider'
import CricMenu from './ui/CricMenu'
import { OptionsEntity } from '@/model/entities/options.interface'
import { useRouter } from 'next/navigation'

const settingsMenu: OptionsEntity[] = [{ id: 1, label: 'Logout' }]

function AvatarMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null)

  const onMenuSelect = (event: MouseEvent<HTMLButtonElement>) => {
    const anchorData = anchorEl ? null : event?.currentTarget
    setAnchorEl(anchorData)
  }

  const onMenuItemSelect = (menuItem: OptionsEntity) => {
    if (menuItem.id === 1) {
      logout()
      router.push('/login')
    }
  }

  return (
    <IconButton onClick={onMenuSelect}>
      <Avatar
        sx={{
          bgcolor: COLORS.cricPrimary,
          fontSize: 18,
          textTransform: 'capitalize',
        }}
        alt='User Profile'
      >
        {user?.fullName ? user?.fullName[0] : ''}
      </Avatar>
      <CricMenu
        anchorEl={anchorEl}
        menuList={settingsMenu}
        title={user?.fullName}
        subTitle={user?.email}
        onSelect={onMenuItemSelect}
      />
    </IconButton>
  )
}

export default AvatarMenu
