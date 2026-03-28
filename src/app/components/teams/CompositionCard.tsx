import { COLORS } from '@/util/colors'
import React from 'react'

type CompositionCardProps = {
  role: string
  roleCount: number | undefined
  validComp: boolean
}
function CompositionCard(props: CompositionCardProps) {
  const { role, roleCount, validComp } = props
  return (
    <div
      style={{
        backgroundColor: validComp ? COLORS.cricPrimary : COLORS.cricPrimaryLight,
      }}
      key={role}
      className='rounded-lg shadow-lg p-2 text-center min-w-36 md:min-w-48'
    >
      <div style={{ color: COLORS.white }} className='text-md md:text-xl'>
        {role} <span>: {roleCount}</span>
      </div>
    </div>
  )
}

export default CompositionCard
