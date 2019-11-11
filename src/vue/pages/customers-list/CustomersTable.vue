<template>
  <div class="customers-table">
    <div class="customers-table__head-actions">
      <template v-if="!isIssuanceMode">
        <button
          class="app__button-raised"
          @click="isIssuanceMode = true"
        >
          {{ 'customers-table.enable-mass-payment-btn' | globalize }}
        </button>
      </template>

      <template v-else>
        <div class="customers-table__head-actions-group">
          <button
            class="app__button-raised"
            @click="doMassIssuance"
            :disabled="!issuanceReceivers.length"
          >
            {{ 'customers-table.do-mass-payment-btn' | globalize }}
          </button>

          <button
            class="app__button-flat app__button-flat--danger"
            @click="toggleIssuanceMode"
          >
            {{ 'customers-table.cancel-mass-issue-btn' | globalize }}
          </button>
        </div>
      </template>
    </div>

    <!-- eslint-disable-next-line max-len -->
    <div class="app__table app__table--with-shadow app__table--last-td-to-right">
      <table class="customers-table__table">
        <thead>
          <tr>
            <th
              class="customers-table__cb-td"
              v-if="isIssuanceMode"
            >
              <tick-field
                class="customers-table__cb"
                v-model="issuanceReceivers"
                :cb-value="customersList
                  .filter(i => !i.isCustomer)
                "
              />
            </th>
            <th :title="'customers-table.customer-th' | globalize">
              <table-sorter
                :is-active="activeSortKey === SORT_KEYS.lastName"
                :sort-key="SORT_KEYS.lastName"
                @sort-changed="setActiveKeyAndEmitSort($event)"
              >
                {{ 'customers-table.customer-th' | globalize }}
              </table-sorter>
            </th>
            <th :title="'customers-table.email-th' | globalize">
              <table-sorter
                :is-active="activeSortKey === SORT_KEYS.email"
                :sort-key="SORT_KEYS.email"
                @sort-changed="setActiveKeyAndEmitSort($event)"
              >
                {{ 'customers-table.email-th' | globalize }}
              </table-sorter>
            </th>
            <th :title="'customers-table.status-th' | globalize">
              {{ 'customers-table.status-th' | globalize }}
            </th>
            <template v-for="balance in selectedBalances">
              <th
                :key="balance.value"
                :title="balance.name"
              >
                {{ balance.name }}
              </th>
            </template>
            <th class="customers-table__btn-td">
              <!-- actions -->
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="customer in customersList"
            :key="customer.id"
          >
            <td
              class="customers-table__cb-td"
              v-if="isIssuanceMode"
            >
              <tick-field
                class="customers-table__cb"
                v-model="issuanceReceivers"
                :cb-value="customer"
                :disabled="customer.isCustomer"
              />
            </td>

            <td
              :title="getCustomerName(customer)"
              class="customers-table__customer-td"
            >
              {{ getCustomerName(customer) }}
            </td>

            <td
              :title="customer.email"
              class="customers-table__customer-td"
            >
              {{ customer.email }}
            </td>

            <td :title="getCustomerStatusTranslated(customer)">
              {{ getCustomerStatusTranslated(customer) }}
            </td>
            <template v-for="selectedBalance in selectedBalances">
              <!-- eslint-disable max-len -->
              <template v-if="customer.balances && customer.balances.length">
                <td
                  :title="getCustomerBalance(customer.balances, selectedBalance.value) | formatMoney"
                  :key="selectedBalance.value"
                >
                  {{ getCustomerBalance(customer.balances, selectedBalance.value) | formatBalance }}
                </td>
              </template>
              <!-- eslint-enable max-len -->
              <template v-else>
                <td :key="selectedBalance.value">
                  &mdash;
                </td>
              </template>
            </template>

            <td class="customers-table__btn-td">
              <button
                class="customers-table__details-btn"
                @click="$emit(EVENTS.detailsButtonClicked, customer)"
              >
                {{ 'customers-table.details-btn' | globalize }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import TickField from '@/vue/fields/TickField'
import TableSorter from '@/vue/common/TableSorter'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { CustomerRecord } from '@/js/records/entities/customer.record'

const EVENTS = {
  detailsButtonClicked: 'details-button-clicked',
  setSortAndReloadList: 'set-sort-and-reload-list',
}

const SORT_KEYS = {
  email: 'email',
  firstName: 'first_name',
  lastName: 'last_name',
}

export default {
  name: 'customers-table',

  components: {
    TickField,
    TableSorter,
  },

  props: {
    customersList: {
      type: Array,
      required: true,
      validator (value) {
        return value.every(item => item instanceof CustomerRecord)
      },
    },
    selectedBalances: {
      type: Array,
      default: _ => [],
    },
  },

  data () {
    return {
      isIssuanceMode: false,
      issuanceReceivers: [],
      activeSortKey: '',
      EVENTS,
      SORT_KEYS,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },

  created () {
    this.listen()
  },
  methods: {
    listen () {
      Bus.on('customers:hideSelect', () => {
        this.isIssuanceMode = false
        this.issuanceReceivers = []
      })
    },

    getCustomerStatusTranslated (customer) {
      let translationId

      if (customer.isNotRegistered) {
        translationId = 'customers-table.not-registered-status-td'
      } else if (customer.isActive) {
        translationId = 'customers-table.active-status-td'
      } else if (customer.isBlocked) {
        translationId = 'customers-table.blocked-status-td'
      } else {
        translationId = '[UNKNOWN]'
      }

      return this.$options.filters.globalize(translationId)
    },

    toggleIssuanceMode () {
      if (this.isIssuanceMode) {
        this.isIssuanceMode = false
        this.issuanceReceivers = []
      } else {
        this.isIssuanceMode = true
      }
    },

    doMassIssuance () {
      Bus.emit('customers:massIssue', { receivers: this.issuanceReceivers })
    },

    getCustomerName (customer) {
      if (customer.firstName && customer.lastName) {
        return `${customer.firstName} ${customer.lastName}`
      } else {
        return '-'
      }
    },

    getCustomerBalance (customerBalances, selectedBalance) {
      const balance = customerBalances
        .find(i => i.assetCode === selectedBalance)
      return balance.amount
    },

    setActiveKeyAndEmitSort (sort) {
      this.activeSortKey = sort.key
      this.$emit(EVENTS.setSortAndReloadList, sort)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

// TODO: move to tick field
$disabled-tick-bg: #eeeeee;
$disabled-tick-border: #e9e9e9;

.customers-table__details-btn {
  font-size: 1.2rem;
  color: $col-btn;
}

.customers-table__cb-td {
  min-width: 4.4rem;
  width: 4.4rem;
  padding-right: 0;

  & + td,
  & + th {
    padding-left: 1rem;
  }
}

.customers-table__cb {
  position: relative;
  top: 0.2rem;

  &[disabled] /deep/ .tick-field__tick,
  &[disabled] /deep/ .tick-field__input {
    cursor: not-allowed;
    background-color: $disabled-tick-bg;
    border-color: $disabled-tick-border;
  }
}

.customers-table__btn-td {
  min-width: 12rem;
  width: 12rem;
}

.customers-table__table {
  min-width: 60rem;
}

.customers-table__head-actions {
  margin-bottom: 2.4rem;
  display: flex;
}

.customers-table__head-actions-group {
  display: flex;

  & > button + button {
    margin-left: 1.2rem;
  }
}

.customers-table__customer-td {
  max-width: 16rem;
}
</style>
