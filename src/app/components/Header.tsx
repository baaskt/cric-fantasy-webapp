'use client'

import AvatarMenu from './AvatarMenu'
import { useAuth } from '@/providers/AuthProvider'
import { useRequest } from '@/hooks/useRequest'
import { USERS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { UserResponse } from '@/model/response/user-me.interface'
import { User } from '@/model/entities/user.interface'
import { getUserObject } from '@/util/helper'
import { useEffect, useState } from 'react'
import { useSidebar } from '@/hooks/useSidebar'
import { SideBarMenuEntity } from '@/model/types/sidedbar-menu.type'
import { TITLES } from '@/util/constants/constants'
import { useTournament } from '@/providers/TournamentProvider'

export default function Header() {
  const { activePath } = useSidebar()
  const { subTitle } = useTournament()
  const { user, setUserDetails } = useAuth()
  const myUserRequest = useRequest(USERS.MY_USER_URL)
  const [headerData, setHeaderData] = useState<SideBarMenuEntity | null>()

  useEffect(() => {
    setHeaderData(activePath)
  }, [])

  useEffect(() => {
    if (activePath || subTitle) {
      updatePath()
    }
  }, [activePath, subTitle])

  const ActivePathIcon = activePath && activePath?.icon

  useEffect(() => {
    if (myUserRequest.data) {
      const myUserResponse: CricResponse<UserResponse> =
        myUserRequest.data as CricResponse<UserResponse>
      const userResult: UserResponse | undefined = myUserResponse?.result
      if (userResult) {
        const userDetails: User = getUserObject(user, userResult)
        setUserDetails(userDetails)
      }
    }
  }, [myUserRequest?.data])

  const updatePath = () => {
    let updatedPath = activePath
    if (activePath?.title === TITLES.AUCTION_TABLE.label) {
      updatedPath = { ...activePath, title: `${activePath.title}${' - ' + subTitle}` }
    }
    setHeaderData(updatedPath)
  }

  return (
    <div className='h-16 px-5 white-bg flex justify-between items-center shadow-md fixed top-0 left-[20%] right-0 z-50'>
      <div className='flex items-center gap-2'>
        {ActivePathIcon && <ActivePathIcon />}
        <span className='text-xl uppercase font-semibold'>
          {headerData ? headerData.title : '...loading'}
        </span>
      </div>
      <AvatarMenu />
    </div>
  )
}
