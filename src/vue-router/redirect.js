import { vueRoutes } from './routes'
import { store, vuexTypes } from '@/vuex'

const REDIRECT_TYPES = {
  apiVerify: 'api-verify',
  marketplacePayment: 'marketplace-payment',
  inviteVerify: 'invite-verify',
}

export const resolveRedirect = (to, from, next) => {
  const encodedValue = to.path.replace('/r/', '')
  const decodedValue = JSON.parse(atob(encodedValue))

  switch (decodedValue.type) {
    case REDIRECT_TYPES.apiVerify:
      handleEmailRedirect(encodedValue, next)
      break
    case REDIRECT_TYPES.marketplacePayment:
      handlePurchasedAssetRedirect(decodedValue.meta, next)
      break
    case REDIRECT_TYPES.inviteVerify:
      handleInviteRedirect(decodedValue.meta, next)
      break
  }
}

function handleEmailRedirect (encodedVerificationCode, next) {
  next({
    ...vueRoutes.login,
    params: { encodedVerificationCode },
  })
}

function handleInviteRedirect (decodedInviteVerificationInfo, next) {
  next({
    ...vueRoutes.signup,
    params: { inviteVerificationInfo: decodedInviteVerificationInfo },
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
