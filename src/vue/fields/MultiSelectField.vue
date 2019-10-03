<template>
  <div
    class="multiselect"
    @click="isOpen = true"
  >
    <template v-if="label">
      <label
        class="select-field__label"
        :class="{ 'select-field__label--minimized': value || isOpen }"
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
            class="multiselect__element"
            :role="'option'">
            <span
              class="multiselect__option">
              a
            </span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'multi-select-field',
  data: _ => ({
    isOpen: false,
    value: 'somethimg',
    label: 'somethimg',
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
  width: 100%;
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
