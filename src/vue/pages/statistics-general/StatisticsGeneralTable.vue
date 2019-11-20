<template>
  <div class="app__table app__table--with-shadow">
    <table>
      <thead>
        <tr>
          <th :title="'statistics-general-table.asset-th' | globalize">
            {{ 'statistics-general-table.asset-th' | globalize }}
          </th>
          <th :title="'statistics-general-table.total-sold-th' | globalize">
            {{ 'statistics-general-table.total-sold-th' | globalize }}
          </th>
          <th :title="'statistics-general-table.total-proceeds-th' | globalize">
            {{ 'statistics-general-table.total-proceeds-th' | globalize }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="soldAsset in soldAssets"
          :key="soldAsset.id"
        >
          <td>
            {{ assetByCode(soldAsset.assetCode).name }}
          </td>
          <td>
            {{ soldAsset.totalSold | formatMoney }}
          </td>
          <td>
            {{ soldAsset.totalProceeds | formatMoney }}
            {{ soldAsset.proceedAssetCode }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'statistics-general-table',
  props: {
    soldAssets: {
      type: Array, /** {@link SoldAssetRecord} **/
      required: true,
    },
  },

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),
  },
}
</script>
