<template>
  <div>
    <top-bar>
      <template slot="main" />
      <template
        slot="extra"
      >
        <button
          v-ripple
          class="promocodes-page__create-btn app__button-raised"
          @click="isPromocodeDrawerShown = true"
        >
          {{ 'promocodes-page.create-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isPromocodeDrawerShown">
      <template slot="heading">
        {{ 'promocodes-page.create-promocode-title' | globalize }}
      </template>

      <promocode-form
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
import PromocodeForm from '@/vue/forms/PromocodeForm'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'promocodes',

  components: {
    TopBar,
    Drawer,
    PromocodeForm,
  },

  mixins: [UpdateList],

  data: _ => ({
    vueRoutes,
    isPromocodeDrawerShown: false,
  }),

  methods: {
    closeDrawerAndUpdateList () {
      this.isPromocodeDrawerShown = false
      this.emitUpdateList('promocodes:updateList')
    },
  },
}
</script>
