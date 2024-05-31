import { FieldTxtEntity, NameValidationEntity } from '@/model/entities/name-validation.interface'

export const validateEmail = (email: string): boolean => {
  const emailRegex: RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return String(email).toLowerCase().match(emailRegex) ? true : false
}

export const validateOtp = (otp: string): boolean => {
  return otp ? true : false
}

// Minimum eight characters, Maxium 32 characters, at least one uppercase letter, one lowercase letter , one symbol and one number
export const UPPERCASE_REGEX = new RegExp(/.*[A-Z]/)
export const LOWERCASE_REGEX = new RegExp(/.*[a-z]/)
export const NUMBER_REGEX = new RegExp(/.*\d/)
export const LENGTH_REGEX = new RegExp(/.{8,}$/)
export const SPECIAL_CHARS_REGEX = new RegExp(/.*[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/)

export const PASSWORD_VALID_REGEX = new RegExp(
  `^(?=${[
    LENGTH_REGEX.source,
    UPPERCASE_REGEX.source,
    LOWERCASE_REGEX.source,
    NUMBER_REGEX.source,
    SPECIAL_CHARS_REGEX.source,
  ].join(')(?=')}).*$`,
)

export const validatePassword = (pwd: string): boolean => {
  return String(pwd).match(PASSWORD_VALID_REGEX) ? true : false
}

export const validatePwdLength = (pwd: string): boolean => {
  return pwd?.length >= 8 ? true : false
}

export const validateName = (name: string, skipAlpha?: boolean): NameValidationEntity => {
  const isErrorAlpha = skipAlpha ? false : validateAlphaNumeric(name)
  const isErrorLength = validateMinNameLength(name)
  return {
    valid: !isErrorAlpha && !isErrorLength,
    alpha: isErrorAlpha,
    length: isErrorLength,
  }
}

export const getErrorHelperTxt = (
  validityEntity: NameValidationEntity,
  fieldEntity: FieldTxtEntity,
): string => {
  const { valid, alpha, length } = validityEntity
  return valid ? '' : alpha ? fieldEntity.errorSplChar : length ? fieldEntity.errorLength : ''
}

export const validateAlphaNumeric = (name: string): boolean => {
  const nameRegex: RegExp = /^[A-Za-z\s]+$/
  return nameRegex.test(name) ? false : true
}

export const validateMinNameLength = (name: string): boolean => {
  return name?.length < 5 ? true : false
}
