'use client'

import { auth } from '@/lib/auth'
import { AuthContextType } from '@/model/context/authContext.type'
import { User } from '@/model/entities/user.interface'
import { LoginResponse } from '@/model/response/login.interface'
import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
const { Provider } = AuthContext

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>()

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
  }

  const setUserDetails = (user: User): void => {
    setUser(user)
  }

  const value: AuthContextType = {
    user,
    signup,
    login,
    logout,
    setUserDetails,
  }

  return <Provider value={value}>{children}</Provider>
}

export default AuthContext
