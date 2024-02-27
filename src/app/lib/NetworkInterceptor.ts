// Create an Axios instance with default configuration
import { cookieHelper } from '@/lib/cookieHelper'
import { API_URL } from '@/util/constants/endpoints'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Timeout of 30 seconds
  timeoutErrorMessage: "It's taking long than expected, try again",
})

// Add a request interceptor to add access token to headers
axiosInstance.interceptors.request.use(
  config => {
    // Get access token from cookie or local storage
    const accessToken = cookieHelper().getCookieItem('accessToken')
    // Set Authorization header with the access token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    // Handle request errors
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // Handle request errors
    return Promise.reject(error)
  },
)

export default axiosInstance
