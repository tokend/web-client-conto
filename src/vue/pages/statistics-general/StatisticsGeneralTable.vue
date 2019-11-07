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

      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <empty-tbody-placeholder
            :colspan="3"
            :message="'statistics-general-table.error-msg' | globalize"
          />
        </template>

        <template v-else>
          <template v-if="soldAssets.length">
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
          </template>

          <template v-else>
            <empty-tbody-placeholder
              :colspan="3"
              :message="'statistics-general-table.no-data-msg' | globalize"
            />
          </template>
        </template>
      </template>

      <template v-else>
        <skeleton-loader-table-body
          :cells="3"
          template="smallString"
        />
      </template>
    </table>
  </div>
</template>

<script>
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

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

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),
  },
}
</script>
