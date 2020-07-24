import AtomicSwapAskMixin from '@/vue/mixins/atomic-swap-ask.mixin'
import { base, ASSET_PAIR_POLICIES, Document } from '@tokend/js-sdk'

import { api } from '@/api'
import config from '@/config'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/index'
import { DateUtil } from '@/js/utils'
import { keyValues } from '@/key-values'

const NEW_CREATE_ASSET_REQUEST_ID = '0'

export default {
  mixins: [AtomicSwapAskMixin],
  data () {
    return {
      collectedAttributes: {},
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.businessStatsQuoteAsset,
      vuexTypes.accountId,
    ]),
  },

  methods: {
    ...mapActions([
      vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    ]),

    collectAssetAttributes (newAttributes) {
      Object.assign(this.collectedAttributes, newAttributes)
    },

    /**
     * Submits "create asset request" operation
     * @param {string|number} requestId - request Id
     */
    async submitCreateAssetRequest (requestId) {
      const assetDocuments = [
        this.collectedAttributes.logo,
        this.collectedAttributes.terms,
      ]
      await Document.uploadDocumentsDeep(assetDocuments)

      await api.postOperations(
        this.$buildAssetCreationRequestOperation(requestId),
        this.$buildPairCreationRequestOperation(),
      )

      await this.LOAD_ACCOUNT_BALANCES_DETAILS()
      await api.postOperations(
        this.$buildIssuanceCreationOperation()
      )

      if (this.collectedAttributes.isSellable) {
        await this.createAtomicSwapAsk({
          baseAssetCode: this.collectedAttributes.code,
          amount: this.collectedAttributes.amountToSell,
          price: this.collectedAttributes.price,
          quoteAssets: this.collectedAttributes.quoteAssets,
        })
      }
    },

    $buildAssetCreationRequestOperation (requestId) {
      const logo = this.collectedAttributes.logo
      const terms = this.collectedAttributes.terms

      const opts = {
        requestID: requestId ? String(requestId) : NEW_CREATE_ASSET_REQUEST_ID,
        trailingDigitsCount: config.DECIMAL_POINTS,
        code: this.collectedAttributes.code,
        policies: this.collectedAttributes.policies,
        assetType: String(keyValues.assetTypeDefault),
        maxIssuanceAmount: config.MAX_AMOUNT,
        preissuedAssetSigner: config.NULL_ASSET_SIGNER,
        initialPreissuedAmount: config.MAX_AMOUNT,
        creatorDetails: {
          name: this.collectedAttributes.name,
          logo: logo,
          terms: terms,
          stellar: {},
          description: this.collectedAttributes.description,
          ...(this.collectedAttributes.expirationDate
            ? { 'expires_at': DateUtil.toTimestamp(this.collectedAttributes.expirationDate) }
            : {}
          ),
        },
      }

      return base.ManageAssetBuilder.assetCreationRequest(opts)
    },

    $buildPairCreationRequestOperation () {
      const opts = {
        base: this.collectedAttributes.code,
        quote: this.businessStatsQuoteAsset,
        action: base.xdr.ManageAssetPairAction.create(),
        policies: +ASSET_PAIR_POLICIES.tradeableSecondaryMarket,
        physicalPrice: '' + this.collectedAttributes.price,
        physicalPriceCorrection: '1',
        maxPriceStep: '1',
      }

      return base.Operation.manageAssetPair(opts)
    },

    $buildIssuanceCreationOperation () {
      const balance = this.accountBalanceByCode(this.collectedAttributes.code)

      const operation = base.CreateIssuanceRequestBuilder
        .createIssuanceRequest({
          asset: this.collectedAttributes.code,
          amount: config.MAX_AMOUNT,
          receiver: balance.id,
          reference: btoa(Math.random()),
          creatorDetails: {},
        })

      return operation
    },
  },
}
