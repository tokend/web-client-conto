<template>
  <div class="marketplace">
    <top-bar class="marketplace__top-bar">
      <template slot="extra">
        <button
          v-if="isAccountCorporate"
          v-ripple
          class="app__button-raised"
          @click="isMarketplaceOfferCreateDrawerShown = true"
        >
          {{ 'marketplace.create-marketplace-offer-bth' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer
      :is-shown.sync="isMarketplaceOfferCreateDrawerShown"
      :close-by-click-outside="false"
    >
      <template slot="heading">
        {{ 'marketplace.new-marketplace-offer' | globalize }}
      </template>

      <create-marketplace-offer-form
        @created-marketplace-offer="closeDrawerAndUpdateList()"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreateMarketplaceOfferForm from '@/vue/modules/create-marketplace-offer-form'
import UpdateList from '@/vue/mixins/update-list.mixin'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'marketplace',
  components: {
    TopBar,
    Drawer,
    CreateMarketplaceOfferForm,
  },

  mixins: [UpdateList],

  data: () => ({
    isMarketplaceOfferCreateDrawerShown: false,
    vueRoutes,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
    ]),
  },

  beforeDestroy () {
    this.resetUpdateListEvent('marketplace:updateList')
  },

  methods: {
    closeDrawerAndUpdateList () {
      this.isMarketplaceOfferCreateDrawerShown = false
      this.emitUpdateList('marketplace:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
  .marketplace__top-bar {
    margin-bottom: 1rem;
  }
</style>
