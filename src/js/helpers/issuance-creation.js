import { base } from '@tokend/js-sdk'
import config from '@/config'
import { store, vuexTypes } from '@/vuex'

export async function buildIssuanceCreationOperation (assetCode) {
  await store.dispatch(vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS)
  const balance = store.getters[vuexTypes.accountBalanceByCode](assetCode)

  const operation = base.CreateIssuanceRequestBuilder
    .createIssuanceRequest({
      asset: assetCode,
      amount: config.MAX_AMOUNT,
      receiver: balance.id,
      reference: btoa(Math.random()),
      creatorDetails: {},
    })

  return operation
}
