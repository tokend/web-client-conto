<template>
  <div class="multiselect-field">
    <div class="multiselect-field__select" @click="toggleDropdown()">
      <span class="multiselect-field__select-label">{{ getLable }} </span>
      <i
        class="multiselect-field__selected-icon mdi mdi-chevron-down"
        :class="{ 'multiselect-field__selected-icon--active': isDropdownOpen }"
      />
    </div>

    <transition name="multiselect-field__dropdown">
      <div
        class="multiselect-field__dropdown"
        v-show="isDropdownOpen"
      >
        <ul
          class="multiselect-field__dropdown-wrp">
          <li
            v-if="isNeedAllOption"
            class="multiselect-field__dropdown-option"
          >
            <tick-field
              v-model="selectedOptions"
              :cb-value="options"
            >
              {{ 'multiselect-field.select-all' | globalize }}
            </tick-field>
          </li>
          <li
            v-for="option in options"
            :key="option.value"
            class="multiselect-field__dropdown-option"
          >
            <tick-field
              v-model="selectedOptions"
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
import { handleClickOutside } from '@/js/helpers/handle-click-outside'
import { globalize } from '@/vue/filters/globalize'

const EVENTS = {
  selected: 'selected',
}

export default {
  name: 'multi-select-field',
  components: {
    TickField,
  },
  props: {
    options: { type: Array, required: true },
    isNeedAllOption: { type: Boolean, default: true },
    isNeedSelectAllOptions: { type: Boolean, default: false },
  },
  data: _ => ({
    isDropdownOpen: false,
    selectedOptions: [],
    destructClickOutsideHandler: () => { },
  }),

  computed: {
    getLable () {
      let lable = ''

      if (this.isNeedAllOption && this.isSelectedAllOptions) {
        lable = globalize('multiselect-field.all-selected-lable')
      } else if (this.selectedOptions.length) {
        lable = this.selectedOptions.length > 1
          ? `${this.selectedOptions[0].name}, ...`
          : this.selectedOptions[0].name
      } else {
        lable = globalize('multiselect-field.select-something-lable')
      }
      return lable
    },

    isSelectedAllOptions () {
      return this.selectedOptions.length === this.options.length
    },
  },

  watch: {
    selectedOptions (value) {
      this.$emit(EVENTS.selected, value)
    },
  },

  created () {
    if (this.isNeedSelectAllOptions) {
      this.selectAllOptions()
    }
  },

  methods: {
    toggleDropdown () {
      if (this.isDropdownOpen) {
        this.closeDropdown()
      } else {
        this.openDropdown()
      }
    },

    openDropdown () {
      this.isDropdownOpen = true
      this.destructClickOutsideHandler = handleClickOutside(
        '.multiselect-field',
        this.closeDropdown
      )
    },

    closeDropdown () {
      this.destructClickOutsideHandler()
      this.isDropdownOpen = false
    },

    selectAllOptions () {
      this.selectedOptions = this.options
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import 'scss/variables';

.multiselect-field {
  position: relative;
  width: 100%;
}

.multiselect-field__select-label {
  color: $field-color-text;

  @include text-font-sizes;
}

.multiselect-field__select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  min-width: 16rem;
  width: 100%;
  background: none;
  border: none;
  padding-right: 2.4rem;
}

.multiselect-field__selected-icon {
  position: absolute;
  right: 0;
  will-change: transform;
  color: $field-color-text;
  font-size: 2.2rem;
  line-height: 1.5rem;
  pointer-events: none;

  &:before {
    transition: transform 0.2s ease-out;
  }
}

.multiselect-field__selected-icon--active:before {
  transform: rotate(-180deg);
}

.multiselect-field__dropdown {
  position: absolute;
  left: 0;
  top: 100%;
  background: $col-block-bg;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 0.3rem;
  z-index: $z-index-select-field-list;
  max-height: 24.4rem;
  overflow-y: auto;
  padding: 0.8rem 0;

  @include box-shadow();
}

.multiselect-field__dropdown-option {
  padding: 0.8rem 1.6rem;
  font-size: 1.6rem;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.multiselect-field__dropdown-enter-active {
  animation: multiselect-field-dropdown-keyframes 0.2s ease-in-out;
  animation-duration: 0.2s;
}

.multiselect-field__dropdown-leave-active {
  animation: multiselect-field-dropdown-keyframes 0.2s ease-in-out reverse;
  animation-duration: 0.2s;
}

@keyframes multiselect-field-dropdown-keyframes {
  from {
    opacity: 0;
    margin-top: -1.2rem;
  }

  to {
    opacity: 1;
    margin-top: 0;
  }
}
</style>
