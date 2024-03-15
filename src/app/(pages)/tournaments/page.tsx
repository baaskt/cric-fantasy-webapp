'use client'

import CreateTournamentForm from '@/components/forms/CreateTournamentForm'
import CricButton from '@/components/ui/CricButton'
import CricModal from '@/components/ui/CricModal'
import CricTab from '@/components/ui/CricTab'
import { OptionsEntity } from '@/model/entities/options.interface'
import { TOURNAMENT } from '@/util/constants/constants'
import React, { useState } from 'react'
import TournamentList from '@/components/tournament/TournamentList'
import AddIcon from '@mui/icons-material/Add'

const tabOptions: OptionsEntity[] = [
  { id: 1, label: 'My Tournaments' },
  { id: 2, label: 'All Tournaments' },
]

export default function Tournaments() {
  const [open, setOpen] = useState<boolean>(false)
  const [isCreating, setCreating] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState<OptionsEntity>(tabOptions[0])

  const handleChange = (selectedEntity: OptionsEntity) => {
    setSelectedTab(selectedEntity)
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
      <div className='flex justify-between flex-col gap-5 md:flex-row'>
        <CricTab optionList={tabOptions} onChange={handleChange} />
        <CricButton
          startIcon={<AddIcon />}
          onClick={() => createTournament()}
          btnTxt={isCreating ? TOURNAMENT.CREATING : TOURNAMENT.CREATE}
        ></CricButton>
      </div>
      <TournamentList selectedTab={selectedTab} />
      <CricModal open={open} onClose={handleClose}>
        <CreateTournamentForm onCreate={onCreate}></CreateTournamentForm>
      </CricModal>
    </div>
  )
}
