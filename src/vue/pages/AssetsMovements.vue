<template>
  <div class="assets-movements">
    <top-bar>
      <div
        slot="main"
        class="assets-movements__top-bar-filters"
      >
        <template v-if="isAssetsExists">
          <div class="assets-movements__top-bar-filter">
            <select-field
              v-if="assetCode"
              :value="assetCode"
              @input="setAssetCode"
              :label="'assets-movements.asset-filter-label' | globalize"
              :key="assetCode"
              class="app__select app__select-with-label--no-border"
            >
              <option
                v-for="asset in ownedAssets"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.name }}
              </option>
            </select-field>
          </div>
        </template>
      </div>
    </top-bar>

    <movements-history
      v-if="assetCode"
      :asset-code="assetCode"
      :is-history="false"
    />

    <no-data-message
      v-else
      icon-name="trending-up"
      :title="'op-pages.no-data-title' | globalize"
      :message="'op-pages.no-data-msg' | globalize"
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import TopBar from '@/vue/common/TopBar'
import SelectField from '@/vue/fields/SelectField'
import MovementsHistory from '@/vue/modules/movements-history'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'assets-movements-page',
  components: {
    NoDataMessage,
    MovementsHistory,
    TopBar,
    SelectField,
  },

  data: _ => ({
    assetCode: '',
  }),

  computed: {
    ...mapGetters([
      vuexTypes.ownedAssets,
    ]),

    isAssetsExists () {
      return Boolean(this.ownedAssets.length)
    },
  },

  async created () {
    if (this.isAssetsExists) {
      this.assetCode = this.ownedAssets[0].code
    }

    try {
      await this.loadAssets()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),
    setAssetCode (code) {
      this.assetCode = code
    },
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .assets-movements__top-bar-filters {
    display: flex;
    flex-direction: row;

    @include respond-to-custom($sidebar-hide-bp) {
      flex-direction: column;
    }
  }

  .assets-movements__top-bar-filter {
    margin-right: 3rem;

    @include respond-to-custom($sidebar-hide-bp) {
      margin-bottom: 1rem;
    }
  }
</style>
