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
        :former="former"
      />
      <!-- eslint-enable max-len -->
    </drawer>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Drawer from '@/vue/common/Drawer'
import BuybackForm from '@/vue/forms/BuybackForm'
import FormConfirmation from '@/vue/common/FormConfirmation'

import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { OfferRecord } from '@/js/records/entities/offer.record'
import { BuybackFormer } from '@/js/formers/BuybackFormer'

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
    former: {
      type: BuybackFormer,
      default: () => new BuybackFormer(),
    },
  },
  data () {
    return {
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
      vuexTypes.accountId,
      vuexTypes.accountBalanceByCode,
      vuexTypes.statsQuoteAsset,
    ]),

    isBuybackOfferExists () {
      return Boolean(this.former.attrs.requestId)
    },
  },

  async created () {
    await this.loadBuybackOffer()
    this.former.setAttr('baseBalance',
      this.accountBalanceByCode(this.assetCode).id)

    this.former.setAttr('quoteBalance',
      this.accountBalanceByCode(this.statsQuoteAsset.code).id)

    this.isLoaded = true
  },

  methods: {
    async loadBuybackOffer () {
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
        const buybackOffer = new OfferRecord(offers[0])
        this.former.populate(buybackOffer)
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async deleteOffer () {
      this.isOfferDeleting = true
      try {
        const operation = this.former.buildOpCancelOffer()
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
