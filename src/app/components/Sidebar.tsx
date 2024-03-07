'use client'

import React from 'react'
import List from '@mui/material/List'
import CricListItem from './ui/CricListItem'
import Brand from './Brand'
import { useSidebar } from '@/hooks/useSidebar'
import { SideBarMenuEntity } from '@/model/types/sidedbar-menu.type'
import { useRouter } from 'next/navigation'

function Sidebar() {
  const { activePath, tournamentId, sidebarConfig } = useSidebar()
  const router = useRouter()

  const navigateTo = (menuEntity: SideBarMenuEntity) => {
    const redirectPath = menuEntity.fullPath?.replace('tournamentId', tournamentId)
    void router.push(redirectPath)
  }

  return (
    <div className='w-1/5 md:w-1/5 shadow-md fixed top-0 left-0 bottom-0'>
      <div className='flex justify-center p-2 h-16 items-center'>
        <Brand />
      </div>
      <List>
        {sidebarConfig?.map(
          (menuEntity, menuIndex) =>
            !menuEntity.hidden && (
              <CricListItem
                key={menuIndex}
                menuEntity={menuEntity}
                isActive={activePath?.path === menuEntity.path}
                onClick={navigateTo}
              ></CricListItem>
            ),
        )}
      </List>
    </div>
  )
}

export default Sidebar
