import { getFetcher } from '@/lib/apiHelper'
import useSWR from 'swr'

export function useRequest(url: string | null, noCache?: boolean) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<unknown, Error | undefined>(
    url,
    url ? () => getFetcher(url) : null,
    {
      revalidateOnMount: noCache ? true : undefined,
      revalidateOnFocus: noCache ? false : false,
      revalidateIfStale: noCache ? false : false,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 2 times.
        if (retryCount >= 2) return

        // Retry after 5 seconds.
        setTimeout(() => {
          void revalidate({ retryCount })
        }, 5000)
      },
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
