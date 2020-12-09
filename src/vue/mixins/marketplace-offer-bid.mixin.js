import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import { api } from '@/api'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { MARKETPLACE_OFFER_REQUEST_TYPES } from '@/js/const/marketplace-offer-request-types.const'
import { MarketplaceOfferBidRecord } from '@/js/records/entities/marketplace-offer-bid.record'

export default {
  mixins: [ IdentityGetterMixin ],
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isLoggedIn: vuexTypes.isLoggedIn,
    }),
  },

  methods: {
    // eslint-disable-next-line max-len
    async createMarketplaceOfferBidOperation (amount, paymentMethodId, marketplaceOfferAskId, promoCode, email) {
      let accountId = this.accountId

      if (email) {
        const senderAccountId = await this.getAccountIdByIdentifier(email)
        if (senderAccountId) {
          accountId = senderAccountId
        } else {
          accountId = await this.createAccountAndGetAccountIdByEmail(email)
        }
      }

      const marketplaceOfferBidOperation =
        this.buildCreateMarketplaceOfferBidOperation(
          amount,
          paymentMethodId,
          marketplaceOfferAskId,
          promoCode,
          accountId
        )
      const { data } = await api.post(
        '/integrations/marketplace/buy',
        marketplaceOfferBidOperation
      )
      return new MarketplaceOfferBidRecord(data)
    },

    // eslint-disable-next-line max-len
    buildCreateMarketplaceOfferBidOperation (amount, paymentMethodId, marketplaceOfferAskId, promoCode, accountId) {
      return {
        data: {
          type: MARKETPLACE_OFFER_REQUEST_TYPES.createBuyRequest,
          attributes: {
            amount: amount,
            offer_id: Number(marketplaceOfferAskId),
            payment_method_id: Number(paymentMethodId),
            sender_account_id: accountId,
            ...(promoCode
              ? { promocode: promoCode }
              : {}
            ),
          },
        },
      }
    },
  },
}
