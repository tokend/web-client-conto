import { Former } from './Former'
import { base } from '@tokend/js-sdk'
import { store, vuexTypes } from '@/vuex'

/**
 * Collects the attributes for mass-payment operations
 * @class
 * @implements {Former}
 */
export class MassPaymentFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  /**
   * @param {Array} assetCodeAndAmount [ { code: '', amount: '' } ]
   */
  get _defaultAttrs () {
    return {
      assetCodeAndAmount: [],
      sourceBalanceId: '',
      destinations: [
        {
          email: '',
          receiverId: '',
        },
      ],
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
    for (let i = 0; i < this.attrs.destinations.length; i++) {
      for (let j = 0; j < this.attrs.assetCodeAndAmount.length; j++) {
        let operation = {
          sourceBalanceId:
            // eslint-disable-next-line max-len
            store.getters[vuexTypes.accountBalanceByCode](this.attrs.assetCodeAndAmount[j].code).id,
          destination: this.attrs.destinations[i].receiverId,
          amount: String(this.attrs.assetCodeAndAmount[j].amount),
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
          asset: this.attrs.assetCodeAndAmount[j].code,
        }

        operations.push(operation)
      }
    }
    if (operations.length) {
      let results = base.PaymentBuilder.payment(...operations)
      return results
    }
  }
}
