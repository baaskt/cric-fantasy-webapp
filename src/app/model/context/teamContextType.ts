import { TeamEntity } from '../response/team.interface'

export type TeamContextType = {
  activeTeam: TeamEntity | undefined
  markActiveTeam: (team: TeamEntity) => void
}
