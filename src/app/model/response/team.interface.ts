import { TeamMember } from '../entities/team-member.interface'

export interface TeamEntity {
  teamName: string
  teamId: string
  purseBalance: number
  teamMembers: TeamMember[]
  tournamentId: string
  tournamentPoints: number
  playingXI: number[]
  imgUrl: string
  squadCount: number
}
