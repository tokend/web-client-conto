import config from '@/config'
import { base } from '@tokend/js-sdk'
import { api } from '@/api'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ATOMIC_SWAP_REQUEST_TYPES } from '@/js/const/atomic-swap.const'
import { PAYMENT_METHODS } from '@/js/const/payment-methods.const'
import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'

export default {
  computed: {
    ...mapGetters({
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      accountId: vuexTypes.accountId,
      statsQuoteAsset: vuexTypes.statsQuoteAsset,
    }),

    minPrice () {
      return this.statsQuoteAsset.trailingDigitsCount
        ? inputStepByDigitsCount(this.statsQuoteAsset.trailingDigitsCount)
        : inputStepByDigitsCount(config.DECIMAL_POINTS)
    },
  },

  methods: {
    async createAtomicSwapAsk ({ baseAssetCode, amount, price, quoteAssets }) {
      const paymentTx = await this.getPaymentTx(baseAssetCode, amount)

      const atomicSwapAskOperation = this.buildCreateAtomicSwapAskOperation(
        paymentTx,
        baseAssetCode,
        price,
        quoteAssets
      )
      await api.postWithSignature('/integrations/marketplace/offers', atomicSwapAskOperation)
    },

    getPaymentOperation (destinationAccountId, amount, baseAssetCode) {
      return base
        .PaymentBuilder.payment({
          sourceBalanceId: this.accountBalanceId(baseAssetCode),
          destination: destinationAccountId,
          amount: String(amount),
          feeData: {
            sourceFee: {
              percent: '0',
              fixed: '0',
            },
            destinationFee: {
              percent: '0',
              fixed: '0',
            },
            sourcePaysForDest: false,
          },
          subject: '',
          asset: baseAssetCode,
        })
    },

    // eslint-disable-next-line max-len
    buildCreateAtomicSwapAskOperation (paymentTx, baseAssetCode, price, quoteAssets) {
      const paymentQuoteAssets = quoteAssets.map(quoteAsset => {
        return {
          id: this.getCreatePaymentMethodId(quoteAsset),
          type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
          attributes: {
            asset: quoteAsset.asset.code,
            destination: quoteAsset.destination,
            type: Number(quoteAsset.type),
          },
        }
      })

      const quoteAssetsKey = quoteAssets.map(quoteAsset => {
        return {
          id: this.getCreatePaymentMethodId(quoteAsset),
          type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
        }
      })

      const operation = {
        data: {
          type: ATOMIC_SWAP_REQUEST_TYPES.createOffer,
          attributes: {
            payment_tx_envelope: paymentTx,
            price: price,
            price_asset: this.statsQuoteAsset.code,
            base_asset: baseAssetCode,
            buy_limit: '1',
          },
          relationships: {
            payment_methods: {
              data: quoteAssetsKey,
            },
          },
        },
        included: paymentQuoteAssets,
      }

      return operation
    },

    accountBalanceId (assetCode) {
      return this.accountBalanceByCode(assetCode).id
    },

    getCreatePaymentMethodId (quoteAsset) {
      // fix duplicate two some asset code with different type
      return quoteAsset.type === PAYMENT_METHODS.internal.value
        ? `I${this.statsQuoteAsset.code}`
        : quoteAsset.asset.code
    },

    async updateAtomicSwapAsk ({ atomicSwapId, baseAssetCode, amount, price }) {
      let attributes = {}

      if (amount) {
        const paymentTx = await this.getPaymentTx(baseAssetCode, amount)
        attributes.tx = paymentTx
      }

      if (price) {
        attributes.price = price
      }

      await api.patchWithSignature(`/integrations/marketplace/offers/${atomicSwapId}`, {
        data: {
          type: ATOMIC_SWAP_REQUEST_TYPES.createOffer,
          attributes: attributes,
        },
      })
    },

    async getPaymentTx (baseAssetCode, amount) {
      const { _rawResponse: marketplace } = await api.getWithSignature('/integrations/marketplace/info')
      const paymentAccount = marketplace.data.attributes.payment_account
      const paymentOperation = this.getPaymentOperation(
        paymentAccount,
        amount,
        baseAssetCode
      )
      const tx = await api.getTransaction(paymentOperation)
      return tx
    },
  },
}
