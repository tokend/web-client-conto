import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { ATOMIC_SWAP_REQUEST_TYPES } from '@/js/const/atomic-swap.const'
import { store, vuexTypes } from '@/vuex'
import { PAYMENT_METHODS } from '@/js/const/payment-methods.const'

// eslint-disable-next-line max-len
export async function createAtomicSwapAsk ({ baseAssetCode, amount, price, quoteAssets }) {
  const paymentTx = await _getPaymentTx(baseAssetCode, amount)

  const atomicSwapAskOperation = _buildCreateAtomicSwapAskOperation(
    paymentTx,
    baseAssetCode,
    price,
    quoteAssets
  )
  await api.postWithSignature('/integrations/marketplace/offers', atomicSwapAskOperation)
}

async function _getPaymentTx (baseAssetCode, amount) {
  const { _rawResponse: marketplace } = await api.getWithSignature('/integrations/marketplace/info')
  const paymentAccount = marketplace.data.attributes.payment_account
  const paymentOperation = _getPaymentOperation(
    paymentAccount,
    amount,
    baseAssetCode
  )
  const tx = await api.getTransaction(paymentOperation)
  return tx
}

// eslint-disable-next-line max-len
function _buildCreateAtomicSwapAskOperation (paymentTx, baseAssetCode, price, quoteAssets) {
  const paymentQuoteAssets = quoteAssets.map(quoteAsset => {
    return {
      id: _getCreatePaymentMethodId(quoteAsset),
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
      id: _getCreatePaymentMethodId(quoteAsset),
      type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
    }
  })

  const operation = {
    data: {
      type: ATOMIC_SWAP_REQUEST_TYPES.createOffer,
      attributes: {
        payment_tx_envelope: paymentTx,
        price: price,
        price_asset: store.getters[vuexTypes.statsQuoteAsset].code,
        base_asset: baseAssetCode,
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
}

function _getPaymentOperation (destinationAccountId, amount, baseAssetCode) {
  return base
    .PaymentBuilder.payment({
      // eslint-disable-next-line max-len
      sourceBalanceId: store.getters[vuexTypes.accountBalanceByCode](baseAssetCode).id,
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
}

function _getCreatePaymentMethodId (quoteAsset) {
  // fix duplicate two some asset code with different type
  return quoteAsset.type === PAYMENT_METHODS.internal.value
    ? `I${store.getters[vuexTypes.statsQuoteAsset].code}`
    : quoteAsset.asset.code
}

// eslint-disable-next-line max-len
export async function updateAtomicSwapAsk ({ atomicSwapId, baseAssetCode, amount, price }) {
  let attributes = {}

  if (amount) {
    const paymentTx = await _getPaymentTx(baseAssetCode, amount)
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
}
