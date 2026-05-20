import useSWR from "swr"

interface GoldPriceData {
  price: number
  bid?: number
  ask?: number
  timestamp: string
  source: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useGoldPrice() {
  const { data, error, isLoading, mutate } = useSWR<GoldPriceData>(
    "/api/gold-price",
    fetcher,
    {
      refreshInterval: 120000, // Refresh every 2 minutes
      revalidateOnFocus: true,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  )

  return {
    price: data?.price,
    timestamp: data?.timestamp,
    source: data?.source,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}
