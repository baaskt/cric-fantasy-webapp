import { User } from '@/model/entities/user.interface'
import { UserResponse } from '@/model/response/user-me.interface'

export const getUserObject = (
  user: User | undefined,
  userData?: UserResponse,
): User => {
  const userEntity = user || new User()
  const userResponse = userData?.user
  const fullName = userResponse?.fullName ? userResponse?.fullName : ''
  const email = userResponse?.email ? userResponse?.email : ''
  const roles = userResponse?.roles ? userResponse?.roles : []
  const userObject: User = {
    ...userEntity,
    fullName: fullName,
    email: email,
    roles: roles,
  }
  return userObject
}
