import { useSessionStorage } from '@/hooks/useSessionStorage'
import { AuthContextType } from '@/model/context/authContext.type'
import { User } from '@/model/entities/user.interface'
import { createContext, useState, useContext } from 'react'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
const { Provider } = AuthContext

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>()
  const { setItem } = useSessionStorage()

  const login = (user: User): void => {
    setUser(user)
    setItem('user', user)
  }

  const signup = (user: User): void => {
    setUser(user)
    setItem('user', user)
  }

  const logout = (): void => {
    setUser(null)
    setItem('user', '')
  }

  const value: AuthContextType = {
    user,
    signup,
    login,
    logout,
  }

  return <Provider value={value}>{children}</Provider>
}

export default AuthContext
