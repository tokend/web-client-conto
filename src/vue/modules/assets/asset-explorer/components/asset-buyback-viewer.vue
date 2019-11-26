<template>
  <div class="asset-buyback-viewer">
    <div class="asset-buyback-viewer__title">
      <h3>
        {{ 'asset-buyback-viewer.buyback-title' | globalize }}
      </h3>
    </div>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'asset-buyback-viewer.error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="isBuybackOfferExists">
          <div class="asset-buyback-viewer__exists-offer-wrp">
            <form-confirmation
              v-if="isConfirmationShown"
              message-id="asset-buyback-viewer.delete-offer-message"
              ok-button-text-id="asset-buyback-viewer.delete-btn"
              :is-pending="isOfferDeleting"
              is-danger-color
              @ok="deleteOffer()"
              @cancel="isConfirmationShown = false"
            />
            <template v-else>
              <button
                v-ripple
                class="app__button-raised asset-buyback-viewer__btn"
                @click="isBuybackDrawerShown = true"
              >
                {{ 'asset-buyback-viewer.update-btn' | globalize }}
              </button>

              <button
                v-ripple
                class="app__button-raised asset-buyback-viewer__btn"
                @click="isConfirmationShown = true"
              >
                {{ 'asset-buyback-viewer.delete-btn' | globalize }}
              </button>
            </template>
          </div>
        </template>

        <template v-else>
          <button
            v-ripple
            class="app__button-raised asset-buyback-viewer__btn"
            @click="isBuybackDrawerShown = true"
          >
            {{ 'asset-buyback-viewer.buyback-btn' | globalize }}
          </button>
        </template>
      </template>
    </template>

    <template v-else>
      <loader
        message-id="asset-buyback-viewer.offer-loading"
      />
    </template>

    <drawer :is-shown.sync="isBuybackDrawerShown">
      <template slot="heading">
        {{ 'buyback-form.form-heading' | globalize }}
      </template>
      <!-- eslint-disable max-len -->
      <buyback-form
        @operation-submitted="(isBuybackDrawerShown = false) || loadBuybackOffer()"
        :asset-code="assetCode"
        :buyback-offer="buybackOffer"
      />
      <!-- eslint-enable max-len -->
    </drawer>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import _isEmpty from 'lodash/isEmpty'
import Drawer from '@/vue/common/Drawer'
import BuybackForm from '@/vue/forms/BuybackForm'
import FormConfirmation from '@/vue/common/FormConfirmation'

import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { base } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  createBuyback: 'create-buyback',
  updateBuyback: 'update-buyback',
}
export default {
  name: 'asset-buyback-viewer',
  components: {
    Loader,
    ErrorMessage,
    Drawer,
    BuybackForm,
    FormConfirmation,
  },
  props: {
    assetCode: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      buybackOffer: {},
      isLoaded: false,
      isLoadFailed: false,
      EVENTS,
      isBuybackDrawerShown: false,
      isOfferDeleting: false,
      isConfirmationShown: false,
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.statsQuoteAsset,
      vuexTypes.accountId,
      vuexTypes.accountBalanceByCode,
    ]),

    isBuybackOfferExists () {
      return !_isEmpty(this.buybackOffer)
    },
  },

  async created () {
    await this.loadBuybackOffer()
    this.isLoaded = true
  },

  methods: {
    async loadBuybackOffer () {
      this.isLoadFailed = false
      this.isLoadFailed = false

      try {
        const { data: offers } = await api.getWithSignature('/v3/offers', {
          filter: {
            owner: this.accountId,
            is_buy: true,
            quote_asset: this.statsQuoteAsset.code,
            base_asset: this.assetCode,
          },
        })
        this.buybackOffer = offers[0] || {}
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async deleteOffer () {
      this.isOfferDeleting = true
      try {
        const operation = base.ManageOfferBuilder.cancelOffer({
          offerID: this.buybackOffer.id,
          orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
          baseBalance: this.accountBalanceByCode(this.assetCode).id,
          quoteBalance: this.accountBalanceByCode(this.statsQuoteAsset.code).id,
        })
        await api.postOperations(operation)
        await this.loadBuybackOffer()
        Bus.success('asset-buyback-viewer.offer-deleted-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isOfferDeleting = false
      this.isConfirmationShown = false
    },
  },
}
</script>

<style lang="scss" scoped>
.asset-buyback-viewer {
  margin-top: 3rem;
}

.asset-buyback-viewer__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-buyback-viewer__exists-offer-wrp {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.asset-buyback-viewer__btn {
  min-width: 12rem;
  margin-top: 1rem;
}
</style>
