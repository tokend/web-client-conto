<template>
  <div class="statistics-filters">
    <template v-if="isLoaded && ownedAssets.length">
      <div class="statistics-filters__filter-field">
        <select-field
          :value="filters.assetCode"
          @input="setAssetCode"
          :label="'statistics-filters.asset-code-lbl' | globalize"
          class="app__select"
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
          :label="'statistics-filters.date-from-lbl' | globalize"
        />
      </div>

      <div class="statistics-filters__filter-field">
        <date-field
          v-model="filters.dateTo"
          :enable-time="true"
          :label="'statistics-filters.date-to-lbl' | globalize"
        />
      </div>

      <template v-if="isSalesHistoryPage && promoCodes.length">
        <div class="statistics-filters__filter-field">
          <select-field
            :value="filters.promoCode"
            @input="setPromoCode"
            :label="'statistics-filters.promo-code-lbl' | globalize"
            class="app__select"
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
      </template>

      <template v-if="isSalesHistoryPage">
        <div class="statistics-filters__filter-field">
          <select-field
            :value="filters.buyRequestStatus"
            @input="setBuyRequestStatus"
            :label="'statistics-filters.buy-request-status-lbl' | globalize"
            class="app__select"
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
    </template>
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import DateField from '@/vue/fields/DateField'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api, loadingDataViaLoop } from '@/api'
import { BUY_REQUEST_STATUSES } from '@/js/const/buy-request-statuses.const'
import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  filtersDataLoaded: 'filters-data-loaded',
  setFiltersAndUpdateList: 'set-filters-and-update-list',
  showNoDataMessage: 'show-no-data-message',
  showRequestFailedMessage: 'show-request-failed-message',
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
      isLoaded: false,
      BUY_REQUEST_STATUSES,
    }
  },

  computed: {
    ...mapGetters({
      ownedAssets: vuexTypes.ownedBalancesAssets,
      accountId: vuexTypes.accountId,
    }),

    isSalesHistoryPage () {
      return this.$route.name === vueRoutes.statisticsSalesHistory.name
    },
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
    if (!this.ownedAssets.length) {
      this.$emit(EVENTS.showNoDataMessage)
    }
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
        this.isLoaded = true
        this.$emit(EVENTS.filtersDataLoaded)
      } catch (e) {
        this.$emit(EVENTS.showRequestFailedMessage)
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
