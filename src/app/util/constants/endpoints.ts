export const API_URL = 'https://cric-fantasy-backend.onrender.com/api/'
export const HEALTH_URL = 'health'
export const USERS = {
  LOGIN_URL: 'users/login',
  SIGNUP_URL: 'users',
  MY_USER_URL: 'users/me',
  REFRESH_URL: 'users/refresh',
}

export const TOURNAMENTS = {
  GET_ALL_URL: 'tournament?all=',
  CREATE_URL: 'tournament',
  UPDATE_STATUS_URL: 'tournament',
  ADD_HOST: 'tournament/addHost',
  JOIN_URL: 'tournament/join?tournamentId=',
  GET_PARTICIPANTS: 'tournament/participants?tournamentId=',
}

export const TEAMS = {
  GET_ALL_TEAMS: 'teams',
  CREATE_TEAM_URL: 'teams',
}

export const PLAYERS = {
  GET_ALL_URL: 'players',
}

export const ROOSTER = {
  GET_AUCTION_PLAYERS_URL: 'roosters/onCondition?key=category&value=',
  LAST_AUCTIONED_URL: 'roosters/getLastAuctioned',
  GET_RANDOM_PLAYER_URL: 'roosters/getRandom?key=category&value=',
}
