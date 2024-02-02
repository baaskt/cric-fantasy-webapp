export const useSessionStorage = () => {
  function setItem<T>(key: string, value: T): void {
    const parsedValue = JSON.stringify(value)
    sessionStorage.setItem(key, parsedValue)
  }

  function getItem<T>(key: string): T | null {
    const value = sessionStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : null
  }

  const removeItem = (key: string): void => {
    sessionStorage.removeItem(key)
  }

  return { setItem, getItem, removeItem }
}
