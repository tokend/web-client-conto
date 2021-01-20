import _get from 'lodash/get'
import { vuexTypes } from './types'
import { api } from '../api'
import { keyValues } from '@/key-values'
import { getCurrentAccId } from '@/js/helpers/api-helpers'
import { buildKycRecoveryOp } from '@/js/helpers/kyc-helpers'
import { ACCOUNT_KYC_RECOVERY_STATES } from '@/js/const/account-kyc-recovery-states.const'

export const state = {
  account: {},
  balancesDetails: [],
}

export const mutations = {
  [vuexTypes.SET_ACCOUNT] (state, account) {
    state.account = account
  },

  [vuexTypes.SET_ACCOUNT_BALANCES_DETAILS] (state, balancesDetails) {
    state.balancesDetails = balancesDetails
  },
}

export const actions = {
  async [vuexTypes.LOAD_ACCOUNT] ({ commit }, accountId) {
    accountId = accountId || getCurrentAccId()
    const response = await api.getWithSignature(`/v3/accounts/${accountId}`, {
      include: ['external_system_ids', 'balances', 'balances.state', 'balances.asset', 'kyc_data'],
    })
    commit(vuexTypes.SET_ACCOUNT, response.data)
  },

  async [vuexTypes.INIT_ACCOUNT] ({ getters, dispatch, rootGetters }) {
    await dispatch(vuexTypes.LOAD_ACCOUNT, getters[vuexTypes.walletAccountId])

    // eslint-disable-next-line max-len
    const isAccountKycRecoveryInProgress = rootGetters[vuexTypes.isAccountKycRecoveryInProgress]
    if (isAccountKycRecoveryInProgress) {
      await api.postOperations(buildKycRecoveryOp())
      // Load account for update kyc recovery status
      await dispatch(vuexTypes.LOAD_ACCOUNT, getters[vuexTypes.walletAccountId])
    }

    await dispatch(vuexTypes.LOAD_KYC)
  },
}

export const getters = {
  [vuexTypes.account]: state => state.account,
  [vuexTypes.accountId]: state => state.account.id,
  [vuexTypes.accountRoleId]: state => Number(
    _get(state.account, 'role.id')
  ),
  [vuexTypes.accountDepositAddresses]: state =>
    state.account.externalSystemIds || {},

  [vuexTypes.isAccountGeneral]: (a, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.generalRoleId,
  [vuexTypes.isAccountUsAccredited]: (a, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.usAccreditedRoleId,
  [vuexTypes.isAccountUsVerified]: (a, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.usVerifiedRoleId,
  [vuexTypes.isAccountCorporate]: (a, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.corporateRoleId,
  [vuexTypes.isAccountUnverified]: (a, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.unverifiedRoleId,
  [vuexTypes.isAccountBlocked]: (a, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.blockedRoleId,
  [vuexTypes.accountKycBlob]: state =>
    _get(state, 'account.kycData.kycData.blobId'),

  [vuexTypes.accountKycRecoveryStatus]: state =>
    _get(state.account, 'kycRecoveryStatus.value', 0),

  [vuexTypes.isAccountKycRecoveryInProgress]: (_, getters) => {
    const state = getters[vuexTypes.accountKycRecoveryStatus]
    if (!state) return false
    return Object.values(ACCOUNT_KYC_RECOVERY_STATES).includes(state)
  },

  [vuexTypes.isAccountKycRecoveryInitiated]: (_, getters) => {
    const state = getters[vuexTypes.accountKycRecoveryStatus]
    return state === ACCOUNT_KYC_RECOVERY_STATES.initiated
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
