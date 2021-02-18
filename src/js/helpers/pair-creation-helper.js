import { store, vuexTypes } from '@/vuex'
import { base, ASSET_PAIR_POLICIES } from '@tokend/js-sdk'

export function buildPairCreationRequestOperation (assetCode, price) {
  const opts = {
    base: assetCode,
    quote: store.getters[vuexTypes.businessStatsQuoteAsset],
    action: base.xdr.ManageAssetPairAction.create(),
    policies: +ASSET_PAIR_POLICIES.tradeableSecondaryMarket,
    physicalPrice: '' + price,
    physicalPriceCorrection: '1',
    maxPriceStep: '1',
  }

  return base.Operation.manageAssetPair(opts)
}
