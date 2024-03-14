const oneLakh = 100000
const fiveLakhs = 500000
const tenLakhs = 1000000
const twentyLakhs = 2000000
const fiftyLakhs = 5000000
const oneCrore = 10000000
const twoCrores = 20000000
const fiveCrores = 50000000
const twentyFiveCrores = 250000000

// upto 50L - 5L
// 50L TO 2CR-  10L
// 2CR to 5CR - 20L
// 5CR to 25CR - 50L
export function getBiddingValue(basePrice: number, maxBidPrice: number): number {
  // if (!maxBidPrice) return basePrice
  if (maxBidPrice === twentyFiveCrores) return maxBidPrice
  const currentPrice = maxBidPrice ? maxBidPrice : basePrice
  if (currentPrice < fiftyLakhs) {
    return currentPrice + fiveLakhs
  } else if (currentPrice >= fiftyLakhs && currentPrice < twoCrores) {
    return currentPrice + tenLakhs
  } else if (currentPrice >= twoCrores && currentPrice < fiveCrores) {
    return currentPrice + twentyLakhs
  } else if (currentPrice >= fiveCrores) {
    return currentPrice + fiftyLakhs
  }
  return 0
}

export function biddingString(biddingPrice: number): string {
  let budgetString = ''
  if (biddingPrice >= oneCrore) {
    const currencyValue = biddingPrice / oneCrore
    budgetString = `${currencyValue}${currencyValue > 1 ? ' crores' : ' crore'}`
  } else if (biddingPrice >= oneLakh) {
    const currencyValue = biddingPrice / oneLakh
    budgetString = `${currencyValue}${currencyValue > 1 ? ' lakhs' : ' lakh'}`
  }
  return budgetString
}
