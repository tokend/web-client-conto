import safeGet from 'lodash/get'

import { vuexTypes } from './types'
import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { KYC_RECOVERY_STATES } from '@/js/const/kyc-recovery-states.const'

export const actions = {
  async [vuexTypes.SEND_KYC_RECOVERY_REQUEST] ({ rootGetters }) {
    const opts = {
      targetAccount: rootGetters[vuexTypes.walletAccountId],
      signers: [
        {
          publicKey: rootGetters[vuexTypes.walletPublicKey],
          roleID: String(rootGetters[vuexTypes.kvDefaultSignerRoleId]),
          weight: '1000',
          identity: '1',
          details: {},
        },
      ],
      creatorDetails: {},
    }
    await api.postOperations(base.CreateKYCRecoveryRequestBuilder.create(opts))
  },
}

export const getters = {
  [vuexTypes.accountKycRecoveryStatus]: (state, rootGetters) =>
    safeGet(rootGetters[vuexTypes.account], 'kycRecoveryStatus.value'),
  [vuexTypes.isKycRecoveryInProgress]: (a, getters) =>
    getters[vuexTypes.accountKycRecoveryStatus] !==
    KYC_RECOVERY_STATES.none && !!getters[vuexTypes.accountKycRecoveryStatus],
}

export default {
  actions,
  getters,
}
