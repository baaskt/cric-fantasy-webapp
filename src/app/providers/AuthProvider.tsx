'use client'

import { auth } from '@/lib/auth'
import { AuthContextType } from '@/model/context/authContext.type'
import { User } from '@/model/entities/user.interface'
import { LoginResponse } from '@/model/response/login.interface'
import { createContext, useState, useContext, useEffect } from 'react'
import { useSWRConfig } from 'swr'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
const { Provider } = AuthContext

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>()
  const { cache } = useSWRConfig()

  useEffect(() => {
    setUser(new User())
  }, [])

  const login = (email: string, authCred: LoginResponse): void => {
    const userData = new User()
    setUserDetails({ ...userData, email: email })
    auth().setAuthCred(authCred)
  }

  const signup = (fullName: string, email: string): void => {
    const userData = new User()
    setUserDetails({ ...userData, email: email, fullName: fullName })
    auth().clearAuthCred()
  }

  const logout = (): void => {
    setUser(new User())
    auth().clearAuthCred()
    clearSwrCache()
  }

  const isAdmin = (): boolean => {
    return user && user.roles.includes('admin') ? true : false
  }

  const clearSwrCache = () => {
    let cacheKeys = cache.keys().next()
    while (!cacheKeys.done) {
      cache.delete(cacheKeys.value)
      cacheKeys = cache.keys().next()
    }
  }

  const setUserDetails = (user: User): void => {
    setUser(user)
  }

  const value: AuthContextType = {
    user,
    signup,
    login,
    logout,
    isAdmin,
    setUserDetails,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useAuth = () => useContext(AuthContext)
