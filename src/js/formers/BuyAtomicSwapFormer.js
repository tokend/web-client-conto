import { Former } from './Former'
import { ATOMIC_SWAP_REQUEST_TYPES } from '@/js/const/atomic-swap.const'

/**
 * Collects the attributes for buy atomic swap operation
 * @class
 * @implements {Former}
 */
export class BuyAtomicSwapFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        senderId: '',
        paymentMethodId: '',
        offerId: '',
        amount: '',
        type: '',
        promoCode: '',
      }
    }

    buildOp () {
      const opts = {
        data: {
          type: ATOMIC_SWAP_REQUEST_TYPES.createBuyRequest,
          attributes: {
            amount: this.attrs.amount,
            offer_id: Number(this.attrs.offerId),
            payment_method_id: Number(this.attrs.paymentMethodId),
            sender_account_id: this.attrs.senderId,
            ...(this.attrs.promoCode
              ? { promocode: this.attrs.promoCode }
              : {}
            ),
          },
        },
      }

      return opts
    }
}
