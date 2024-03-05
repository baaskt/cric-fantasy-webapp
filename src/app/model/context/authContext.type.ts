import { User } from '../entities/user.interface'
import { LoginResponse } from '../response/login.interface'

export type AuthContextType = {
  user: User | undefined
  signup: (fullName: string, email: string) => void
  login: (email: string, authCred: LoginResponse) => void
  logout: () => void
  setUserDetails: (user: User) => void
}
