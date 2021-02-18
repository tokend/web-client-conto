import { api } from '@/api'
import { getPaymentOperation } from '@/js/helpers/payment-operation-helper'

export async function getPaymentTx (baseAssetCode, amount) {
  const { _rawResponse: marketplace } = await api.getWithSignature('/integrations/marketplace/info')
  const paymentAccount = marketplace.data.attributes.payment_account
  const paymentOperation = getPaymentOperation({
    destinationAccountId: paymentAccount,
    amount: amount,
    assetCode: baseAssetCode,
    subject: '',
  })
  const tx = await api.getTransaction(paymentOperation)
  return tx
}
