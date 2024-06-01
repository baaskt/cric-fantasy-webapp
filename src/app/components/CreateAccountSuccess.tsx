import React from 'react'
import VerifiedIcon from '@mui/icons-material/Verified'
import { COLORS } from '@/util/colors'
import CricButton from './ui/CricButton'
import { useRouter } from 'next/navigation'

function CreateAccountSuccess() {
  const router = useRouter()

  const navigateToLogin = () => {
    router.push('/login')
  }
  return (
    <div className='flex items-center justify-center flex-col gap-2'>
      <VerifiedIcon style={{ color: COLORS.cricPrimary, fontSize: 48 }} />
      <div className='bold text-2xl'>Account created !</div>
      <div className='text-md text-slate-500 mb-5'>
        Your account has been created successfully, please login to continue
      </div>
      <CricButton isFullWidth={true} onClick={navigateToLogin} btnTxt={'Continue'}></CricButton>
    </div>
  )
}

export default CreateAccountSuccess
