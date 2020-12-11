import { Former } from './Former'
import { base } from '@tokend/js-sdk'
import { getCounterparty } from '@/js/helpers/fees-helper'

/**
 * Collects the attributes for transfer-related operations
 * @class
 * @implements {Former}
 */
export class TransferFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        amount: '',
        recipient: '',
        subject: '',
        assetCode: '',
        isPaidFeeForRecipient: false,

        sourceBalanceId: '',
        destination: '',
        recipientAccountId: '',
        fee: {
          sourceFee: {
            percent: '',
            fixed: '',
          },
          destinationFee: {
            percent: '',
            fixed: '',
          },
        },
      }
    }

    buildOps () {
      const attrs = this.attrs

      return base.PaymentBuilder.payment({
        sourceBalanceId: attrs.sourceBalanceId,
        destination: attrs.recipientAccountId,
        amount: attrs.amount,
        feeData: {
          sourceFee: {
            percent: attrs.fee.sourceFee.percent,
            fixed: attrs.fee.sourceFee.fixed,
          },
          destinationFee: {
            percent: attrs.fee.destinationFee.percent,
            fixed: attrs.fee.destinationFee.fixed,
          },
          sourcePaysForDest: attrs.isPaidFeeForRecipient,
        },
        subject: attrs.subject,
        asset: attrs.assetCode,
      })
    }

    // async calculateFees (senderAccountId) {
    //   await this._getCounterparty(this.attrs.recipient)

    //   const response = await calculateFees({
    //     assetCode: this.attrs.assetCode,
    //     amount: this.attrs.amount,
    //     type: FEE_TYPES.paymentFee,
    //     recipientAccountId: this.attrs.recipientAccountId,
    //     senderAccountId: senderAccountId,
    //   })
    //   return response
    // }

    async getCounterparty () {
      const response = await getCounterparty(this.attrs.recipient)
      this.attrs.recipientAccountId = response
      this.attrs.destination = this.attrs.recipientAccountId
      return response
    }
}
