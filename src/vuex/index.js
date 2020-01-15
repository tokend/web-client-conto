import Vue from 'vue'
import Vuex from 'vuex'

import account from './account.module'
import assets from './assets.module'
import factors from './factors.module'
import wallet from './wallet.module'
import kyc from './kyc.module'
import identities from './identities.module'
import keyValue from './key-value.module'
import businesses from './businesses.module'
import kycRecovery from './kyc-recovery.module'
import movementsHistory from './movements-history.module'
import sponsorshipRequests from './sponsorship-requests.module'
import { vuexTypes } from '@/vuex/types'
import { sessionStoragePlugin } from './plugins/session-storage'
import idleHandler from './idle-handler.module'
import { errors } from '@/js/errors'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { useWallet } from '@/api'
import { Wallet } from '@tokend/js-sdk'

import _isEmpty from 'lodash/isEmpty'

Vue.use(Vuex)

export const rootModule = {
  actions: {
    [vuexTypes.LOG_OUT] ({ commit }) {
      commit(vuexTypes.CLEAR_STATE)
    },
    async [vuexTypes.LOG_IN] ({ dispatch }, { email, password }) {
      await dispatch(vuexTypes.LOAD_WALLET, { email, password })
      await dispatch(vuexTypes.INIT_ACCOUNT)
    },

    async [vuexTypes.RESTORE_SESSION] ({ getters, dispatch }) {
      let walletSeed
      try {
        walletSeed = await dispatch(vuexTypes.DECRYPT_SECRET_SEED)
      } catch (e) {
        if (!(e instanceof errors.NotFoundError)) {
          ErrorHandler.processWithoutFeedback(e)
        }
        dispatch(vuexTypes.LOGOUT_SESSION)
      }

      const wallet = new Wallet(
        getters[vuexTypes.walletEmail],
        walletSeed,
        getters[vuexTypes.walletAccountId],
        getters[vuexTypes.walletId],
      )
      useWallet(wallet)
    },
  },
  mutations: {
    [vuexTypes.CLEAR_WALLET_AND_ACCOUNT] (state) {
      state.account.account = {}
      state.wallet.wallet = {}
    },
    // These mutations are being subscribed by plugins
    [vuexTypes.POP_STATE] () { },
    [vuexTypes.CLEAR_STATE] () { },
  },
  getters: {
    // eslint-disable-next-line max-len
    [vuexTypes.isLoggedIn]: (_, getters) => !_isEmpty(getters[vuexTypes.account]) &&
      !getters[vuexTypes.isKycRecoveryInProgress],
  },
  state: {},
}

let store
function buildStore () {
  store = new Vuex.Store({
    ...rootModule,
    modules: {
      account,
      assets,
      factors,
      wallet,
      kyc,
      identities,
      keyValue,
      idleHandler,
      kycRecovery,
      movementsHistory,
      sponsorshipRequests,
      businesses,
    },
    plugins: [sessionStoragePlugin],
  })

  store.commit(vuexTypes.POP_STATE)

  return store
}
buildStore()

export { store, buildStore }
export { vuexTypes } from './types'
