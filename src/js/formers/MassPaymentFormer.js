import { Former } from './Former'
import { base } from '@tokend/js-sdk'

/**
 * Collects the attributes for mass-payment operations
 * @class
 * @implements {Former}
 */
export class MassPaymentFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      receivers: [],
      assetCode: '',
      amount: '',
      sourceBalanceId: '',
      destination: '',
      feeData: {
        sourceFee: {
          percent: '0',
          fixed: '0',
        },
        destinationFee: {
          percent: '0',
          fixed: '0',
        },
      },
      isPaidFeeForRecipient: false,
      subject: '',
    }
  }

  buildOps () {
    const operation = {
      sourceBalanceId: this.attrs.sourceBalanceId,
      destination: this.attrs.destination,
      amount: String(this.attrs.amount),
      feeData: {
        sourceFee: {
          percent: '0',
          fixed: '0',
        },
        destinationFee: {
          percent: '0',
          fixed: '0',
        },
      },
      isPaidFeeForRecipient: false,
      subject: '',
      asset: this.attrs.assetCode,
    }
    return base.PaymentBuilder.payment(operation)
  }
}
