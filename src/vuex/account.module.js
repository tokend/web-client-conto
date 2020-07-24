import _get from 'lodash/get'
import { vuexTypes } from './types'
import { api } from '../api'
import { BalanceRecord } from '@/js/records/entities/balance.record'
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

  async [vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS] (
    { commit, rootGetters, getters }
  ) {
    const accountId = getters[vuexTypes.accountId]
    // eslint-disable-next-line max-len
    const businessStatsQuoteAsset = rootGetters[vuexTypes.businessStatsQuoteAsset]

    const endpoint = `/v3/accounts/${accountId}/converted_balances/${businessStatsQuoteAsset}`
    const { data } = await api.getWithSignature(endpoint, {
      include: ['states', 'balance', 'balance.state', 'balance.asset'],
    })

    const balances = data.states.map(state => state.balance)

    commit(
      vuexTypes.UPDATE_ASSETS,
      balances.map(b => b.asset),
      { root: true }
    )
    commit(vuexTypes.SET_ACCOUNT_BALANCES_DETAILS, data.states)
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

    const isAccountCorporate = getters[vuexTypes.isAccountCorporate]
    if (isAccountCorporate) {
      await dispatch(
        vuexTypes.LOAD_BUSINESS,
        rootGetters[vuexTypes.accountId]
      )
    }
    await dispatch(vuexTypes.LOAD_MY_BUSINESSES)
    await dispatch(vuexTypes.LOAD_ASSETS)
    await dispatch(vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS)
  },
}

export const getters = {
  [vuexTypes.account]: state => state.account,
  [vuexTypes.accountId]: state => state.account.id,
  [vuexTypes.accountBalances]: state => state.balancesDetails
    .map(item => new BalanceRecord(item, item.balance.asset.trailingDigits)),
  [vuexTypes.accountBalancesByOwner]: (state, getters) => owner => {
    return getters[vuexTypes.accountBalances]
      .filter(item => item.asset.owner === owner)
  },
  [vuexTypes.accountOwnedAssetsBalances]: state => state.balancesDetails
    .map(item => new BalanceRecord(item, item.balance.asset.trailingDigits))
    .filter(i => i.asset.owner === state.account.id) || [],
  [vuexTypes.transferableAssetsBalancesByOwner]: (a, getters, b, rootGetters) =>
    accountId =>
      getters[vuexTypes.accountBalances]
        .filter(item => item.asset.isTransferable)
        .filter(item => item.asset.owner === accountId),
  [vuexTypes.transferableAssetsBalances]: (a, getters) =>
    getters[vuexTypes.accountBalances]
      .filter(item => item.asset.isTransferable),
  [vuexTypes.accountBalanceByCode]: state => code => state.balancesDetails
    .map(item => new BalanceRecord(item, item.balance.asset.trailingDigits))
    .find(i => i.asset.code === code) || {},
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
}

export default {
  state,
  mutations,
  actions,
  getters,
}
