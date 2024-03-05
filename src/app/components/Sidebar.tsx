'use client'

import React from 'react'
import List from '@mui/material/List'
import CricListItem from './ui/CricListItem'
import { usePathname } from 'next/navigation'
import { sidebarConfig } from '@/(pages)/tournaments/layout'
import Brand from './Brand'

function Sidebar() {
  const pathname = usePathname()
  const pathIndex = sidebarConfig.findIndex(sc => pathname.includes(sc.path))
  const activePath = pathIndex !== -1 ? sidebarConfig[pathIndex] : null

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
              ></CricListItem>
            ),
        )}
      </List>
    </div>
  )
}

export default Sidebar
