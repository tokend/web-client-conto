import { vueRoutes } from './routes'
import { store, vuexTypes } from '@/vuex'

const REDIRECT_TYPES = {
  email: 1,
  purchasedAsset: 2,
}

export const resolveRedirect = (to, from, next) => {
  const encodedValue = to.path.replace('/r/', '')
  const decodedValue = JSON.parse(atob(encodedValue))

  switch (decodedValue.type) {
    case REDIRECT_TYPES.email:
      handleEmailRedirect(encodedValue, next)
      break
    case REDIRECT_TYPES.purchasedAsset:
      handlePurchasedAssetRedirect(decodedValue.meta, next)
      break
  }
}

function handleEmailRedirect (encodedVerificationCode, next) {
  next({
    ...vueRoutes.login,
    params: { encodedVerificationCode },
  })
}

function handlePurchasedAssetRedirect (decodedPurchasedAssetInfo, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
  const isPurchasedSuccessful = decodedPurchasedAssetInfo.is_success

  if (isLoggedIn) {
    next({
      ...vueRoutes.assetsExplore,
      params: { isAssetPurchased: isPurchasedSuccessful },
    })
  } else {
    if (isPurchasedSuccessful) {
      next({
        ...vueRoutes.successfulPayment,
        params: { purchasedAssetInfo: decodedPurchasedAssetInfo },
      })
    } else {
      next({
        ...vueRoutes.failedPayment,
      })
    }
  }
}
