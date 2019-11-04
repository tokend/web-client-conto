import { vuexTypes } from './types'
import { api } from '../api'
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

  [vuexTypes.CONCAT_MY_BUSINESSES] (state, businesses) {
    state.myBusinesses = state.myBusinesses.concat(businesses)
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
  async [vuexTypes.LOAD_MY_BUSINESSES] ({ commit, getters }, needResponse = false) {
    const accountId = getters[vuexTypes.accountId]
    const endpoint = `/integrations/dns/clients/${accountId}/businesses`

    const response = await api.getWithSignature(endpoint)
    if (needResponse) {
      return response
    } else {
      if (!response.data) return
      commit(vuexTypes.SET_MY_BUSINESSES, response.data)
    }
  },

  async [vuexTypes.LOAD_ALL_BUSINESSES] () {
    const endpoint = `/integrations/dns/businesses`

    const response = await api.getWithSignature(endpoint)
    return response
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
}

export default {
  state,
  mutations,
  actions,
  getters,
}
