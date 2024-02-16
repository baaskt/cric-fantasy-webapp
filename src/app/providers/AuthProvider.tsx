'use client'

import { cookieHelper } from '@/lib/cookieHelper'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { AuthContextType } from '@/model/context/authContext.type'
import { User } from '@/model/entities/user.interface'
import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
const { Provider } = AuthContext

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>()
  const { getItem, setItem } = useSessionStorage()

  useEffect(() => {
    const userData: User | null = getItem('user')
    if (userData) {
      setUser(userData)
      setItem('user', userData)
    }
  }, [])

  const login = (user: User, accessToken: string): void => {
    setUser(user)
    setItem('user', user)
    cookieHelper().setCookieItem('accessToken', accessToken)
  }

  const signup = (user: User): void => {
    setUser(user)
    setItem('user', user)
    cookieHelper().removeCookieItem('accessToken')
  }

  const logout = (): void => {
    setUser(null)
    setItem('user', '')
    cookieHelper().removeCookieItem('accessToken')
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
