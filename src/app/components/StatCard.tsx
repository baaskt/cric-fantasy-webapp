import React from 'react'
import IconMenu from './IconMenu'
import { CricMenuEntity } from '@/model/types/cric-menu.type'
import { COLORS } from '@/util/colors'

type StatCardProps = {
  title?: string
  subTitle?: string
  menuList: CricMenuEntity[]
}

function StatCard(props: StatCardProps) {
  const { title, subTitle, menuList } = props

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
      <div className='text-lg text-center'>{title}</div>
      <div className='text-sm'>{subTitle}</div>
      {menuList?.map((menu, menuIndex) => renderMenuItem(menu, menuIndex))}
    </div>
  )
}

export default StatCard
