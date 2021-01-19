import { Former } from './Former'
import { MathUtil } from '@/js/utils'

/**
 * Collects the attributes for promo-code operations
 * @class
 * @implements {Former}
 */
export class PromoCodeFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      type: 'marketplace-create-promocode',
      description: '',
      promoCode: '',
      promoCodeId: '0',
      numberOfUses: '0',
      numberOfMaxUses: null,
      discount: '',
      offers: [],
    }
  }

  buildOps () {
    const data = {
      data: {
        type: this.attrs.type,
        attributes: {
          description: this.attrs.description,
          code: this.attrs.promoCode,
          max_uses: Number(this.attrs.numberOfMaxUses) || null,
          discount: String(this.attrs.discount / 100),
        },
        relationships: {
          offers: {
            data: this.attrs.offers,
          },
        },
      },
    }
    return data
  }

  buildOpUpdate () {
    const data = {
      data: {
        attributes: {
          discount: String(this.attrs.discount / 100),
          description: this.attrs.description,
          max_uses: Number(this.attrs.numberOfMaxUses),
        },
      },
    }

    return data
  }

  /**
     *
     * @param {Object} source
     * @param {String} description: promo code description
     * @param {String} discount: discount
     * @param {String} maxUses: number of max uses
     * @param {String} code: promo code
     * @param {String} offersId: offers` ids
     */
  populate (source) {
    this.attrs = this._defaultAttrs

    this.attrs.description = source.description
    this.attrs.discount = MathUtil.multiply(source.discount, 100)
    this.attrs.numberOfMaxUses = source.maxUses
    this.attrs.promoCode = source.code
    this.attrs.promoCodeId = source.id
    this.attrs.numberOfUses = +source.used
    this.attrs.offers = source.offersId
  }
}
