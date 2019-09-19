<template>
  <div>
    <top-bar>
      <template
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised"
          @click="isDrawerShown = true"
        >
          <span>
            {{ 'offers-page.buy-back-btn' | globalize }}
          </span>
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'offers-page.buy-back-title' | globalize }}
      </template>
    </drawer>

    <user-offers />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import UserOffers from '@/vue/pages/offers/UserOffers'
import Drawer from '@/vue/common/Drawer'

export default {
  name: 'offers',
  components: {
    TopBar,
    UserOffers,
    Drawer,
  },

  data: _ => ({
    isDrawerShown: false,
  }),
}
</script>

<style scoped lang="scss"/>
