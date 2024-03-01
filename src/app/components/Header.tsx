'use client'

import { usePathname } from 'next/navigation'
import { sidebarConfig } from '@/(pages)/tournaments/layout'
import AvatarMenu from './AvatarMenuComp'

export default function Header() {
  const pathname = usePathname()
  const pathIndex = sidebarConfig.findIndex(sc => pathname.includes(sc.path))
  const activePath = pathIndex !== -1 ? sidebarConfig[pathIndex] : null

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
