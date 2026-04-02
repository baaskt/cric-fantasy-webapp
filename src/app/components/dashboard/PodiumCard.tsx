import { TeamPointsEntity } from '@/model/response/team-points.interface'
import { useTeam } from '@/providers/TeamProvider'
import { TITLES } from '@/util/constants/constants'
import { motion, Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'

type PodiumCardProps = {
  position: number
  team: TeamPointsEntity
  height: string
  bg: string
  textColor: string
  highlight?: boolean
  index: number
}

const PodiumCard = (props: PodiumCardProps) => {
  const { markActiveTeam } = useTeam()
  const router = useRouter()
  const { position, team, height, bg, textColor, highlight, index } = props

  const podiumVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        type: 'spring',
        stiffness: 120,
      },
    }),
  }

  const navigateToTeamDetail = (teamId: string) => {
    markActiveTeam(teamId)
    router.push(TITLES.TEAM_DETAIL.path)
  }

  return (
    <motion.div
      custom={index}
      initial='hidden'
      animate='visible'
      variants={podiumVariants}
      whileHover={{ y: -6, scale: 1.03 }}
      className='flex flex-col items-center'
      onClick={() => navigateToTeamDetail(team.teamId)}
    >
      {/* Podium Box */}
      <div
        className={`
          relative flex items-center justify-center w-24 rounded-2xl
          ${height}
          ${bg}
          text-white font-bold text-7xl shadow-lg 
          transition-transform duration-150 ease-in-out active:scale-95
        `}
      >
        {/* Glow effect */}
        {highlight && (
          <div className='absolute inset-0 rounded-2xl blur-xl opacity-40 bg-indigo-400'></div>
        )}

        <span className='relative z-10'>{position}</span>
      </div>

      {/* Team Name */}
      <p className='mt-3 w-28 text-center text-sm font-semibold truncate'>{team?.teamName}</p>

      {/* Points */}
      <p className={`text-sm font-bold ${textColor}`}>{team?.tournamentPoints} pts</p>
    </motion.div>
  )
}

export default PodiumCard
