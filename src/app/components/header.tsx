'use client'

import { Avatar } from '@mui/material'
import Brand from './brand'
import { COLORS } from '@/util/colors'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { useEffect, useState } from 'react'
import { User } from '@/model/entities/user.interface'

export default function Header() {
  const [userData, setUserData] = useState<User | null>()
  const { getItem } = useSessionStorage()

  useEffect(() => {
    const data: User | null = getItem('user')
    console.log(data)
    setUserData(data)
  }, [])

  return (
    <div className='h-14 pl-2 pr-10 white-bg flex justify-between items-center shadow-md'>
      <Brand />
      <Avatar
        sx={{
          bgcolor: COLORS.cricPrimary,
          fontSize: 15,
          textTransform: 'capitalize',
        }}
      >
        {userData?.name && userData?.name[0]}
      </Avatar>
    </div>
  )
}
