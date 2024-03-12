import { User } from '../entities/user.interface'

export interface UserResponse extends User {
  tournament: string // tournament ID
}
