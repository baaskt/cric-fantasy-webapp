'use client'

import TeamList from '@/components/TeamList'
import CreateTeamForm from '@/components/forms/CreateTeamForm'
import CricButton from '@/components/ui/CricButton'
import CricModal from '@/components/ui/CricModal'
import { COLORS } from '@/util/colors'
import { TEAM } from '@/util/constants/constants'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'

export default function Teams() {
  const [open, setOpen] = useState<boolean>(false)
  const [isCreating, setCreating] = useState<boolean>(false)

  const createTeam = () => {
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
      <div className='flex flex-row justify-between items-center'>
        <div style={{ color: COLORS.gray }} className='text-sm italic'>
          Teams are sorted based on the total points in descending order
        </div>
        <CricButton
          startIcon={<AddIcon />}
          onClick={() => createTeam()}
          btnTxt={isCreating ? TEAM.CREATING : TEAM.CREATE}
        ></CricButton>
      </div>
      <TeamList />
      <CricModal open={open} onClose={handleClose}>
        <CreateTeamForm onCreate={onCreate}></CreateTeamForm>
      </CricModal>
    </div>
  )
}
