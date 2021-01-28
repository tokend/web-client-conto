import { api } from '@/api'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import AccountGetterMixin from './account-getter'

export default {
  mixins: [AccountGetterMixin],

  computed: {
    ...mapGetters([
      vuexTypes.emailByAccountId,
      vuexTypes.phoneNumberByAccountId,
      vuexTypes.telegramUsernameByAccountId,
    ]),
  },
  methods: {
    ...mapActions([
      vuexTypes.LOAD_IDENTITIES_BY_ACCOUNT_ID,
    ]),
    ...mapMutations([
      vuexTypes.SET_IDENTITIES,
    ]),
    /**
     * Fetches an account id by email
     *
     * @param {string} identifier(email or phone number)
     * @param {*} [defaultValue] Value returned if no email found. If not set an
     * instance of `UserDoesntExistError` thrown
     */
    async getAccountIdByIdentifier (identifier, defaultValue) {
      if (typeof identifier !== 'string') {
        throw new TypeError(`getAccountIdByIdentifier(): 'email' arg should be a string, got ${identifier}`)
      }

      const { data } = await api.get('/identities', {
        filter: { identifier: identifier.toLowerCase() },
        page: { limit: 1 },
      })

      if (data && data[0]) {
        this.SET_IDENTITIES(data[0])
        return data[0].address
      } else if (defaultValue !== undefined) {
        return defaultValue
      } else {
        return ''
      }
    },

    /**
     * Fetches an array of account IDs. If no account ID found for a provided
     * email, the result will not contain this entry.
     *
     * @param {string[]} emails
     * @returns {string[]} array of account IDs
     */
    async getAccountIdByEmailMass (emails = []) {
      // TODO: add an ability to return objects like { email: result }
      // so the user can know which emails were not found

      const accountIds = await Promise.all(
        emails.map(email => this.getAccountIdByIdentifier(email, null))
      )

      return accountIds.filter(item => item)
    },

    /**
     * Fetches first balance ID of asset code of account with the provided email
     *
     * @param {string} email
     * @param {string} assetCode A valid asset code
     * @param {*} [defaultValue] Value returned if no balance ID found.
     * If not set an instance of `BalanceNotFoundError` or
     * `UserDoesntExistError` thrown
     */
    async getBalanceIdByEmail (email, assetCode, defaultValue) {
      const accId = await this.getAccountIdByIdentifier(email, defaultValue)
      const balId = await this.getBalanceId(accId, assetCode, defaultValue)
      return balId
    },

    /**
     * Fetches an array of balance IDs. If no balance ID found for a provided
     * email, the result will not contain this entry.
     *
     * @param {string[]} emails
     * @param {string} assetCode A valid asset code
     * @returns {string[]} array of account IDs
     */
    async getBalanceIdByEmailMass (emails, assetCode) {
      const accIds = await this.getAccountIdByEmailMass(emails)
      const balIds = await this.getBalanceIdMass(accIds, assetCode)
      return balIds
    },

    async getEmailByAccountId (accountId, isUpdate = false) {
      if (this.emailByAccountId(accountId) && !isUpdate) {
        return this.emailByAccountId(accountId)
      } else {
        await this.LOAD_IDENTITIES_BY_ACCOUNT_ID(accountId)
        return this.emailByAccountId(accountId)
      }
    },

    async getPhoneByAccountId (accountId, isUpdate = false) {
      if (this.phoneNumberByAccountId(accountId) && !isUpdate) {
        return this.phoneNumberByAccountId(accountId)
      } else {
        await this.LOAD_IDENTITIES_BY_ACCOUNT_ID(accountId)
        return this.phoneNumberByAccountId(accountId)
      }
    },
    async getTelegramUsernameByAccountId (accountId, isUpdate = false) {
      if (this.telegramUsernameByAccountId(accountId) && !isUpdate) {
        return this.telegramUsernameByAccountId(accountId)
      } else {
        await this.LOAD_IDENTITIES_BY_ACCOUNT_ID(accountId)
        return this.telegramUsernameByAccountId(accountId)
      }
    },

    async createAccountAndGetAccountIdByEmail (email) {
      const { data } = await api.post('/identities', {
        data: {
          type: 'identity',
          attributes: { email: email },
        },
      })
      return data.address
    },
  },
}
