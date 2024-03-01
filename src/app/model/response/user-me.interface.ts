import { User } from '../entities/user.interface'

export interface UserResponse {
  user: User
  playingXI: boolean
}
