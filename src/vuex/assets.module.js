import { vuexTypes } from './types'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { api } from '@/api'

const ASSETS_PAGE_LIMIT = 100

export const state = {
  assets: [],
}

export const mutations = {
  [vuexTypes.SET_ASSETS] (state, assets) {
    state.assets = assets
  },

  [vuexTypes.UPDATE_ASSETS] (state, newAssets) {
    for (const asset of newAssets) {
      const foundIndex = state.assets
        .findIndex(item => item.id === asset.id)

      if (foundIndex !== -1) {
        state.assets[foundIndex] = asset
      }
    }
  },
}

export const actions = {
  async [vuexTypes.LOAD_ASSETS] ({ commit }) {
    let pageResponse
    let assets

    pageResponse = await api.get('/v3/assets', {
      page: { limit: ASSETS_PAGE_LIMIT },
    })
    assets = pageResponse.data

    while (pageResponse.data.length === ASSETS_PAGE_LIMIT) {
      pageResponse = await pageResponse.fetchNext()
      assets.push(...pageResponse.data)
    }

    commit(vuexTypes.SET_ASSETS, assets)
  },
}

export const getters = {
  [vuexTypes.assets]: state => state.assets.map(a => new AssetRecord(a)),
  [vuexTypes.assetByCode]: (_, getters) => assetCode =>
    getters[vuexTypes.assets].find(item => item.code === assetCode),
  [vuexTypes.assetsByOwner]: (_, getters) => accountId =>
    getters[vuexTypes.assets].filter(item => item.owner === accountId),

  [vuexTypes.ownedAssets]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.assets]
      .filter(item => item.owner === rootGetters[vuexTypes.accountId]),

  [vuexTypes.activeOwnedAssets]: (a, getters) =>
    getters[vuexTypes.ownedAssets]
      .filter(item => item.isActive),

  [vuexTypes.balancesAssets]: (a, getters, b, rootGetters) => {
    return rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
  },

  // eslint-disable-next-line max-len
  [vuexTypes.balancesAssetsByOwner]: (a, getters, b, rootGetters) => accountId => {
    return rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.owner === accountId)
  },

  [vuexTypes.balancesBaseAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.isBaseAsset),
  [vuexTypes.depositableAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.isDepositable),
  [vuexTypes.coinpaymentsAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.isCoinpayments),
  [vuexTypes.withdrawableBalancesAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.isWithdrawable),
  [vuexTypes.statsQuoteAsset]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.assets]
      .filter(item => {
        return item.isStatsQuoteAsset
      })[0] || {},
  [vuexTypes.ownedBalancesAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.owner === rootGetters[vuexTypes.accountId]),
  [vuexTypes.baseMarketplaceOfferBalancesAssets]:
    (a, getters, b, rootGetters) =>
      rootGetters[vuexTypes.accountOwnedAssetsBalances]
        .map(item => item.asset)
        .filter(item => item.isBaseInMarketplace),
  [vuexTypes.quoteMarketplaceOfferAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.assets]
      .filter(item => item.isQuoteInMarketplace),
  [vuexTypes.baseAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.assets]
      .filter(item => item.isBaseAsset),
}

export default {
  state,
  mutations,
  actions,
  getters,
}
