<template>
  <div class="customers-table">
    <template v-if="customersList.length">
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
    </template>

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
              {{ 'customers-table.customer-th' | globalize }}
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

        <tbody v-if="customersList.length">
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
              :title="getCustomerNameOrEmail(customer)"
              class="customers-table__customer-td"
            >
              {{ getCustomerNameOrEmail(customer) }}
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

        <empty-tbody-placeholder
          v-else-if="isLoaded"
          :colspan="4"
          :message="'customers-table.no-data-msg' | globalize"
        />

        <empty-tbody-placeholder
          v-else-if="isLoadFailed"
          :colspan="4"
          :message="'customers-table.error-msg' | globalize"
        />

        <skeleton-loader-table-body
          v-else
          :cells="4"
          template="smallString"
        />
      </table>
    </div>
  </div>
</template>

<script>
import TickField from '@/vue/fields/TickField'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { CustomerRecord } from '@/js/records/entities/customer.record'

const EVENTS = {
  detailsButtonClicked: 'details-button-clicked',
}

export default {
  name: 'customers-table',

  components: {
    TickField,
    EmptyTbodyPlaceholder,
    SkeletonLoaderTableBody,
  },

  props: {
    customersList: {
      type: Array,
      required: true,
      validator (value) {
        return value.every(item => item instanceof CustomerRecord)
      },
    },

    isLoaded: {
      type: Boolean,
      require: true,
    },

    isLoadFailed: {
      type: Boolean,
      require: true,
    },
  },

  data () {
    return {
      isIssuanceMode: false,
      issuanceReceivers: [],
      selectedBalances: [],
      EVENTS,
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
      Bus.on('customers:showBalances', payload => {
        this.selectedBalances = payload || []
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

    getCustomerNameOrEmail (customer) {
      if (customer.firstName && customer.lastName) {
        return `${customer.firstName} ${customer.lastName}`
      } else {
        return customer.email
      }
    },

    getCustomerBalance (customerBalances, selectedBalance) {
      const balance = customerBalances
        .find(i => i.assetCode === selectedBalance)
      return balance.amount
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
