// Create an Axios instance with default configuration
import { API_URL, USERS } from '@/util/constants/endpoints'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { auth } from './auth'

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retryCount?: number
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 120000, // Timeout of 120 seconds
  timeoutErrorMessage: "It's taking long than expected, try again",
})

// Add a request interceptor to add access token to headers
axiosInstance.interceptors.request.use(
  config => {
    // Get access token from cookie or local storage
    const accessToken = auth().getAccessToken()
    const refreshToken = auth().getRefreshToken()
    const authToken = config.url === USERS.REFRESH_URL ? refreshToken : accessToken
    // Set Authorization header with the access token
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  error => {
    // Handle request errors
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const failedRequest = error.config as CustomAxiosRequestConfig
    if (failedRequest?.url === USERS.REFRESH_URL) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401 && failedRequest) {
      failedRequest._retryCount = failedRequest._retryCount || 0
      if (failedRequest._retryCount >= 2) {
        return Promise.reject(error)
      }
      failedRequest._retryCount += 1
      try {
        const newToken = await auth().refreshAccessToken()
        if (newToken && failedRequest.headers) {
          failedRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return axiosInstance(failedRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
