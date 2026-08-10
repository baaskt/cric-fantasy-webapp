import { SquadEntity } from '../entities/squad.interface'
import { TeamMember } from '../entities/team-member.interface'
import { TenderBidEntity } from './tender-player.interface'

export interface TeamDetailEntity {
  playingXI: string[]
  points: number
  purseBalance: number
  tournamentPoints: number
  prevPoints: number
  teamName: string
  teamId: string
  teamMembers: TeamMember[]
  tournamentId: string
  squad: SquadEntity[]
  squadLimit: number
  imgUrl: string
  playingXIHistory: Record<string, number[]>
  totalTenderSpentAmount: number
  statPoints: number
  aiRank: number
  tenderWins?: TenderWinEntity[]
}

export interface TenderWinEntity {
  amount: number
  date: string
  playerId: string
  playerName: string
  bids: TenderBidEntity[]
}
