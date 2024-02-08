import { fetcher } from '@/lib/fetcher'
import { HttpMethod } from '@/model/enum/http-method.enum'
import useSWRMutation from 'swr/mutation'

export function useMutateRequest(url: string, httpMethod: string) {
  const { data, error, isMutating, trigger } = useSWRMutation<unknown, Error>(
    url,
    httpMethod === (HttpMethod.POST as string)
      ? fetcher().POST
      : httpMethod === (HttpMethod.PUT as string)
        ? fetcher().PUT
        : fetcher().DELETE,
  )

  return {
    data: data,
    isMutating,
    error,
    trigger,
  }
}
