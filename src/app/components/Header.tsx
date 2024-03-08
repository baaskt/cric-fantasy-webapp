'use client'

import AvatarMenu from './AvatarMenu'
import { useAuth } from '@/providers/AuthProvider'
import { useRequest } from '@/hooks/useRequest'
import { USERS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { UserResponse } from '@/model/response/user-me.interface'
import { User } from '@/model/entities/user.interface'
import { getUserObject } from '@/util/helper'
import { useEffect } from 'react'
import { useSidebar } from '@/hooks/useSidebar'

export default function Header() {
  const { activePath } = useSidebar()
  const ActivePathIcon = activePath && activePath?.icon

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
        {ActivePathIcon && <ActivePathIcon />}
        <span className='text-xl uppercase font-semibold'>{activePath?.title}</span>
      </div>
      <AvatarMenu />
    </div>
  )
}
