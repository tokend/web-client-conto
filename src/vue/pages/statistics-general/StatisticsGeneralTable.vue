<template>
  <div class="app__table app__table--with-shadow">
    <table>
      <thead>
        <tr>
          <th
            :title="'statistics-general-table.asset-th' | globalize"
          >
            {{ 'statistics-general-table.asset-th' | globalize }}
          </th>
          <th
            :title="'statistics-general-table.total-sold-th' | globalize"
          >
            {{ 'statistics-general-table.total-sold-th' | globalize }}
          </th>
          <th
            :title="'statistics-general-table.total-proceeds-th' | globalize"
          >
            {{ 'statistics-general-table.total-proceeds-th' | globalize }}
          </th>
        </tr>
      </thead>

      <tbody v-if="soldAssets.length">
        <tr
          v-for="soldAsset in soldAssets"
          :key="soldAsset.id"
        >
          <td>
            {{ soldAsset.assetName }}
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

      <empty-tbody-placeholder
        v-else-if="isLoaded && !soldAssets.length"
        :colspan="3"
        :message="'statistics-general-table.no-data-msg' | globalize"
      />

      <empty-tbody-placeholder
        v-else-if="isLoadFailed"
        :colspan="3"
        :message="'statistics-general-table.error-msg' | globalize"
      />

      <skeleton-loader-table-body
        v-else
        :cells="3"
        template="smallString"
      />
    </table>
  </div>
</template>

<script>
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'

export default {
  name: 'statistics-general-table',
  components: {
    EmptyTbodyPlaceholder,
    SkeletonLoaderTableBody,
  },
  props: {
    soldAssets: {
      type: Array, /** {@link SoldAssetRecord} **/
      required: true,
    },
    isLoaded: {
      type: Boolean,
      require: true,
    },

    isLoadFailed: {
      type: Boolean,
      require: true,
    },
  },
}
</script>
