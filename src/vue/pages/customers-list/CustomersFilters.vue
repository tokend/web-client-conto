<template>
  <div class="customers-filters">
    <div class="customers-filters__filter-field">
      <multi-select-field
        class="app__multiselect-field"
        :disabled="isFilterDisabled"
        :label="'customers-filters.balances-lbl' | globalize"
        @selected="emitSelectedBalances"
        :options="selectionOptions"
        select-all
      />
    </div>
    <div class="customers-filters__filter-field">
      <select-field
        :value="filters.status"
        @input="setStatus"
        :disabled="isFilterDisabled"
        :label="'customers-filters.status-lbl' | globalize"
        need-all-option
      >
        <option
          v-for="userStatus in USER_STATUSES"
          :key="userStatus.value"
          :value="userStatus.value"
        >
          {{ userStatus.labelTranslationId | globalize }}
        </option>
      </select-field>
    </div>
    <div class="customers-filters__filter-field">
      <input-field
        :white-autofill="false"
        v-model="filters.search"
        :label="'customers-filters.search-lbl' | globalize"
        :disabled="isFilterDisabled"
      />
    </div>
  </div>
</template>

<script>
import MultiSelectField from '@/vue/fields/MultiSelectField'
import SelectField from '@/vue/fields/SelectField'
import InputField from '@/vue/fields/InputField'
import debounce from 'lodash/debounce'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  setFiltersAndUpdateList: 'set-filters-and-update-list',
  setSelectedBalances: 'set-selected-balances',
}

const USER_STATUSES = {
  active: {
    value: 'active',
    labelTranslationId: 'customers-filters.active-status-lbl',
  },
  notRegistered: {
    value: 'not_registered',
    labelTranslationId: 'customers-filters.not-registered-status-lbl',
  },
}

export default {
  name: 'statistics-filters',

  components: {
    MultiSelectField,
    SelectField,
    InputField,
  },

  data () {
    return {
      filters: {
        status: '',
        search: '',
      },
      selectionOptions: [],
      isLoadFailed: false,
      USER_STATUSES,
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.activeOwnedAssets,
      vuexTypes.accountId,
    ]),

    isFilterDisabled () {
      return Boolean(!this.activeOwnedAssets.length || this.isLoadFailed)
    },
  },

  watch: {
    filters: {
      deep: true,
      handler: debounce(function () {
        this.$emit(EVENTS.setFiltersAndUpdateList, this.getFilters())
      }, 300),
    },
  },

  async created () {
    await this.loadFiltersData()
    this.selectionOptions = this.getSelectionOptions()
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    setStatus (status) {
      this.filters.status = status
    },

    async loadFiltersData () {
      try {
        await this.loadAssets()
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    emitSelectedBalances (values) {
      this.$emit(EVENTS.setSelectedBalances, values)
    },

    getSelectionOptions () {
      return this.activeOwnedAssets.map(asset => {
        return {
          name: asset.name,
          value: asset.code,
        }
      })
    },

    getFilters () {
      return {
        ...(
          this.filters.status
            ? { 'filter[status]': this.filters.status }
            : {}
        ),
        ...(
          this.filters.search
            ? { 'search': this.filters.search }
            : {}
        ),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables.scss';
@import '~@scss/mixins';

$media-desktop-custom: 1005px;
$media-small-desktop-custom: 851px;

.customers-filters {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.customers-filters__filter-field {
  margin: 0.7rem;
  min-width: 14rem;
  width: calc(25% - 1.4rem);

  @include respond-to-custom($media-desktop-custom) {
    width: calc(33% - 1.4rem);
  }
  @include respond-to-custom($media-small-desktop-custom) {
    width: calc(50% - 1.4rem);
  }
  @include respond-to-custom($sidebar-hide-bp) {
    width: calc(33% - 1.4rem);
  }
  @include respond-to(small) {
    flex: 1 0;
  }
}
</style>
