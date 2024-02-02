import { User } from '../entities/user.interface'

export type AuthContextType = {
  user: User | null | undefined
  signup: (user: User) => void
  login: (user: User) => void
  logout: () => void
}
