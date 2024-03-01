import React, { ReactNode } from 'react'

type IconMenuProps = {
  icon: ReactNode
  label1: string | undefined
  label2?: string | undefined
  separator?: string
  color: string
  type?: string
}

function IconMenu(props: IconMenuProps) {
  const { icon, label1, label2, separator, color, type } = props
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
  const labelTxt = label2Txt
    ? `${label1Txt} ${separator} ${label2Txt}`
    : `${label1Txt}`

  return (
    labelTxt && (
      <div className='flex flex-row gap-2 mt-3' style={{ color: color }}>
        <div>{icon}</div>
        <div>{labelTxt}</div>
      </div>
    )
  )
}

export default IconMenu
