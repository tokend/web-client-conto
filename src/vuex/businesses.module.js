import { vuexTypes } from './types'
import { api } from '../api'
import { BusinessRecord } from '@/js/records/entities/business.record'

export const state = {
  myBusinesses: [],
}

export const mutations = {
  [vuexTypes.SET_MY_BUSINESSES] (state, businesses) {
    state.myBusinesses = businesses
  },
  [vuexTypes.CONCAT_MY_BUSINESSES] (state, businesses) {
    state.myBusinesses = state.myBusinesses.concat(businesses)
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
      commit(vuexTypes.SET_MY_BUSINESSES, response.data)
    }
  },
}

export const getters = {
  [vuexTypes.myBusinesses]: state => state.myBusinesses
    .map(item => new BusinessRecord(item)),
}

export default {
  state,
  mutations,
  actions,
  getters,
}
