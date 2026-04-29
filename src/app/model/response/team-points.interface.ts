import { SpinPlayerEntity } from './tender-player.interface'

export interface TeamPointsEntity {
  pointsUpdatedAt: string
  position: number
  points: number // Match Points
  statPoints: number //Milestone Points
  prevPoints: number
  prevPosition: number
  teamId: string
  teamName: string
  tournamentPoints: number // points +  statPoints
  spinPlayer: SpinPlayerEntity[]
  aiRank: number
}
