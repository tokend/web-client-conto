import { vuexTypes } from './types'
import { api, loadingDataViaLoop } from '../api'
import { BusinessRecord } from '@/js/records/entities/business.record'

export const state = {
  myBusinesses: [],
  allBusinesses: [],
  businessToBrowse: {},
}

export const mutations = {
  [vuexTypes.SET_MY_BUSINESSES] (state, businesses) {
    state.myBusinesses = businesses
  },

  [vuexTypes.SET_ALL_BUSINESSES] (state, businesses) {
    state.allBusinesses = businesses
  },

  [vuexTypes.CONCAT_ALL_BUSINESSES] (state, businesses) {
    state.allBusinesses = state.allBusinesses.concat(businesses)
  },

  [vuexTypes.SELECT_BUSINESS_TO_BROWSE] (state, payload) {
    state.businessToBrowse = payload
  },

  [vuexTypes.CLEAR_BUSINESS_TO_BROWSE] (state) {
    state.businessToBrowse = {}
  },
}

export const actions = {
  // eslint-disable-next-line max-len
  async [vuexTypes.LOAD_MY_BUSINESSES] ({ commit, getters }) {
    const accountId = getters[vuexTypes.accountId]
    const endpoint = `/integrations/dns/clients/${accountId}/businesses`

    const response = await api.getWithSignature(endpoint)
    const data = await loadingDataViaLoop(response)

    commit(vuexTypes.SET_MY_BUSINESSES, data)
  },

  async [vuexTypes.LOAD_ALL_BUSINESSES] () {
    const endpoint = `/integrations/dns/businesses`

    const response = await api.getWithSignature(endpoint)
    return response
  },

  async [vuexTypes.LOAD_BUSINESS] ({ commit, rootGetters, getters }, id) {
    const endpoint = `/integrations/dns/businesses/${id}`
    const { data } = await api.getWithSignature(endpoint)

    commit(vuexTypes.SELECT_BUSINESS_TO_BROWSE, data)
  },
}

export const getters = {
  [vuexTypes.myBusinesses]: state => state.myBusinesses
    .map(item => new BusinessRecord(item)),

  [vuexTypes.allBusinesses]: state => state.allBusinesses
    .map(item => new BusinessRecord(item)),

  [vuexTypes.businessToBrowse]: state =>
    new BusinessRecord(state.businessToBrowse),

  [vuexTypes.isBusinessToBrowse]: state =>
    Object.keys(state.businessToBrowse || {}).length > 0,

  [vuexTypes.businessStatsQuoteAsset]: (a, getters, b, rootGetters) => {
    const businessToBrowse = getters[vuexTypes.businessToBrowse]
    return businessToBrowse.statsQuoteAsset
      ? businessToBrowse.statsQuoteAsset
      : rootGetters[vuexTypes.statsQuoteAsset].code
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
