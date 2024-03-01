'use client'

import { cookieHelper } from '@/lib/cookieHelper'
import { AuthContextType } from '@/model/context/authContext.type'
import { User } from '@/model/entities/user.interface'
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

  const login = (email: string, accessToken: string): void => {
    const userData = new User()
    setUserDetails({ ...userData, email: email })
    cookieHelper().setCookieItem('accessToken', accessToken)
  }

  const signup = (fullName: string, email: string): void => {
    const userData = new User()
    setUserDetails({ ...userData, email: email, fullName: fullName })
    cookieHelper().removeCookieItem('accessToken')
  }

  const logout = (): void => {
    setUser(new User())
    cookieHelper().removeCookieItem('accessToken')
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
