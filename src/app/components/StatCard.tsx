import React from 'react'
import IconMenu from './IconMenu'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import { COLORS } from '@/util/colors'

type StatCardProps = {
  title: string
  menuList: CricMenuEntity[]
}

function StatCard(props: StatCardProps) {
  const { title, menuList } = props

  const renderMenuItem = (menu: CricMenuEntity, menuIndex: number) => {
    const MenuIcon = menu.icon
    return (
      <IconMenu
        icon={<MenuIcon />}
        color={COLORS.gray}
        iconColor={COLORS.cricPrimary}
        label1={menu.label}
        value={menu.value}
        key={menuIndex}
      />
    )
  }

  return (
    <div>
      <div className='text-sm text-center'>{title}</div>
      {menuList?.map((menu, menuIndex) => renderMenuItem(menu, menuIndex))}
    </div>
  )
}

export default StatCard
