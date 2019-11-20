<template>
  <div class="app__table app__table--last-td-to-right">
    <table class="business-assets-table">
      <thead>
        <tr>
          <th
            class="business-assets-table__asset-name"
            :title="'business-assets-table.asset-name-th' | globalize"
          >
            {{ 'business-assets-table.asset-name-th' | globalize }}
          </th>
          <!-- eslint-disable-next-line max-len -->
          <th :title="'business-assets-table.number-of-holders-th' | globalize">
            {{ 'business-assets-table.number-of-holders-th' | globalize }}
          </th>
          <th>
            <!-- actions -->
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="businessAsset in businessAssets"
          :key="businessAsset.asset.code"
        >
          <td
            class="business-assets-table__asset-name"
          >
            {{ businessAsset.asset.name }}
          </td>

          <td>
            {{ businessAsset.holders | formatNumber }}
          </td>

          <td>
            <button
              class="business-assets-table__sponsor-btn"
              @click="$emit(EVENTS.selectBusinessAsset, businessAsset)"
            >
              {{ 'business-assets-table.sponsor-btn' | globalize }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

const EVENTS = {
  selectBusinessAsset: 'select-business-asset',
}

export default {
  name: 'business-assets-table',

  props: {
    businessAssets: {
      type: Array, /** {@link BusinessAssetRecord} **/
      default: _ => [],
    },
  },

  data: _ => ({
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.business-assets-table__sponsor-btn {
  font-size: 1.2rem;
  color: $col-btn;
}

.business-assets-table__asset-name {
  min-width: 12rem;
}
</style>
