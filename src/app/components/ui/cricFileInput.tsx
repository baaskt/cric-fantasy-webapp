import { COLORS } from '@/util/colors'
import { UploadFileRounded } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { ChangeEvent } from 'react'

type CricFileInput = {
  btnName: string
}

function CricFileInput(props: CricFileInput) {
  const { btnName } = props
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]
    const { name } = file
    console.log(name)

    const reader = new FileReader()
    reader.onload = evt => {
      if (!evt?.target?.result) {
        return
      }
      const { result } = evt.target
      console.log(result)
    }
    reader.readAsBinaryString(file)
  }
  return (
    <Button
      component='label'
      variant='outlined'
      sx={{
        color: COLORS.cricPrimary,
        borderColor: COLORS.cricPrimary,
        ':hover': {
          borderColor: COLORS.cricPrimary,
          bgcolor: COLORS.inputBg,
        },
      }}
      startIcon={<UploadFileRounded />}
    >
      {btnName}
      <input type='file' accept='.csv' hidden onChange={handleFileUpload} />
    </Button>
  )
}

export default CricFileInput
