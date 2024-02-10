'use client'

import { Avatar } from '@mui/material'
import Brand from './brand'
import { COLORS } from '@/util/colors'
import { useAuth } from '@/providers/AuthProvider'

export default function Header() {
  const { user } = useAuth()

  return (
    <div className='h-16 px-5 white-bg flex justify-between items-center shadow-md'>
      <Brand />
      <Avatar
        sx={{
          bgcolor: COLORS.cricPrimary,
          fontSize: 18,
          textTransform: 'capitalize',
        }}
      >
        {user?.name && user?.name[0]}
      </Avatar>
    </div>
  )
}
