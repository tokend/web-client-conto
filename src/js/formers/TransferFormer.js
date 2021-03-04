import { Former } from './Former'
import { getPaymentOperation } from '@/js/helpers/payment-operation-helper'
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
        subject: '',
        assetCode: '',
      }
    }

    buildOps () {
      const operation = getPaymentOperation({
        destinationAccountId: this.attrs.destination,
        amount: this.attrs.amount,
        assetCode: this.attrs.assetCode,
        subject: this.attrs.subject,
      })
      return operation
    }
}
