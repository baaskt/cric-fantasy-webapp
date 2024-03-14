import { getFetcher } from '@/lib/apiHelper'
import useSWR from 'swr'

export function useRequest(url: string, noCache?: boolean) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<unknown, Error | undefined>(
    url,
    () => getFetcher(url),
    {
      revalidateOnMount: noCache ? true : undefined,
      revalidateOnFocus: noCache ? false : false,
      revalidateIfStale: noCache ? false : false,
    },
  )

  return {
    data: data,
    isLoading,
    error,
    mutate,
    isValidating,
  }
}
