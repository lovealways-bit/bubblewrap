export type LunaraPlan = 'free' | 'core' | 'plus' | 'personal'

export const LUNARA_PLANS = {
  free: {
    name: 'Lunara Free',
    monthlyPrice: 0,
    adsEnabled: true,
    rewardedAdsEnabled: true,
    checkoutUrl: null,
  },
  core: {
    name: 'Lunara Core',
    monthlyPrice: 9.99,
    adsEnabled: false,
    rewardedAdsEnabled: false,
    checkoutUrl: 'https://buy.stripe.com/test_28EcN75T3cFH0cJf5IgnK00',
  },
  plus: {
    name: 'Lunara Plus',
    monthlyPrice: 19.99,
    adsEnabled: false,
    rewardedAdsEnabled: false,
    checkoutUrl: 'https://buy.stripe.com/test_5kQ28t1CN8pr6B74r4gnK01',
  },
  personal: {
    name: 'Lunara Personal',
    monthlyPrice: 49.99,
    adsEnabled: false,
    rewardedAdsEnabled: false,
    checkoutUrl: 'https://buy.stripe.com/test_7sY6oJ5T349b7Fb3n0gnK02',
  },
} as const

export const LUNARA_ONE_TIME_OFFERS = {
  birthChart: {
    name: 'Lunara Birth Chart',
    price: 33.33,
    checkoutUrl: 'https://book.stripe.com/test_eVq6oJ2GR5df9Nj2iWgnK03',
  },
  personalReading: {
    name: 'Lunara Personal Reading',
    price: 49.99,
    checkoutUrl: 'https://book.stripe.com/test_6oUcN74OZ6hj0cJ7DggnK04',
  },
} as const

export function planShowsAds(plan: LunaraPlan) {
  return LUNARA_PLANS[plan].adsEnabled
}

export function planAllowsRewardedAds(plan: LunaraPlan) {
  return LUNARA_PLANS[plan].rewardedAdsEnabled
}
