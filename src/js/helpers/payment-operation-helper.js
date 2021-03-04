import { base } from '@tokend/js-sdk'
import { store, vuexTypes } from '@/vuex'

// eslint-disable-next-line max-len
export function getPaymentOperation ({ destinationAccountId, amount, assetCode, subject }) {
  return base
    .PaymentBuilder.payment({
      sourceBalanceId:
        store.getters[vuexTypes.accountBalanceByCode](assetCode).id,
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
      subject: subject,
      asset: assetCode,
    })
}
