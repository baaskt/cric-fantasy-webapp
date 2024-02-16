'use client'

// import EmptyData from '@/components/EmptyData'
import CricButton from '@/components/ui/cricButton'
import CricTab from '@/components/ui/cricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { TOURNAMENT } from '@/util/constants'
import React, { useState } from 'react'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'My Tournaments' },
  { id: 2, label: 'All Tournaments' },
]

export default function Tournaments() {
  const [isCreating, setCreating] = useState<boolean>(false)
  // const [tournamentData, setTournamentData] = useState([])
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
          {isCreating ? TOURNAMENT.CREATING : TOURNAMENT.CREATE}
        </CricButton>
      </div>
      {/* {!tournamentData?.length && <EmptyData></EmptyData>} */}
    </div>
  )
}
