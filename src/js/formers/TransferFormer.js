import { Former } from './Former'
import { base } from '@tokend/js-sdk'
// import { getCounterparty } from '@/js/helpers/fees-helper'

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
        destination: '',
        sourceBalanceId: '',
        fee: {
          sourceFee: {
            percent: '0',
            fixed: '0',
          },
          destinationFee: {
            percent: '0',
            fixed: '0',
          },
        },
        subject: '',
        assetCode: '',
        isPaidFeeForRecipient: false,
      }
    }

    buildOps () {
      const attrs = this.attrs

      return base.PaymentBuilder.payment({
        sourceBalanceId: attrs.sourceBalanceId,
        destination: attrs.destination,
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
}
