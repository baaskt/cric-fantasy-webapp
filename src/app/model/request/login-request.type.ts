export type LoginRequest = {
  email: string
  password: string
}

export type ForgotPwdRequest = {
  email: string
}

export type VerifyEmailRequest = {
  email: string
}

export type ResetPwdRequest = {
  email: string
  password: string
}

export type ResendOtpRequest = {
  email: string
}

export type VerifyOtpRequest = {
  email: string
  otp: string
}
