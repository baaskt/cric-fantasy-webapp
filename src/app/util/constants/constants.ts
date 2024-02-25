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
      label: 'Series ID',
      placeholder: 'Enter Series ID ( optional )',
      errorSplChar: 'Please enter a valid series id',
      errorLength: '',
    },
  },
}

/* SCREEN TITLES */
export const TITLES = {
  SIGNIN: { label: 'Sign In', path: '/login', fullPath: '/login' },
  SIGNUP: { label: 'Create an account', path: '/signup', fullPath: '/signup' },
  DASHBOARD: {
    label: 'Dashboard',
    path: '/dashboard',
    fullPath: '/tournaments/dashboard',
  },
  MATCHES: {
    label: 'Matches',
    path: '/matches',
    fullPath: '/tournaments/matches',
  },
  PLAYERS: {
    label: 'Players',
    path: '/players',
    fullPath: '/tournaments/players',
  },
  TEAMS: { label: 'Teams', path: '/teams', fullPath: '/tournaments/teams' },
  TOURNAMENTS: {
    label: 'Tournaments',
    path: '/tournaments',
    fullPath: '/tournaments',
  },
}
