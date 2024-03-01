import React, { FC, ReactNode } from 'react'
import { Modal, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface CricModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const styles = {
  modalStyle: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    minWidth: 400,
  },
  closeIconWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
}

const CricModal: FC<CricModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={styles.modalStyle}>
        <IconButton onClick={onClose} sx={styles.closeIconWrapper}>
          <CloseIcon />
        </IconButton>
        {children}
      </Box>
    </Modal>
  )
}

export default CricModal
