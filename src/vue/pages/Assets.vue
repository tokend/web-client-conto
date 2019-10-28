<template>
  <div>
    <top-bar>
      <template slot="main">
        <template v-if="isCustomerUiShown && myBusinesses.length">
          <div class="assets-page__filter">
            <span class="assets-page__filter-prefix">
              {{ 'assets-page.business-filter-prefix' | globalize }}
            </span>
            <select-field
              :value="businessOwnerId"
              @input="setBusinessOwnerId"
              class="app__select app__select--no-border"
            >
              <option
                :value="ALL_VALUE"
              >
                {{ 'assets-page.all-option' | globalize }}
              </option>
              <option
                v-for="business in myBusinesses"
                :key="business.accountId"
                :value="business.accountId"
              >
                {{ business.name }}
              </option>
            </select-field>
          </div>
        </template>
      </template>
      <template
        slot="extra"
      >
        <button
          v-if="isAccountCorporate && !isCustomerUiShown"
          v-ripple
          class="assets-page__create-btn app__button-raised"
          @click="isAssetDrawerShown = true"
        >
          <i class="mdi mdi-plus assets-page__btn-icon" />
          <span>
            {{ 'assets-page.create-btn' | globalize }}
          </span>
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isAssetDrawerShown">
      <template slot="heading">
        {{ 'assets-page.create-asset-title' | globalize }}
      </template>

      <create-asset-form
        @submitted="closeDrawerAndUpdateList()"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreateAssetForm from '@modules/create-asset-form-simplified'
import UpdateList from '@/vue/mixins/update-list.mixin'
import SelectField from '@/vue/fields/SelectField'

import { vueRoutes } from '@/vue-router/routes'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ALL_VALUE } from '@/js/const/select-field-default-values.const'

export default {
  name: 'assets',
  components: {
    TopBar,
    Drawer,
    CreateAssetForm,
    SelectField,
  },

  mixins: [UpdateList],

  data: _ => ({
    vueRoutes,
    isAssetDrawerShown: false,
    businessOwnerId: ALL_VALUE,
    ALL_VALUE,
  }),

  computed: {
    ...mapGetters({
      account: vuexTypes.account,
      isAccountCorporate: vuexTypes.isAccountCorporate,
      isCustomerUiShown: vuexTypes.isCustomerUiShown,
      myBusinesses: vuexTypes.myBusinesses,
    }),
  },

  watch: {
    businessOwnerId (value) {
      Bus.emit('assets:setBusinessOwnerId', value)
      if (value !== ALL_VALUE) {
        this.loadBusinessStatsQuoteAsset(value)
      }
    },
  },

  async created () {
    await this.loadMyBusinesses()
  },

  methods: {
    ...mapActions({
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
      loadBusinessStatsQuoteAsset: vuexTypes.LOAD_BUSINESS_STATS_QUOTE_ASSET,
    }),

    closeDrawerAndUpdateList () {
      this.isAssetDrawerShown = false
      this.emitUpdateList('assets:updateList')
    },

    setBusinessOwnerId (id) {
      this.businessOwnerId = id
    },
  },
}
</script>

<style lang="scss">
.assets-page__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;
  margin-top: -0.4rem;
}
</style>
