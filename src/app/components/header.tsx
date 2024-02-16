'use client'

import { Avatar } from '@mui/material'
import { COLORS } from '@/util/colors'
import { useAuth } from '@/providers/AuthProvider'
import { SideBarMenuEntity } from '@/model/entities/sidedbar-menu.type'

export default function Header({
  activePath,
}: {
  activePath: SideBarMenuEntity | null
}) {
  const { user } = useAuth()
  return (
    <div className='h-16 px-5 white-bg flex justify-between items-center shadow-md'>
      <div className='flex items-center gap-2'>
        {activePath?.icon}
        <span className='text-xl uppercase font-semibold'>
          {activePath?.title}
        </span>
      </div>
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
