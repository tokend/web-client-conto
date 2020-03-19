<template>
  <div class="statistics-filters">
    <div class="statistics-filters__filter-field">
      <select-field
        :value="filters.assetCode"
        @input="setAssetCode"
        :key="`assets-isLoaded-${isLoaded}`"
        :disabled="isFilterDisabled"
        :label="'statistics-filters.asset-code-lbl' | globalize"
        need-all-option
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
        v-model="filters.dateFrom"
        :enable-time="true"
        :disabled="isFilterDisabled"
        :disable-after="getDisableDate"
        :label="'statistics-filters.date-from-lbl' | globalize"
      />
    </div>

    <div class="statistics-filters__filter-field">
      <!-- eslint-disable max-len -->
      <date-field
        v-model="filters.dateTo"
        :disabled="isFilterDisabled"
        :disable-after="moment().toISOString()"
        :disable-before="moment(filters.dateFrom).subtract(1, 'days').toISOString()"
        :enable-time="true"
        :label="'statistics-filters.date-to-lbl' | globalize"
      />
      <!-- eslint-enable max-len -->
    </div>

    <template v-if="isSalesHistoryPage">
      <div class="statistics-filters__filter-field">
        <select-field
          :value="filters.promoCode"
          :key="`promoCodes-isLoaded-${isLoaded}`"
          :disabled="isLoadFailed || !promoCodes.length"
          @input="setPromoCode"
          :label="'statistics-filters.promo-code-lbl' | globalize"
          need-all-option
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

      <div class="statistics-filters__filter-field">
        <select-field
          :value="filters.buyRequestStatus"
          @input="setBuyRequestStatus"
          :disabled="isFilterDisabled"
          :label="'statistics-filters.buy-request-status-lbl' | globalize"
        >
          <option
            v-for="buyRequestStatus in BUY_REQUEST_STATUSES"
            :key="buyRequestStatus.value"
            :value="buyRequestStatus.value"
          >
            {{ buyRequestStatus.labelTranslationId | globalize }}
          </option>
        </select-field>
      </div>
    </template>
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import DateField from '@/vue/fields/DateField'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api, loadingDataViaLoop } from '@/api'
import { BUY_REQUEST_STATUSES } from '@/js/const/buy-request-statuses.const'
import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  setFiltersAndUpdateList: 'set-filters-and-update-list',
}

export default {
  name: 'statistics-filters',

  components: {
    SelectField,
    DateField,
  },

  data () {
    return {
      filters: {
        assetCode: '',
        dateFrom: '',
        dateTo: '',
        promoCode: '',
        buyRequestStatus: BUY_REQUEST_STATUSES.paid.value,
      },
      promoCodes: [],
      isLoadFailed: false,
      isLoaded: false,
      BUY_REQUEST_STATUSES,
      moment,
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.ownedAssets,
      vuexTypes.accountId,
    ]),

    isSalesHistoryPage () {
      return this.$route.name === vueRoutes.statisticsSalesHistory.name
    },

    isFilterDisabled () {
      return Boolean(!this.ownedAssets.length || this.isLoadFailed)
    },

    getDisableDate () {
      return this.filters.dateTo
        ? moment(this.filters.dateTo).toISOString()
        : moment().toISOString()
    },
  },

  watch: {
    filters: {
      deep: true,
      handler: function (value) {
        if (moment(value.dateFrom).isAfter(moment(value.dateTo))) {
          return
        }
        this.$emit(EVENTS.setFiltersAndUpdateList, value)
      },
    },
  },

  async created () {
    await this.loadFiltersData()
    this.isLoaded = true
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

    setBuyRequestStatus (status) {
      this.filters.buyRequestStatus = status
    },

    async loadFiltersData () {
      try {
        await this.loadAccountBalancesDetails()
        if (this.isSalesHistoryPage) {
          await this.loadAllPromocodes()
        }
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async loadAllPromocodes () {
      const response = await api.getWithSignature(
        '/integrations/marketplace/promocodes',
        { filter: { owner: this.accountId },
          page: { limit: 100 },
        },
      )
      const data = await loadingDataViaLoop(response)

      this.promoCodes = data
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables.scss';
@import '~@scss/mixins';

$media-desktop-custom: 1005px;
$media-small-desktop-custom: 851px;

.statistics-filters {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.statistics-filters__filter-field {
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
