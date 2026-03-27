import { Dot } from '@/styles/styled/dot'
import { COLORS } from '@/util/colors'
import { Box } from '@mui/material'

interface CricAnimatedDotsProps {
  bgColor?: string
}

const CricAnimatedDots: React.FC<CricAnimatedDotsProps> = props => {
  const { bgColor } = props
  return (
    <Box display='flex' justifyContent='center' alignItems='center'>
      {[0, 0.2, 0.4].map((delay, index) => (
        <Dot
          key={index}
          style={{
            animationDelay: `${delay}s`,
            backgroundColor: bgColor ? bgColor : COLORS.cricPrimary,
          }}
        />
      ))}
    </Box>
  )
}

export default CricAnimatedDots
