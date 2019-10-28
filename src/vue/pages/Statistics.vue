<template>
  <div class="statistics">
    <template>
      <top-bar>
        <template slot="main" />
      </top-bar>
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

export default {
  name: 'statistics',
  components: {
    TopBar,
  },
}
</script>
