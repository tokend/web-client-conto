<template>
  <div class="skeleton-loader-table app__table app__table--with-shadow">
    <table>
      <thead>
        <tr>
          <th
            class="skeleton-loader-table__head-cell"
            v-for="item in cells"
            :key="item"
          >
            <skeleton-loader
              :template="getTemplateNameTheadSkeletonLoader(item)"
            />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="index in rows"
          :key="index"
        >
          <!-- eslint-disable max-len -->
          <td
            v-for="item in cells"
            :key="item"
            :class="{ 'skeleton-loader-table__body-cell--right': isLastElementAndButton(item) }"
          >
            <!-- eslint-enable max-len -->
            <skeleton-loader
              :template="getTemplateNameTbodySkeletonLoader(item)"
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
    isLastElementAndButton (item) {
      return (item === this.cells && this.needButton)
    },
    getTemplateNameTbodySkeletonLoader (item) {
      return (this.isLastElementAndButton(item))
        ? 'smallIcon'
        : 'bigString'
    },

    getTemplateNameTheadSkeletonLoader (item) {
      return (this.isLastElementAndButton(item))
        ? 'fillMode'
        : 'xSmallString'
    },
  },
}
</script>

<style lang="scss" scoped>
.skeleton-loader-table__head-cell {
  width: 10rem;
}

.skeleton-loader-table__body-cell--right {
  display: flex;
  justify-content: flex-end;
  max-width: 100%;
}
</style>
