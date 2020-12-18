import { Former } from './Former'

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
      numberOfMaxUses: '',
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
}
