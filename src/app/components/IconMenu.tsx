import { COLORS } from '@/util/colors'
import React, { ReactNode } from 'react'

type IconMenuProps = {
  icon: ReactNode
  label1: string | undefined
  color: string
  label2?: string | undefined
  separator?: string
  iconColor?: string
  type?: string
  value?: string
}

function IconMenu(props: IconMenuProps) {
  const { icon, label1, label2, separator, color, iconColor, type, value } = props
  const label1Txt =
    type === 'date'
      ? label1
        ? new Date(label1).toDateString()
        : ''
      : label1 && label1 !== undefined
        ? label1
        : ''
  const label2Txt =
    type === 'date'
      ? label2
        ? new Date(label2).toDateString()
        : ''
      : label2 && label2 !== undefined
        ? label2
        : ''
  const labelTxt = label2Txt ? `${label1Txt} ${separator} ${label2Txt}` : `${label1Txt}`

  return (
    labelTxt && (
      <div
        className='flex flex-row gap-10 justify-between items-center mt-3'
        style={{ color: color }}
      >
        <div className='flex flex-row gap-2 items-center'>
          <div style={{ color: iconColor }}>{icon}</div>
          <div className='font-light'>{labelTxt}</div>
        </div>
        <div style={{ color: COLORS.cricDark }} className='text-sm font-semibold'>
          {value}
        </div>
      </div>
    )
  )
}

export default IconMenu
