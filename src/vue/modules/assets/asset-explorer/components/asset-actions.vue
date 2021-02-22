<template>
  <div class="asset-actions">
    <template v-if="isLoaded">
      <form-confirmation
        v-if="isConfirmationShown"
        message-id="assets.delete-asset-message"
        ok-button-text-id="assets.delete-btn"
        :is-pending="isAssetDeleting"
        is-danger-color
        @ok="deleteAsset"
        @cancel="isConfirmationShown = false"
      />

      <template v-else>
        <button
          v-ripple
          class="app__button-raised asset-actions__btn"
          @click="$emit(EVENTS.transfer, asset.code)"
        >
          {{ 'assets.send-btn' | globalize }}
        </button>

        <button
          v-if="!isAssetOwner"
          v-ripple
          class="app__button-raised asset-actions__btn"
          @click="isRedeemDrawerShown = true"
        >
          {{ 'assets.redeem-btn' | globalize }}
        </button>

        <button
          v-if="isAssetOwner"
          v-ripple
          class="app__button-raised asset-actions__btn"
          @click="$emit(EVENTS.updateAsset)"
        >
          {{ 'assets.update-btn' | globalize }}
        </button>

        <button
          v-if="isAssetOwner"
          v-ripple
          class="app__button-raised asset-actions__btn"
          @click="isConfirmationShown = true"
        >
          {{ 'assets.delete-btn' | globalize }}
        </button>

        <button
          v-if="!isAssetOwner && isBuyOrderExists"
          v-ripple
          class="app__button-raised asset-actions__btn"
          @click="isRefundAssetDrawerShown = true"
        >
          {{ 'assets.refund-btn' | globalize }}
        </button>
      </template>
    </template>
    <template v-else>
      <loader
        message-id="assets.buy-order-loading"
      />
    </template>

    <drawer :is-shown.sync="isRedeemDrawerShown">
      <template slot="heading">
        {{ 'redeem-form.form-heading' | globalize }}
      </template>
      <redeem-form
        :asset-code="asset.code"
      />
    </drawer>

    <drawer :is-shown.sync="isRefundAssetDrawerShown">
      <template slot="heading">
        {{ 'refund-asset-form.form-heading' | globalize }}
      </template>
      <refund-asset-form
        :asset-code="asset.code"
        :former="former"
        @operation-submitted="(isRefundAssetDrawerShown = false) ||
          (loadBuyOrder() && $emit(EVENTS.assetRefunded))
        "
      />
    </drawer>
  </div>
</template>

<script>
import FormConfirmation from '@/vue/common/FormConfirmation'
import RedeemForm from '@/vue/forms/RedeemForm'
import Drawer from '@/vue/common/Drawer'
import Loader from '@/vue/common/Loader'
import RefundAssetForm from '@/vue/forms/RefundAssetForm'

import { AssetRecord } from '@/js/records/entities/asset.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { OrderRecord } from '@/js/records/entities/order.record'
import { BuybackFormer } from '@/js/formers/BuybackFormer'

const EVENTS = {
  updateAsset: 'update-asset',
  assetDeleted: 'asset-deleted',
  transfer: 'transfer',
  assetRefunded: 'asset-refunded',
}

export default {
  name: 'asset-actions',

  components: {
    RedeemForm,
    Drawer,
    FormConfirmation,
    Loader,
    RefundAssetForm,
  },
  props: {
    asset: { type: AssetRecord, required: true },
    former: { type: BuybackFormer, default: () => new BuybackFormer() },
  },
  data: _ => ({
    isRedeemDrawerShown: false,
    isPending: false,
    isAssetDeleting: false,
    isConfirmationShown: false,
    EVENTS,
    isRefundAssetDrawerShown: false,
    isLoaded: true,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.statsQuoteAsset,
      vuexTypes.accountBalanceByCode,
    ]),

    isAssetOwner () {
      return this.asset.owner === this.accountId
    },

    isBuyOrderExists () {
      return Boolean(this.former.attrs.requestId)
    },
  },

  async created () {
    if (!this.isAssetOwner) {
      await this.loadBuyOrder()
    }
    this.former.setAttr('baseBalance',
      this.accountBalanceByCode(this.asset.code).id)

    const quoteBalance =
      this.accountBalanceByCode(this.statsQuoteAsset.code)
    this.former.setAttr('quoteBalance', quoteBalance.id)
  },

  methods: {
    async deleteAsset () {
      this.isAssetDeleting = true
      const operation = base.RemoveAssetOpBuilder
        .removeAssetOp({
          code: this.asset.code,
        })
      try {
        await this.deleteAssetPairs()
        await api.postOperations(operation)
        Bus.success('asset-actions.asset-deleted-msg')
        this.$emit(EVENTS.assetDeleted)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isAssetDeleting = false
    },
    async deleteAssetPairs () {
      const { data } = await api.get('/v3/asset_pairs', {
        filter: { asset: this.asset.code },
      })
      const promises = data.map(async assetPair => {
        let response = await api.postOperations(base.RemoveAssetPairOpBuilder
          .removeAssetPairOp({
            base: assetPair.baseAsset.id,
            quote: assetPair.quoteAsset.id,
          }))
        return response
      })
      await Promise.all(promises)
    },

    async loadBuyOrder () {
      this.isLoaded = false
      try {
        const endpoint = `/v3/order_books/${this.asset.code}:${this.statsQuoteAsset.code}:${SECONDARY_MARKET_ORDER_BOOK_ID}`
        const { data: orderBook } = await api.get(endpoint, {
          include: ['buy_entries'],
        })

        const buyOrder = new OrderRecord(orderBook.buyEntries[0])
        this.former.populate(buyOrder)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isLoaded = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.asset-actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: -1rem;
}

.asset-actions__btn {
  max-width: 12rem;
  width: 100%;
  margin-top: 1rem;
}

</style>
