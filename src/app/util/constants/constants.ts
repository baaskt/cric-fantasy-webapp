export const APP_NAME = 'Crik Fantasy'

/* LOGIN / SIGNUP SCREENS */
export const AUTH = {
  BANNER_DESC: 'Welcome to Cricket Fantasy Auction',
  SIGN_IN: {
    txtSignin: 'Sign in',
    noAccount: "Don't have an account ? ",
    error: 'Incorrect username / password',
  },
  SIGN_UP: {
    txtSignup: 'Sign up',
    hasAccount: 'Already have an account ? ',
    error: "Couldn't create account, please try again",
    verifyEmail: 'Verify Email',
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
  FORGOT_PWD: {
    label: 'Forgot Password ?',
    verifyEmail: 'Verify Email',
    error: 'User not available !',
  },
  RESET_PWD: {
    label: 'Reset Password',
    confirmPwd: 'Confirm Password',
    reset: 'Reset',
    error: 'Passwords do not match !',
  },
  VERIFY_OTP: {
    label: 'Verify your email',
    desc: 'Please enter the 4 digit code sent to ',
    confirm: 'Confirm',
    resendOtp: 'Resend Code',
    error: 'Invalid Otp',
  },
  NAME: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    errorSplChar: 'Please enter a valid name',
    errorLength: 'Enter at least 5 characters',
  },
  DISCLAIMER:
    'This auction app is intended solely for entertainment purposes. It must not be used for betting, gambling, or any activity that violates local laws or regulations. By signing up, I acknowledge and agree to use this platform responsibly and legally.',
}

/* TOURNAMENT SCREENS */
export const TOURNAMENT = {
  CREATE: 'Create Tournament',
  CREATING: 'Creating...',
  LOADING_TXT: 'Fetching Tournament Details ...',
  NO_DATA_TITLE: 'No tournaments found',
  NO_DATA_SUB: 'Join a tournament from All Tournaments',
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
    error: 'Something went wrong while creating tournament. Please try again',
  },
  STATUS: {
    JOIN_TOURNAMENT: 'Join Tournament',
    START_TOURNAMENT: 'Start Tournament',
    LEAVE_TOURNAMENT: 'Leave',
    END_TOURNAMENT: 'End Tournament',
    START_AUCTION: 'Start Auction',
    END_AUCTION: 'End Auction',
  },
}

export const PLAYER = {
  LOADING_TXT: 'Fetching Player Details ...',
}

export const DASHBOARD = {
  LOADING_TXT: 'Fetching Team Details ...',
}

export const TEAM = {
  CREATE: 'Create Team',
  CREATING: 'Creating...',
  LOADING_TXT: 'Fetching Team Details ...',
  CREATE_FORM: {
    NAME: {
      label: 'Team Name',
      placeholder: 'Enter Team name',
      errorSplChar: 'Please enter a valid name',
      errorLength: 'Enter at least 5 characters',
    },
    PARTICIPANT: {
      label: 'Participant Name',
      placeholder: 'Choose Participant',
    },
    mandatory: 'Mandatory fields are required',
    error: 'Something went wrong while creating team. Please try again',
  },
}

export const MATCH = {
  CREATE: 'Create Match',
  LOADING_TXT: 'Fetching Match Details ...',
}

/* SCREEN TITLES */
export const TITLES = {
  SIGNIN: { label: 'Sign In', path: '/login', fullPath: '/login' },
  FORGOT_PWD: { label: 'Forgot Password', path: '/forgotPwd', fullPath: '/forgotPwd' },
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
  MATCH_DETAIL: {
    label: 'Match Centre',
    path: '/matches/detail',
    fullPath: '/tournaments/tournamentId/matches/detail',
  },
  PLAYERS: {
    label: 'Players',
    path: '/players',
    fullPath: '/tournaments/tournamentId/players',
  },
  PLAYER_DETAIL: {
    label: 'Player Detail',
    path: '/players/playerId',
    fullPath: '/tournaments/tournamentId/players/playerId',
  },
  TEAMS: {
    label: 'Teams',
    path: '/teams',
    fullPath: '/tournaments/tournamentId/teams',
  },
  ANALYTICS: {
    label: 'Analytics',
    path: '/analytics',
    fullPath: '/tournaments/tournamentId/analytics',
  },
  TEAM_DETAIL: {
    label: 'Team Detail',
    path: 'teams/detail',
    fullPath: '/tournaments/tournamentId/teams/detail',
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
    path: '/board',
    fullPath: '/tournaments/tournamentId/auction/board',
  },
  HOME: {
    label: 'Home',
    path: '/tournaments',
    fullPath: '/tournaments',
  },
  RULE_BUILDER: {
    label: 'Rule Builder',
    path: '/ruleBuilder',
    fullPath: '/tournaments/tournamentId/ruleBuilder',
  },
}

export const STATS = {
  t20: 'T20 Career Stats',
  ipl: 'Stumps Stats',
}

export const NO_CACHE = true
export const ALTERNATE_PLAYER_IMAGE_SRC = '/assets/images/default_player.jpg'
