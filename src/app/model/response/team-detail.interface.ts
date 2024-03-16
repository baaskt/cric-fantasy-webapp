import { SquadEntity } from '../entities/squad.interface'

export interface TeamDetailEntity {
  playingXI: string[]
  points: number
  purseBalance: number
  tournamentPoints: number
  prevPoints: number
  teamName: string
  teamId: string
  teamMembers: string[]
  tournamentId: string
  squad: SquadEntity[]
}
