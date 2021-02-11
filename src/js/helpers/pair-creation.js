import { store, vuexTypes } from '@/vuex'
import { base, ASSET_PAIR_POLICIES } from '@tokend/js-sdk'

export function buildPairCreationRequestOperation () {
  const opts = {
    base: this.attrs.assetCode,
    quote: store.gettes[vuexTypes.businessStatsQuoteAsset],
    action: base.xdr.ManageAssetPairAction.create(),
    policies: +ASSET_PAIR_POLICIES.tradeableSecondaryMarket,
    physicalPrice: '' + this.attrs.price,
    physicalPriceCorrection: '1',
    maxPriceStep: '1',
  }

  return base.Operation.manageAssetPair(opts)
}
