<template>
  <div class="statistics-filters">
    <template v-if="isLoaded && ownedAssets.length">
      <div class="statistics-filters__filter-field">
        <select-field
          :value="filters.assetCode"
          @input="setAssetCode"
          :label="'statistics-filters.asset-code-lbl' | globalize"
          class="app__select"
        >
          <option
            v-for="asset in ownedAssets"
            :key="asset.code"
            :value="asset.code"
          >
            {{ asset.name }}
          </option>
        </select-field>
      </div>

      <div class="statistics-filters__filter-field">
        <date-field
          v-model="filters.periodStart"
          :enable-time="true"
          :label="'statistics-filters.period-start-lbl' | globalize"
        />
      </div>

      <div class="statistics-filters__filter-field">
        <date-field
          v-model="filters.periodEnd"
          :enable-time="true"
          :label="'statistics-filters.period-end-lbl' | globalize"
        />
      </div>

      <template v-if="promoCodes.length">
        <div class="statistics-filters__filter-field">
          <select-field
            :value="filters.promoCode"
            @input="setPromoCode"
            :label="'statistics-filters.promo-code-lbl' | globalize"
            class="app__select"
          >
            <option
              v-for="promoCode in promoCodes"
              :key="promoCode.id"
              :value="promoCode.code"
            >
              {{ promoCode.code }}
            </option>
          </select-field>
        </div>
      </template>
    </template>

    <no-data-message
      v-else-if="isLoaded && !ownedAssets.length"
      icon-name="trending-up"
      :title="'statistics-filters.no-data-title' | globalize"
      :message="'statistics-filters.no-data-msg' | globalize"
    />

    <template v-else-if="!isLoaded && requestFailed">
      <p>{{ 'statistics-filters.load-failed-msg' | globalize }}</p>
    </template>

    <loader
      v-else
      message-id="statistics-filters.filters-data-loading-msg"
    />
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import DateField from '@/vue/fields/DateField'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api, loadingDataViaLoop } from '@/api'

const EVENTS = {
  filtersDataLoaded: 'filters-data-loaded',
  setFiltersAndUpdateList: 'set-filters-and-update-list',
}

export default {
  name: 'statistics-filters',

  components: {
    SelectField,
    DateField,
    NoDataMessage,
    Loader,
  },

  data () {
    return {
      filters: {
        assetCode: '',
        periodStart: '',
        periodEnd: '',
        promoCode: '',
      },
      promoCodes: [],
      isLoaded: false,
      requestFailed: false,
    }
  },

  computed: {
    ...mapGetters({
      ownedAssets: vuexTypes.ownedBalancesAssets,
      accountId: vuexTypes.accountId,
    }),
  },

  watch: {
    filters: {
      deep: true,
      handler: function (value) {
        this.$emit(EVENTS.setFiltersAndUpdateList, value)
      },
    },
  },

  async created () {
    await this.loadFiltersData()
    this.isLoaded = true
    this.$emit(EVENTS.filtersDataLoaded)
  },

  methods: {
    ...mapActions({
      loadAccountBalancesDetails: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    setAssetCode (code) {
      this.filters.assetCode = code
    },

    setPromoCode (code) {
      this.filters.promoCode = code
    },

    async loadFiltersData () {
      try {
        await this.loadAccountBalancesDetails()
        await this.loadAllPromocodes()
      } catch (e) {
        this.requestFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async loadAllPromocodes () {
      const response = await api.getWithSignature(
        `/integrations/marketplace/promocodes`,
        { filter: { owner: this.accountId } },
      )
      const data = await loadingDataViaLoop(response)

      this.promoCodes = data
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables.scss';

.statistics-filters {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.statistics-filters__filter-field {
  margin: 0.7rem;
  min-width: 14rem;
  width: calc(25% - 1.4rem);
}
</style>
