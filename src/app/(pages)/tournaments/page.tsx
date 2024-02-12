'use client'

import CricButton from '@/components/ui/cricButton'
import CricTab from '@/components/ui/cricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import React, { useState } from 'react'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'My Fantasy' },
  { id: 2, label: 'In Progress' },
  { id: 3, label: 'Upcoming' },
]
export default function Tournaments() {
  const [isCreating, setCreating] = useState<boolean>(false)
  const handleChange = (selectedEntity: OptionsEntity) => {
    console.log(selectedEntity)
  }

  const createTournament = () => {
    setCreating(false)
  }

  return (
    <div className='m-5'>
      <div className='flex flex-row justify-between'>
        <CricTab optionList={tabOptions} onChange={handleChange} />
        <CricButton variant='contained' onClick={() => createTournament()}>
          {isCreating ? 'logging in...' : 'logging in...'}
        </CricButton>
      </div>
    </div>
  )
}
