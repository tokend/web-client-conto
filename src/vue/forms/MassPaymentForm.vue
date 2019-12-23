<template>
  <div class="mass-payment-form">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'mass-payment-form.error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="transferableBalancesAssets.length">
          <form>
            <div class="app__form-row">
              <div class="app__form-field">
                <p class="mass-payment-form__description">
                  <!-- eslint-disable-next-line max-len -->
                  {{ 'mass-payment-form.how-to-receivers-paragraph' | globalize }}
                </p>

                <textarea-field
                  name="mass-payment-receivers"
                  v-model="form.receivers"
                  :label="'mass-payment-form.receivers-lbl' | globalize"
                  :disabled="formMixin.isDisabled"
                  @blur="touchField('form.receivers')"
                  :error-message="getFieldErrorMessage('form.receivers')"
                  rows="8"
                />
              </div>
            </div>

            <multiple-assets-send-form
              :is-disabled.sync="formMixin.isDisabled"
              :assets="transferableBalancesAssets"
              @submit="(form.assets = $event) && submit()"
            />
          </form>
        </template>

        <template v-else>
          <no-data-message
            class="mass-payment-form__no-data-message"
            icon-name="coins"
            :title="'mass-payment-form.no-assets-msg-title' | globalize"
            :message="'mass-payment-form.no-assets-msg-description' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <loader
        message-id="mass-payment-form.loading-msg"
      />
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Loader from '@/vue/common/Loader'
import MultipleAssetsSendForm from '@/vue/forms/MultipleAssetsSendForm'

import _chunk from 'lodash/chunk'

import { required } from '@validators'

import { CsvUtil } from '@/js/utils/csv.util'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { MathUtil } from '@/js/utils'
import { globalize } from '@/vue/filters/globalize'

const EVENTS = {
  submitted: 'submitted',
}

const NUMBER_OF_OPERATIONS = 99

export default {
  name: 'mass-payment-form',

  components: {
    NoDataMessage,
    ErrorMessage,
    Loader,
    MultipleAssetsSendForm,
  },

  mixins: [FormMixin, IdentityGetterMixin],

  props: {
    receivers: {
      type: Array, /** {@link CustomerRecord} **/
      default: _ => [],
    },
    amount: { type: [String, Number], default: '' },
  },

  data () {
    return {
      form: {
        assets: [],
        receivers: '',
      },
      isEmailNotRegistered: false,
      isLoaded: false,
      isLoadFailed: false,
    }
  },

  validations () {
    return {
      form: {
        receivers: {
          required,
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.transferableAssetsBalances,
      vuexTypes.accountBalanceByCode,
      vuexTypes.accountId,
      vuexTypes.assetByCode,
    ]),

    transferableBalancesAssets () {
      return this.transferableAssetsBalances
        .filter(i => +i.balance > 0)
        .map(i => i.asset)
    },
  },

  async created () {
    this.form.receivers = this.receivers.map(i => i.email).join(', ')

    try {
      await this.loadAssets()
      await this.loadCurrentBalances()
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
    this.isLoaded = true
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      try {
        const operations = await this.buildOperationsToSubmit()
        if (this.isEmailNotRegistered) {
          Bus.error('mass-payment-form.mass-send-not-available')
          this.enableForm()
          return
        } else if (!operations.length) {
          Bus.error('mass-payment-form.no-receivers-found')
          this.enableForm()
          return
        }

        let overpaymentAssets = []

        this.form.assets.forEach(asset => {
          const isOverpayment = MathUtil.compare(
            MathUtil.multiply(operations.length, asset.amount),
            this.accountBalanceByCode(asset.code).balance,
          ) > 0

          if (isOverpayment) {
            overpaymentAssets.push(this.assetByCode(asset.code).name)
          }
        })

        if (overpaymentAssets.length) {
          const msg = globalize('mass-payment-form.overpayment-error-notif', {
            assets: overpaymentAssets.join(', '),
          })
          Bus.error(msg)
          this.enableForm()
          return
        }

        // Core cannot handle more than 100 operations per transaction
        const chunkArray = _chunk(operations, NUMBER_OF_OPERATIONS)

        await Promise.all(chunkArray.map(
          array => api.postOperations(...array)
        ))

        await this.loadCurrentBalances()
        this.clearFieldsWithOverriding({
          receivers: this.form.receivers,
          assets: this.form.assets,
        })
        this.$emit(EVENTS.submitted)
        Bus.success('mass-payment-form.payment-successfully-notification')
        Bus.emit('customers:hideSelect')
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.enableForm()
    },

    async getReceiverIdByEmail (email) {
      const receiver = this.receivers.find(i => i.email === email)
      if (receiver) {
        return receiver.accountId
      } else {
        return this.getAccountIdByIdentifier(email)
      }
    },

    async getOperationsByEmail (email, proxyPaymentAccountId) {
      const receiverId = await this.getReceiverIdByEmail(email)
      if (receiverId) {
        return this.form.assets.map(asset => {
          return this.getOperation({
            destinationAccountId: receiverId,
            subject: { subject: '' },
            amount: asset.amount,
            assetCode: asset.code,
          })
        })
      } else {
        this.isEmailNotRegistered = true
      }
    },

    async buildOperationsToSubmit () {
      const emails = CsvUtil.parseConcat(this.form.receivers, {
        trim: true,
        filterEmpty: true,
        delimiters: CsvUtil.delimiters.common,
      })

      this.isEmailNotRegistered = false

      const emailsWithoutDuplicate = [...new Set(emails)]

      const operations = await Promise.all(
        emailsWithoutDuplicate.map(email => this.getOperationsByEmail(email))
      )
      return operations.flat()
    },

    getOperation ({ destinationAccountId, amount, assetCode, subject }) {
      return base
        .PaymentBuilder.payment({
          sourceBalanceId: this.accountBalanceByCode(assetCode).id,
          destination: destinationAccountId,
          amount: String(amount),
          feeData: {
            sourceFee: {
              percent: '0',
              fixed: '0',
            },
            destinationFee: {
              percent: '0',
              fixed: '0',
            },
            sourcePaysForDest: false,
          },
          subject: JSON.stringify(subject),
          asset: assetCode,
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import '@/scss/variables';

p.mass-payment-form__description {
  line-height: 1.5;
  font-size: 1.6rem;
  margin-bottom: 2.4rem;
}
</style>
