import { apiHelper } from '@/lib/apiHelper'
import { HttpMethod } from '@/model/enum/http-method.enum'
import useSWRMutation from 'swr/mutation'

export function useMutateRequest(url: string, httpMethod: string) {
  const { data, error, isMutating, trigger } = useSWRMutation<unknown, Error>(
    url,
    httpMethod === (HttpMethod.POST as string)
      ? apiHelper().POST
      : httpMethod === (HttpMethod.PUT as string)
        ? apiHelper().PUT
        : apiHelper().DELETE,
  )

  return {
    data: data,
    isMutating,
    error,
    trigger,
  }
}
