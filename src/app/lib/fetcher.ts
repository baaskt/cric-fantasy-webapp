import { HttpMethod } from '@/model/enum/http-method.enum'

export const fetcher = () => {
  const BASE_URL = 'https://cat-fact.herokuapp.com'
  console.log('why cal me')
  const GET = (endpoint: string) => {
    const API_URL: string = `${BASE_URL}${endpoint}`
    return fetch(API_URL).then(res => res.json())
  }

  async function POST<T>(endpoint: string, { arg }: { arg: T }) {
    const API_URL: string = `${BASE_URL}${endpoint}`
    return fetch(API_URL, {
      method: HttpMethod.POST,
      body: JSON.stringify(arg),
      ...getHeaders(),
    }).then(res => res.json())
  }

  async function PUT<T>(endpoint: string, { arg }: { arg: T }) {
    const API_URL: string = `${BASE_URL}${endpoint}`
    return fetch(API_URL, {
      method: HttpMethod.PUT,
      body: JSON.stringify(arg),
      ...getHeaders(),
    }).then(res => res.json())
  }

  async function DELETE<T>(endpoint: string, { arg }: { arg: T }) {
    const API_URL: string = `${BASE_URL}${endpoint}`
    return fetch(API_URL, {
      method: HttpMethod.DELETE,
      body: JSON.stringify(arg),
      ...getHeaders(),
    }).then(res => res.json())
  }

  const getHeaders = () => {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  return {
    GET,
    POST,
    PUT,
    DELETE,
  }
}

export const getFetcher = (url: string) => {
  return fetcher().GET(url)
}
