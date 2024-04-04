import { PlayerDotsEntity } from '../entities/player-dots.interface'

export type UpdateAdminCentreRequest = {
  dots: PlayerDotsEntity[]
  ppom: number
}
