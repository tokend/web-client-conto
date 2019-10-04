<template>
  <div
    tabindex="0"
    class="multiselect"
    @click="isOpen = !isOpen"
    @blur="isOpen = false"
  >
    <template v-if="label">
      <label
        class="select-field__label"
      >
        {{ label }}
      </label>
    </template>

    <i
      class="select-field__selected-icon mdi mdi-chevron-down"
      :class="{ 'select-field__selected-icon--active': isOpen }"
    />
    <transition name="multiselect">
      <div
        class="multiselect__content-wrapper"
        v-show="isOpen"
      >
        <ul
          class="multiselect__content">
          <li
            v-if="isNeedAllOption"
            class="multiselect__element"
          >
            <tick-field
              v-model="checkedValues"
              :cb-value="options"
            >
              All
            </tick-field>
          </li>
          <li
            v-for="option in options"
            :key="option.value"
            class="multiselect__element"
          >
            <tick-field
              v-model="checkedValues"
              :cb-value="option"
            >
              {{ option.name }}
            </tick-field>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import TickField from '@/vue/fields/TickField'

export default {
  name: 'multi-select-field',
  components: {
    TickField,
  },
  props: {
    options: { type: Array, default: () => [] },
    isNeedAllOption: { type: Boolean, default: true },
  },
  data: _ => ({
    isOpen: false,
    label: 'somethimg',
    checkedValues: [],
  }),
}
</script>

<style>
.multiselect,
.multiselect__input,
.multiselect__single {
  font-family: inherit;
  font-size: 1.6rem;
}

.multiselect {
  box-sizing: content-box;
  display: block;
  position: relative;
  width: 10rem;
  min-height: 4rem;
  text-align: left;
}

.multiselect * {
  box-sizing: border-box;
}

.multiselect:focus {
  outline: none;
}

.multiselect-enter-active,
.multiselect-leave-active {
  transition: all 0.15s ease;
}

.multiselect-enter,
.multiselect-leave-active {
  opacity: 0;
}
</style>
