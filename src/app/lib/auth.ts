import { LoginResponse } from '@/model/response/login.interface'
import { cookieHelper } from './cookieHelper'
import { CricResponse } from '@/model/types/cric-response.type'
import { USERS } from '@/util/constants/endpoints'
import { apiHelper } from './apiHelper'
import { MATCH_ID, TEAM_ID, TOURNAMENT_ID } from '@/providers/TournamentProvider'

export const auth = () => {
  const ACCESS_TOKEN = 'accessToken'
  const REFRESH_TOKEN = 'refreshToken'

  function getAccessToken(): string {
    const accessToken = cookieHelper().getCookieItem(ACCESS_TOKEN)
    return accessToken ? accessToken : ''
  }

  function getRefreshToken(): string {
    const refreshToken = cookieHelper().getCookieItem(REFRESH_TOKEN)
    return refreshToken ? refreshToken : ''
  }

  function getTournamentId(): string {
    const tournamentId = cookieHelper().getCookieItem(TOURNAMENT_ID)
    return tournamentId ? tournamentId : ''
  }

  function getTeamId(): string {
    const teamId = cookieHelper().getCookieItem(TEAM_ID)
    return teamId ? teamId : ''
  }

  function getMatchId(): string {
    const teamId = cookieHelper().getCookieItem(MATCH_ID)
    return teamId ? teamId : ''
  }

  function setAuthCred(authCred: LoginResponse): void {
    cookieHelper().setCookieItem(ACCESS_TOKEN, authCred.accessToken)
    cookieHelper().setCookieItem(REFRESH_TOKEN, authCred.refreshToken)
  }

  function clearAuthCred(): void {
    cookieHelper().removeCookieItem(ACCESS_TOKEN)
    cookieHelper().removeCookieItem(REFRESH_TOKEN)
    cookieHelper().removeCookieItem(TOURNAMENT_ID)
    cookieHelper().removeCookieItem(TEAM_ID)
    cookieHelper().removeCookieItem(MATCH_ID)
  }

  const refreshAccessToken = async () => {
    const refreshResponse: CricResponse<LoginResponse> = (await apiHelper().POST(
      USERS.REFRESH_URL,
      {
        arg: null,
      },
    )) as CricResponse<LoginResponse>
    if (refreshResponse?.result) auth().setAuthCred(refreshResponse.result)
    return refreshResponse?.result?.accessToken
  }

  return {
    getAccessToken,
    getRefreshToken,
    getTournamentId,
    getTeamId,
    getMatchId,
    setAuthCred,
    clearAuthCred,
    refreshAccessToken,
  }
}
