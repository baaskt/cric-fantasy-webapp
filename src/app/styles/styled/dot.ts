import { Box, styled, keyframes } from '@mui/material'

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`

export const Dot = styled(Box)({
  width: 10,
  height: 10,
  borderRadius: '50%',
  margin: '0 4px',
  animation: `${pulse} 1.2s infinite ease-in-out`,
})
