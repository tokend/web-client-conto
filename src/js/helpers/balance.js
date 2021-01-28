import { store, vuexTypes } from '@/vuex'

export function getAccountBalanceIdByCode (code) {
  let balanceId = store.getters[vuexTypes.accountBalanceByCode](code).id
  if (balanceId) {
    return balanceId
  }
}
