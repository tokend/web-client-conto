<template>
  <div class="atomic-swap-attributes">
    <div class="app__table app__table--last-td-to-right">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'atomic-swap-attributes.base-asset-name' | globalize }}
            </td>
            <td>
              {{ atomicSwapAsk.baseAssetName }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'atomic-swap-attributes.amount-key' | globalize }}
            </td>
            <td :title="atomicSwapAsk.amount | formatMoney">
              {{ atomicSwapAsk.amount | formatBalance }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.price-key' | globalize }}
            </td>
            <td :title="atomicSwapAsk.price | formatMoney">
              {{ {
                value: atomicSwapAsk.price,
                currency: statsQuoteAsset.code
              } | formatMoney
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'atomic-swap-attributes.link-to-buy-asset' | globalize }}
            </td>
            <td>
              <span
                class="atomic-swap-attributes__link-getter"
              >
                <span
                  class="atomic-swap-attributes__link-getter-value"
                >
                  {{ url }}
                </span>

                <tooltip
                  :show="isCopiedTooltipShown"
                  :message="'atomic-swap-attributes.link-copied' | globalize"
                >
                  <button
                    class="atomic-swap-attributes__copy-button
                      app__button-icon"
                    :id="`clipboard-btn-${_uid}`"
                    :data-clipboard-text="url"
                    @click="changeBtnIcon"
                  >
                    <i
                      class="mdi atomic-swap-attributes__link-getter-icon"
                      :class="isCopyBtnPressed ?
                        'mdi-clipboard-check' :
                        'mdi-clipboard-text'"
                    />
                  </button>
                </tooltip>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template
      v-if="accountId === atomicSwapAsk.ownerId"
    >
      <div
        v-for="(quoteAsset, index) in atomicSwapAsk.quoteAssets"
        class="app__table app__table--last-td-to-right"
        :key="quoteAsset.asset.code"
      >
        <h4 class="atomic-swap-attributes__quote-asset-header">
          {{ 'atomic-swap-attributes.quote-assets-subheading'
            | globalize({ number: index + 1 })
          }}
        </h4>
        <table>
          <tbody>
            <tr>
              <td>
                {{ 'atomic-swap-attributes.quote-asset-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.asset.code }}
              </td>
            </tr>
            <tr>
              <td>
                {{ 'atomic-swap-attributes.destination-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.destination }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <p class="atomic-swap-attributes__quote-asset-header">
        {{ 'atomic-swap-attributes.buy-for' | globalize }}
        <template
          v-for="(quoteAsset, index) in atomicSwapAsk.quoteAssets"
        >
          {{
            quoteAsset.asset.code
          }}<template
            v-if="atomicSwapAsk.quoteAssets.length - 1 != index"
          >
            ,
          </template>
        </template>
      </p>
    </template>
  </div>
</template>

<script>
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import Tooltip from '@/vue/common/Tooltip'
import Clipboard from 'clipboard'

export default {
  name: 'atomic-swap-attributes',
  components: {
    Tooltip,
  },
  props: {
    atomicSwapAsk: {
      type: AtomicSwapAskRecord,
      required: true,
    },
  },
  data: _ => ({
    isCopyBtnPressed: false,
    isCopiedTooltipShown: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.statsQuoteAsset,
      vuexTypes.accountId,
    ]),
    url () {
      return `${window.location.host}/pay?id=${this.atomicSwapAsk.id}`
    },
  },
  mounted () {
    const btn = document.querySelector(
      `#clipboard-btn-${this._uid}`
    )
    if (!btn) return
    this.clipboard = new Clipboard(btn)
  },
  methods: {
    changeBtnIcon () {
      this.isCopyBtnPressed = true
      this.showCopiedTooltip()
      setTimeout(() => { this.isCopyBtnPressed = false }, 1000)
    },
    showCopiedTooltip () {
      let hideTooltipTimeout = 2000
      this.isCopiedTooltipShown = true
      setTimeout(() => {
        this.isCopiedTooltipShown = false
      }, hideTooltipTimeout)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.atomic-swap-attributes__quote-asset-header {
  margin: 2rem 0;
}

.atomic-swap-attributes__link-getter {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row-reverse;
}

.atomic-swap-attributes__link-getter-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.atomic-swap-attributes__copy-button {
  color: $col-primary-inactive;
  margin-left: 0.5rem;
  min-height: 1rem;
  min-width: 1rem;
  transition: 0.1s ease-out;
  padding: 0;

  &:hover {
    color: $col-primary-inactive-hover-darken;
    background: none;
  }
}

.atomic-swap-attributes__link-getter-icon {
  &:before {
    vertical-align: middle;
  }
}
</style>
