'use client'

import React from 'react'
import List from '@mui/material/List'
import CricListItem from './ui/CricListItem'
import Brand from './Brand'
import { useSidebar } from '@/hooks/useSidebar'
import { SideBarMenuEntity } from '@/model/types/sidedbar-menu.type'
import { useRouter } from 'next/navigation'

type SidebarProps = {
  show: boolean
  onClose: (visibility: boolean) => void
}

function Sidebar(props: SidebarProps) {
  const { activePath, tournamentId, sidebarConfig } = useSidebar()
  const router = useRouter()
  const { show, onClose } = props
  // Define our base class
  const className =
    'bg-white shadow-md transition-[margin-left] ease-in-out duration-500 fixed bottom-0 left-0 top-[60px] w-2/3 z-[1000] md:w-1/5 md:top-0'
  // Append class based on state of sidebar visiblity
  const appendClass = show ? ' ml-0' : ' ml-[-300px] md:ml-0'

  const navigateTo = (menuEntity: SideBarMenuEntity) => {
    const redirectPath = menuEntity.fullPath?.replace('tournamentId', tournamentId)
    router.push(redirectPath)
    onClose(false)
  }

  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        onClose(false)
      }}
    />
  )

  return (
    <>
      {/* <div className='transition-[20%] ease-in-out duration-500  shadow-md fixed top-0 left-0 bottom-0'> */}
      <div className={`${className}${appendClass}`}>
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
      {show ? <ModalOverlay /> : <></>}
    </>
  )
}

export default Sidebar
