<template>
  <div>
    <template v-if="isLoaded">
      <table v-if="accruals.length" class="accrual-table">
        <thead>
          <tr>
            <th
              class="accrual-table__head-cell"
              :title="'user-movements-history.type-th' | globalize"
            >
              {{ 'smart-contracts.asset-name' | globalize }}
            </th>
            <th
              class="accrual-table__head-cell"
              :title="'user-movements-history.date-th' | globalize"
            >
              {{ 'smart-contracts.amount-lbl' | globalize }}
            </th>
            <th
              class="accrual-table__head-cell"
              :title="'user-movements-history.amount-th' | globalize"
            >
              {{ 'smart-contracts.amount-left' | globalize }}
            </th>
          </tr>
        </thead>
        <tr
          v-for="item in accruals"
          :key="item.id">
          <th
            class="accrual-table__cell"
            :title="item.id | formatMoney"
          >
            {{ assetByCode(item.assetCode).name }}
          </th>
          <th
            class="accrual-table__cell"
            :title="item.accuralAmount | formatMoney"
          >
            {{ item.accuralAmount | formatMoney }}
          </th>
          <th
            class="accrual-table__cell"
            :title="item.amountLeft | formatMoney"
          >
            {{ item.amountLeft | formatMoney }}
          </th>
        </tr>
      </table>
      <no-data-message
        v-else
        icon-name="basket-fill"
        :title="'smart-contracts.no-accruals-head' | globalize"
        :message="'smart-contracts.no-accruals' | globalize"
      />
    </template>
    <template v-else>
      <loader :message-id="'smart-contracts.loading-msg'" />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
export default {
  name: 'accrual-table',
  components: {
    Loader,
    NoDataMessage,
  },
  data () {
    return {
      isLoaded: true,
      accruals: [],
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetByCode,
    ]),
  },
  created () {
    this.getAccrual()
    this.listen()
  },
  methods: {
    async getAccrual () {
      try {
        const { data } = await api.getWithSignature(
          `/integrations/dns/businesses/${this.accountId}/settings/assets-accrual`
        )
        this.accruals = data
        this.isLoaded = true
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
    listen () {
      Bus.on('smartContract:setNew', () => {
        this.getAccrual()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';

  .accrual-table {
    width: 100%;
    table-layout: fixed;
    border-spacing: 0 0.6rem;
    border-color: transparent;
    overflow-x: auto;
    padding: 0.4rem;
  }

  .accrual-table__head-cell {
    padding: 0 1.5rem 1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    font-size: 1.4rem;
    color: $col-text-secondary;
    font-weight: 400;
  }

  .accrual-table__cell {
    padding: 1.4rem 1.5rem 0.7rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    font-size: 1.4rem;
    font-weight: 400;
    border-top: 0.1rem solid darken($col-button-flat-disabled-txt, 5%);
  }
</style>
