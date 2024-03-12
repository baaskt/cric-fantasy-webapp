const oneLakh = 100000
const tenLakhs = 1000000
const twentyFiveLakhs = 2500000
const fiftyLakhs = 5000000
const oneCrore = 10000000
const tenCrore = 10000000

// Upto 1 Cr : 10 Lakhs
// 1Cr - 10Cr : 25 Lakhs
// 10Cr+ : 50Lakhs
export function getBiddingValue(basePrice: number, maxBidPrice: number): number {
  const currentPrice = maxBidPrice ? maxBidPrice : basePrice
  if (currentPrice < oneCrore) {
    return currentPrice + tenLakhs
  } else if (currentPrice >= oneCrore && currentPrice < tenCrore) {
    return currentPrice + twentyFiveLakhs
  } else if (currentPrice >= tenCrore) {
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
