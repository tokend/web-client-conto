import { Former } from './Former'
import { base } from '@tokend/js-sdk'

/**
 * Collects the attributes for mass-payment operations
 * @class
 * @implements {Former}
 */
export class MassPaymentFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  /**
   * @param {Array} assets
   *   [{ code: '', amount: '', balanceId: '' } ]
   * @param {Array} destinations [ { receiverId: '' } ]
   */
  get _defaultAttrs () {
    return {
      assets: [],
      destinations: [],
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
      isPaidFeeForRecipient: false,
      subject: '',
    }
  }

  async buildOps () {
    const operations = []
    this.attrs.destinations.forEach((destination) => {
      this.attrs.assets.forEach((asset) => {
        if (destination.receiverId) {
          const operation = {
            sourceBalanceId:
              asset.balanceId,
            destination: destination.receiverId,
            amount: String(asset.amount),
            feeData: {
              sourceFee: {
                percent: this.attrs.fee.sourceFee.percent,
                fixed: this.attrs.fee.sourceFee.fixed,
              },
              destinationFee: {
                percent: this.attrs.fee.destinationFee.percent,
                fixed: this.attrs.fee.destinationFee.fixed,
              },
            },
            isPaidFeeForRecipient: this.attrs.isPaidFeeForRecipient,
            subject: this.attrs.subject,
            asset: asset.code,
          }
          operations.push(operation)
        }
      })
    })

    if (operations.length) {
      const results = operations.map(operation =>
        base.PaymentBuilder.payment(operation))
      return results
    }
  }
}
