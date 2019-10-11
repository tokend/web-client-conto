<template>
  <div class="promocode-attributes">
    <div class="app__table app__table--last-td-to-right">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'promocode-attributes.code-key' | globalize }}
            </td>
            <td>
              {{ promocode.code }}
            </td>
          </tr>

          <tr v-if="promocode.description">
            <td>
              {{ 'promocode-attributes.description-key' | globalize }}
            </td>
            <td>
              {{ promocode.description }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'promocode-attributes.discount-key' | globalize }}
            </td>
            <td>
              {{ promocode.discount }}
            </td>
          </tr>

          <tr v-if="promocode.maxUses">
            <td>
              {{ 'promocode-attributes.max-uses-key' | globalize }}
            </td>
            <td>
              {{ promocode.maxUses }}
            </td>
          </tr>

          <tr v-if="promocode.status">
            <td>
              {{ 'promocode-attributes.status-key' | globalize }}
            </td>
            <td>
              {{ promocode.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <promocode-offers-table
      :offers="promocode.offers"
      is-promocode-attributes-drawer
    />
  </div>
</template>

<script>
import PromocodeOffersTable from '@/vue/pages/promocodes/PromocodeOffersTable'
import { PromocodeRecord } from '@/js/records/entities/promocode.record'

export default {
  name: 'promocode-attributes',

  components: {
    PromocodeOffersTable,
  },

  props: {
    promocode: {
      type: PromocodeRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
