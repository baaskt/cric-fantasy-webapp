import { AxiosResponse } from 'axios'
import axios from './NetworkInterceptor'

export const apiHelper = () => {
  function GET(endpoint: string) {
    return axios.post<AxiosResponse>(endpoint).then(res => res.data)
  }

  function POST<T>(endpoint: string, { arg }: { arg: T }) {
    return axios.post<AxiosResponse>(endpoint, arg).then(res => res.data)
  }

  function PUT<T>(endpoint: string, { arg }: { arg: T }) {
    return axios.put<AxiosResponse>(endpoint, arg).then(res => res.data)
  }

  function DELETE<T>(endpoint: string, { arg }: { arg: T }) {
    return axios.delete<AxiosResponse>(endpoint, { data: arg }).then(res => res)
  }

  return {
    GET,
    POST,
    PUT,
    DELETE,
  }
}

export const getFetcher = (url: string) => {
  return apiHelper().GET(url)
}
