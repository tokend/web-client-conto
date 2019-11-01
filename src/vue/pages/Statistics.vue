<template>
  <div class="statistics">
    <template>
      <top-bar class="statistics__top-bar">
        <template slot="main">
          <router-link :to="vueRoutes.statisticsSalesHistory">
            <span>{{ 'statistics-page.sales-history-tab' | globalize }}</span>
          </router-link>

          <router-link
            :to="vueRoutes.statisticsGeneral"
          >
            <span>
              {{ 'statistics-page.general-tab' | globalize }}
            </span>
          </router-link>
        </template>
      </top-bar>
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'statistics',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
  }),
}
</script>

<style lang="scss" scoped>
.statistics__top-bar {
  margin-bottom: 1rem;
}
</style>
