'use client'

import { usePathname } from 'next/navigation'
import { sidebarConfig } from '@/(pages)/tournaments/layout'
import AvatarMenu from './AvatarMenu'
import { useAuth } from '@/providers/AuthProvider'
import { useRequest } from '@/hooks/useRequest'
import { USERS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { UserResponse } from '@/model/response/user-me.interface'
import { User } from '@/model/entities/user.interface'
import { getUserObject } from '@/util/helper'
import { useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const pathIndex = sidebarConfig.findIndex(sc => pathname.includes(sc.path))
  const activePath = pathIndex !== -1 ? sidebarConfig[pathIndex] : null

  const { user, setUserDetails } = useAuth()
  const myUserRequest = useRequest(USERS.MY_USER_URL)

  useEffect(() => {
    if (myUserRequest.data) {
      const myUserResponse: CricResponse<UserResponse> =
        myUserRequest.data as CricResponse<UserResponse>
      const userResult: UserResponse | undefined = myUserResponse?.result
      const userDetails: User = getUserObject(user, userResult)
      setUserDetails(userDetails)
    }
  }, [myUserRequest?.data])

  return (
    <div className='h-16 px-5 white-bg flex justify-between items-center shadow-md fixed top-0 left-[20%] right-0 z-50'>
      <div className='flex items-center gap-2'>
        {activePath?.icon}
        <span className='text-xl uppercase font-semibold'>
          {activePath?.title}
        </span>
      </div>
      <AvatarMenu />
    </div>
  )
}
