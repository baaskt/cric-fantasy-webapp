import React, { FC, ReactNode } from 'react'
import { Modal, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import useMobile from '@/hooks/useMobile'

interface CricModalProps {
  open: boolean
  hideClose?: boolean
  onClose?: () => void
  children: ReactNode
}

const styles = {
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    m: 2,
  },
  closeIconWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
}

const CricModal: FC<CricModalProps> = ({ open, hideClose, onClose, children }) => {
  const isMobileView = useMobile()

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={{ ...styles.modalStyle, minWidth: isMobileView ? 320 : 400 }}>
        {!hideClose && (
          <IconButton onClick={onClose} sx={styles.closeIconWrapper}>
            <CloseIcon />
          </IconButton>
        )}
        {children}
      </Box>
    </Modal>
  )
}

export default CricModal
