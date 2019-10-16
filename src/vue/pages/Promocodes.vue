<template>
  <div>
    <top-bar>
      <template slot="main" />
      <template
        slot="extra"
      >
        <button
          v-ripple
          class="promo-codes-page__create-btn app__button-raised"
          @click="isPromoCodeDrawerShown = true"
        >
          {{ 'promo-codes-page.create-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isPromoCodeDrawerShown">
      <template slot="heading">
        {{ 'promo-codes-page.create-promo-code-title' | globalize }}
      </template>

      <promo-code-form
        @close-drawer-and-update-list="closeDrawerAndUpdateList"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import UpdateList from '@/vue/mixins/update-list.mixin'
import PromoCodeForm from '@/vue/forms/PromoCodeForm'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'promo-codes',

  components: {
    TopBar,
    Drawer,
    PromoCodeForm,
  },

  mixins: [UpdateList],

  data: _ => ({
    vueRoutes,
    isPromoCodeDrawerShown: false,
  }),

  methods: {
    closeDrawerAndUpdateList () {
      this.isPromoCodeDrawerShown = false
      this.emitUpdateList('promoCodes:updateList')
    },
  },
}
</script>
