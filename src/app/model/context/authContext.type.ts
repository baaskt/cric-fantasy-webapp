import { User } from '../entities/user.interface'

export type AuthContextType = {
  user: User | undefined
  signup: (fullName: string, email: string) => void
  login: (email: string, accessToken: string) => void
  logout: () => void
  setUserDetails: (user: User) => void
}
