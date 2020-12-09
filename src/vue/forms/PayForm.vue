<template>
  <div>
    <form
      v-if="!isMarketplaceOfferBidCreated"
      novalidate
      class="pay-form app__form"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.email"
            @blur="touchField('form.email')"
            name="pay-email"
            :disabled="isLoggedIn"
            :label="'pay-form.email-lbl' | globalize(
              {
                appName: config.APP_NAME,
              }
            )"
            :error-message="getFieldErrorMessage('form.email', {
              length: MAX_FIELD_LENGTH.email
            })"
          />
        </div>
      </div>

      <buy-marketplace-offer-form
        class="pay-form__marketplace-offer-bid"
        @submitted="submit"
        :is-disabled="isDisabled"
        :marketplace-offer-ask="marketplaceOfferAsk"
      />
    </form>

    <address-viewer
      v-else
      :asset-code="form.quoteAssetCode"
      :amount="marketplaceOfferBidDetails.amount"
      :address="marketplaceOfferBidDetails.address"
      :end-time="marketplaceOfferBidDetails.endTime"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import BuyMarketplaceOfferForm from '@/vue/forms/BuyMarketplaceOfferForm'
import AddressViewer from '@/vue/common/address-viewer'
import MarketplaceOfferBidMixin from '@/vue/mixins/marketplace-offer-bid.mixin'
import config from '@/config'

import { required, email, maxLength } from '@validators'
import { MarketplaceOfferAskRecord } from '@/js/records/entities/marketplace-offer-ask.record'
import { MARKETPLACE_OFFER_BID_TYPES } from '@/js/const/marketplace-offer-bid-types.const'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'
import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'

const EVENTS = {
  reloadMarketplaceOffer: 'reload-marketplace-offer',
}

export default {
  name: 'pay-form',
  components: {
    BuyMarketplaceOfferForm,
    AddressViewer,
  },
  mixins: [FormMixin, MarketplaceOfferBidMixin],
  props: {
    marketplaceOfferAsk: {
      type: MarketplaceOfferAskRecord,
      required: true,
    },
  },
  data () {
    return {
      form: {
        email: '',
        amount: '',
        quoteAssetCode: '',
        paymentMethodId: '',
        promoCode: '',
      },
      isDisabled: false,
      marketplaceOfferBidDetails: {
        address: '',
        endTime: -1,
        amount: '',
      },
      config,
      MAX_FIELD_LENGTH,
    }
  },

  validations () {
    return {
      form: {
        email: {
          required,
          email,
          maxLength: maxLength(MAX_FIELD_LENGTH.email),
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.walletEmail,
    ]),

    isMarketplaceOfferBidCreated () {
      return Boolean(this.marketplaceOfferBidDetails.address)
    },
  },

  created () {
    this.form.email = this.walletEmail
  },

  methods: {
    async submit (form) {
      if (!this.isFormValid()) return
      Object.assign(this.form, form)

      this.isDisabled = true
      try {
        // eslint-disable-next-line max-len
        const marketplaceOfferBid = await this.createMarketplaceOfferBidOperation(
          this.form.amount,
          this.form.paymentMethodId,
          this.marketplaceOfferAsk.id,
          this.form.promoCode,
          this.form.email
        )
        switch (marketplaceOfferBid.type) {
          case MARKETPLACE_OFFER_BID_TYPES.redirect:
            window.location.href = marketplaceOfferBid.payUrl
            break
          case MARKETPLACE_OFFER_BID_TYPES.cryptoInvoice:
            this.marketplaceOfferBidDetails = marketplaceOfferBid
            break
          case MARKETPLACE_OFFER_BID_TYPES.internal:
            await api.signAndSendTransaction(marketplaceOfferBid.tx)
            Bus.success('pay-form.success-msg')
            this.$emit(EVENTS.reloadMarketplaceOffer)
            break
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isDisabled = false
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';

  .pay-form__marketplace-offer-bid {
    margin-top: 2.4rem;
  }
</style>
