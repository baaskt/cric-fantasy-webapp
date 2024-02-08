import { getFetcher } from '@/lib/apiHelper'
import useSWR from 'swr'

export function useRequest(url: string) {
  const { data, error, isLoading } = useSWR<unknown, Error | undefined>(
    url,
    () => getFetcher(url),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  )

  return {
    data: data,
    isLoading,
    error,
  }
}
