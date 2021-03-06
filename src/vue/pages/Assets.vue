<template>
  <div>
    <top-bar>
      <template slot="main">
        <template v-if="myBusinesses.length">
          <div class="assets-page__top-bar-filter">
            <select-field
              :value="businessOwnerId"
              @input="setBusinessOwnerId"
              class="app__select app__select-with-label--no-border"
              :label="'assets-page.business-filter-label' | globalize"
              need-all-option
            >
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
          v-if="isAccountCorporate"
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
    businessOwnerId: '',
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.myBusinesses,
      vuexTypes.accountId,
      vuexTypes.ownedAssets,
    ]),
  },

  watch: {
    businessOwnerId (value) {
      Bus.emit('assets:setBusinessOwnerId', value)
    },
  },

  async created () {
    await this.loadMyBusinesses()

    if (this.isAccountCorporate && this.ownedAssets.length > 0) {
      this.setBusinessOwnerId(this.accountId)
    }
  },

  methods: {
    ...mapActions({
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
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
@import '~@scss/variables';
@import '~@scss/mixins';

.assets-page__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;
  margin-top: -0.4rem;
}

.assets-page__top-bar-filter {
  max-width: 20rem;
}

.assets-page__create-btn {
  @include respond-to-custom($sidebar-hide-bp) {
    margin-top: 0.4rem;
  }
}
</style>
