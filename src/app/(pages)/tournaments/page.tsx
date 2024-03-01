'use client'

import CreateTournamentForm from '@/components/CreateTournamentFormComp'
import CricButton from '@/components/ui/CricButton'
import CricModal from '@/components/ui/CricModal'
import CricTab from '@/components/ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { TOURNAMENT } from '@/util/constants/constants'
import React, { useState } from 'react'
import TournamentList from '@/components/TournamentList'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'My Tournaments' },
  { id: 2, label: 'All Tournaments' },
]

export default function Tournaments() {
  const [open, setOpen] = useState<boolean>(false)
  const [isCreating, setCreating] = useState<boolean>(false)
  // const [tournamentData, setTournamentData] = useState([])
  const handleChange = (selectedEntity: OptionsEntity) => {
    console.log(selectedEntity)
  }

  const createTournament = () => {
    setOpen(true)
    setCreating(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onCreate = () => {
    setOpen(false)
  }

  return (
    <div className='m-5'>
      <div className='flex flex-row justify-between'>
        <CricTab optionList={tabOptions} onChange={handleChange} />
        <CricButton
          onClick={() => createTournament()}
          btnTxt={isCreating ? TOURNAMENT.CREATING : TOURNAMENT.CREATE}
        ></CricButton>
      </div>
      <TournamentList />
      <CricModal open={open} onClose={handleClose}>
        <CreateTournamentForm onCreate={onCreate}></CreateTournamentForm>
      </CricModal>
    </div>
  )
}
