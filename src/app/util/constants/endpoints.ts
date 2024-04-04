// export const API_URL = 'https://cric-fantasy-backend.onrender.com/api/'
export const API_URL = 'https://cric-fantasy-backend-test.onrender.com/api/'

export const HEALTH_URL = 'health'
export const USERS = {
  LOGIN_URL: 'users/login',
  SIGNUP_URL: 'users',
  MY_USER_URL: 'users/me',
  REFRESH_URL: 'users/refresh',
}

export const TOURNAMENTS = {
  GET_ALL_URL: 'tournaments?all=',
  GET_BY_ID_URL: 'tournaments/tournamentId',
  CREATE_URL: 'tournaments',
  UPDATE_STATUS_URL: 'tournaments',
  ADD_HOST: 'tournaments/addHost',
  JOIN_URL: 'tournaments/join?tournamentId=',
  GET_PARTICIPANTS: 'tournaments/participants?tournamentId=',
}

export const MATCHES = {
  GET_ALL: 'matchSchedule',
  GET_SCORECARD_URL: 'match/scorecard?matchId=',
  UPDATE_DOTS_URL: 'match/matchId/tournaments/tournamentId/updateDots',
}

export const TEAMS = {
  GET_ALL_TEAMS: 'teams',
  CREATE_TEAM_URL: 'teams',
  TEAM_DETAIL_URL: 'teams/teamId',
  UPDATE_PLAYINGXI_URL: 'teams/teamId/tournaments/tournamentId',
}

export const PLAYERS = {
  PLAYERS: 'players',
  GET_ALL_URL: 'players',
  GET_PLAYERS_URL: 'players/tournamentId/list?',
  GET_AUCTION_PLAYERS_URL: 'players/tournamentId/auction?category=',
  GET_AUCTION_UNSOLD_PLAYERS_URL: 'players/tournamentId/auction?soldStatus=',
  LAST_AUCTIONED_URL: 'players/tournaments/tournamentId/last-auctioned-player',
  GET_RANDOM_PLAYER_URL: 'players/tournamentId/random?key=category&value=',
  SELL_PLAYER: 'players/playerId/tournaments/tournamentId/sell',
  RESET_UNSOLD_PLAYER: 'players/tournamentId',
}

export const ROOSTER = {}
