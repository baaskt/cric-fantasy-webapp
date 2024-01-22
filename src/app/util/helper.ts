export const validateEmail = (email: string): boolean => {
  const emailRegex: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  return String(email).toLowerCase().match(emailRegex) ? true : false
}
