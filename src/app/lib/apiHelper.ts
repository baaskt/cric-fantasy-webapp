import axios, { AxiosResponse } from 'axios'

export const apiHelper = () => {
  const BASE_URL = 'https://crickccservice.onrender.com/api/'

  function GET(endpoint: string) {
    const url: string = `${BASE_URL}${endpoint}`
    return axios.post<AxiosResponse>(url).then(res => res.data)
  }

  function POST<T>(endpoint: string, { arg }: { arg: T }) {
    const url: string = `${BASE_URL}${endpoint}`
    return axios.post<AxiosResponse>(url, arg).then(res => res.data)
  }

  function PUT<T>(endpoint: string, { arg }: { arg: T }) {
    const url: string = `${BASE_URL}${endpoint}`
    return axios.put<AxiosResponse>(url, arg).then(res => res.data)
  }

  function DELETE<T>(endpoint: string, { arg }: { arg: T }) {
    const url: string = `${BASE_URL}${endpoint}`
    return axios.delete<AxiosResponse>(url, { data: arg }).then(res => res)
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
