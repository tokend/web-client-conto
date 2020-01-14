import _get from 'lodash/get'
import { vuexTypes } from './types'
import { api } from '../api'
import { BalanceRecord } from '@/js/records/entities/balance.record'

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
    const response = await api.getWithSignature(`/v3/accounts/${accountId}`, {
      include: ['external_system_ids', 'balances', 'balances.state', 'balances.asset'],
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
    const isKycRecoveryInProgress = rootGetters[vuexTypes.isKycRecoveryInProgress]
    if (isKycRecoveryInProgress) {
      await dispatch(vuexTypes.SEND_KYC_RECOVERY_REQUEST)
    }

    await dispatch(vuexTypes.LOAD_KV_ENTRIES)
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

  [vuexTypes.isAccountGeneral]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryGeneralRoleId],
  [vuexTypes.isAccountUsAccredited]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryUsAccreditedRoleId],
  [vuexTypes.isAccountUsVerified]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryUsVerifiedRoleId],
  [vuexTypes.isAccountCorporate]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryCorporateRoleId],
  [vuexTypes.isAccountUnverified]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryUnverifiedRoleId],
  [vuexTypes.isAccountBlocked]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryBlockedRoleId],
}

export default {
  state,
  mutations,
  actions,
  getters,
}
