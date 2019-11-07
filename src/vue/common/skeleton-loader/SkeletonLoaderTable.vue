<template>
  <div class="app__table app__table--with-shadow">
    <table>
      <thead>
        <tr>
          <th
            v-for="item in cells"
            :key="item"
          >
            <skeleton-loader
              template="xSmallString"
            />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="index in rows"
          :key="index"
        >
          <td
            v-for="item in cells"
            :key="item"
          >
            <skeleton-loader
              :template="getTemplateNameSkeletonLoader(item)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'skeleton-loader-table',
  components: {
    SkeletonLoader,
  },
  props: {
    cells: {
      type: Number,
      default: 5,
    },
    rows: {
      type: Number,
      default: 3,
    },
    needButton: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    getTemplateNameSkeletonLoader (item) {
      return (item === this.cells && this.needButton)
        ? 'smallIcon'
        : 'bigString'
    },
  },
}
</script>
