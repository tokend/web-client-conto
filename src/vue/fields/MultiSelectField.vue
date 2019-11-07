<template>
  <div class="multiselect-field">
    <div
      class="multiselect-field__select"
      :class="{ 'multiselect-field__select--active': isDropdownOpen }"
      @click="toggleDropdown"
    >
      <template v-if="label">
        <label class="multiselect-field__select-label">
          {{ label }}
        </label>
      </template>

      <span class="multiselect-field__select-value-label">
        {{ valueLabel }}
      </span>

      <i
        class="multiselect-field__select-icon mdi mdi-chevron-down"
        :class="{ 'multiselect-field__select-icon--active': isDropdownOpen }"
      />
    </div>

    <transition name="multiselect-field__dropdown">
      <div
        class="multiselect-field__dropdown"
        v-show="isDropdownOpen"
      >
        <ul>
          <li
            v-if="enabledOptionAll"
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
    enabledOptionAll: { type: Boolean, default: true },
    selectAll: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
  data: _ => ({
    isDropdownOpen: false,
    selectedOptions: [],
    destructClickOutsideHandler: () => { },
  }),

  computed: {
    valueLabel () {
      let value = ''

      if (this.enabledOptionAll && this.isSelectedAll) {
        value = globalize('multiselect-field.all-selected-value-label')
      } else if (this.selectedOptions.length) {
        value = this.selectedOptions.length > 1
          ? `${this.selectedOptions[0].name}, ...`
          : this.selectedOptions[0].name
      } else {
        value = globalize('multiselect-field.select-something-value-label')
      }
      return value
    },

    isSelectedAll () {
      return this.selectedOptions.length === this.options.length
    },
  },

  watch: {
    selectedOptions (value) {
      this.$emit(EVENTS.selected, value)
    },
  },

  created () {
    if (this.selectAll) {
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

.multiselect-field__select-value-label {
  color: $field-color-text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @include text-font-sizes;
}

.multiselect-field__select-label {
  position: absolute;
  left: 0;
  transition: all $field-transition-duration;
  pointer-events: none;
  color: $field-color-unfocused;
  top: 0;

  @include label-font-sizes;
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
  padding: 1.5rem 2.4rem 0.6rem 0;

  @include material-border(
    $field-color-focused,
    $field-color-unfocused,
    '&.multiselect-field__select--active'
  );
}

.multiselect-field__select-icon {
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

.multiselect-field__select-icon--active:before {
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
