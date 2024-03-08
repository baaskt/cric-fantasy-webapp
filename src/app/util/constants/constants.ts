export const APP_NAME = 'CriKCC Fantasy'

/* LOGIN / SIGNUP SCREENS */
export const AUTH = {
  BANNER_DESC: 'Welcome to 1st Edition of KCC Fantasy League',
  SIGN_IN: {
    txtSignin: 'Sign in',
    noAccount: "Don't have an account ? ",
    error: 'Incorrect username / password',
  },
  SIGN_UP: {
    txtSignup: 'Sign up',
    hasAccount: 'Already have an account ? ',
    error: "Couldn't create account, please try again",
  },
  EMAIL: {
    label: 'Email',
    placeholder: 'Enter your email address',
    error: 'Please enter valid email address',
  },
  PASSWORD: {
    label: 'Password',
    placeholder: 'Enter at least 8 characters',
    errorLength: 'Password must be at least 8 characters',
    errorLower: 'Password must contain at least one lower case letter',
    errorUpper: 'Password must contain at least one upper case letter',
    errorDigit: 'Password must contain at least one digit',
    errorSplChar: 'Password must contain at least one symbol',
  },
  NAME: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    errorSplChar: 'Please enter a valid name',
    errorLength: 'Enter at least 5 characters',
  },
}

/* TOURNAMENT SCREENS */
export const TOURNAMENT = {
  CREATE: 'Create Tournament',
  CREATING: 'Creating...',
  LOADING_TXT: 'Fetching Tournament Details ...',
  NO_DATA_TITLE: 'No tournaments found',
  NO_DATA_SUB: 'Create a tournament by using the Create Tournament',
  CREATE_FORM: {
    NAME: {
      label: 'Tournament Name',
      placeholder: 'Enter tournament name',
      errorSplChar: 'Please enter a valid name',
      errorLength: 'Enter at least 5 characters',
    },
    START_DATE: {
      label: 'Tournament Duration',
      placeholder: 'Enter start date',
      errorSplChar: 'Please enter a valid start date',
      errorLength: 'Enter at least 5 characters',
    },
    END_DATE: {
      label: 'End Date',
      placeholder: 'Enter end date',
      errorSplChar: 'Please enter a valid end date',
      errorLength: 'Enter at least 5 characters',
    },
    LOCATION: {
      label: 'Location',
      placeholder: 'Enter location',
      errorSplChar: 'Please enter a valid location',
      errorLength: 'Enter at least 5 characters',
    },
    SERIES_ID: {
      label: 'Series Id',
      placeholder: 'Enter Series Id',
      errorSplChar: 'Please enter a valid series id',
      errorLength: '',
    },
    IMAGE: {
      label: 'Image Url',
      placeholder: 'Enter Image URL',
    },
    mandatory: 'Mandatory fields are required',
    error: 'Something when wrong while creating tournament. Please try again',
  },
  STATUS: {
    JOIN_TOURNAMENT: 'Join Tournament',
    START_TOURNAMENT: 'Start Tournament',
    LEAVE_TOURNAMENT: 'Leave',
    END_TOURNAMENT: 'End Tournament',
    START_AUCTION: 'Start Auction',
    ENTER_AUCTION: 'Enter Auction',
    END_AUCTION: 'End Auction',
  },
}

export const PLAYER = {
  LOADING_TXT: 'Fetching Player Details ...',
}

/* SCREEN TITLES */
export const TITLES = {
  SIGNIN: { label: 'Sign In', path: '/login', fullPath: '/login' },
  SIGNUP: { label: 'Create an account', path: '/signup', fullPath: '/signup' },
  DASHBOARD: {
    label: 'Dashboard',
    path: '/dashboard',
    fullPath: '/tournaments/tournamentId/dashboard',
  },
  MATCHES: {
    label: 'Matches',
    path: '/matches',
    fullPath: '/tournaments/tournamentId/matches',
  },
  PLAYERS: {
    label: 'Players',
    path: '/players',
    fullPath: '/tournaments/tournamentId/players',
  },
  TEAMS: {
    label: 'Teams',
    path: '/teams',
    fullPath: '/tournaments/tournamentId/teams',
  },
  TOURNAMENTS: {
    label: 'Tournaments',
    path: '/tournaments',
    fullPath: '/tournaments',
  },
  AUCTION: {
    label: 'Auction',
    path: '/auction',
    fullPath: '/tournaments/tournamentId/auction',
  },
  AUCTION_TABLE: {
    label: 'Auction Board',
    path: '/player',
    fullPath: '/tournaments/tournamentId/auction/player',
  },
  HOME: {
    label: 'Home',
    path: '/tournaments',
    fullPath: '/tournaments',
  },
}

export const STATS = {
  t20: 'T20 Career Stats',
}
