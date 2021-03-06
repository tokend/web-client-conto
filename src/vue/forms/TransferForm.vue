<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'transfer-form.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="assets.length">
          <form
            id="transfer-form"
            @submit.prevent="trySend"
          >
            <div class="app__form-row">
              <div class="app__form-field">
                <select-field
                  name="transfer-asset"
                  :value="form.asset.code"
                  @input="setAsset"
                  :label="'transfer-form.asset-lbl' | globalize"
                  :readonly="formMixin.isDisabled"
                >
                  <option
                    v-for="asset in assets"
                    :key="asset.code"
                    :value="asset.code"
                  >
                    {{ asset.name }}
                  </option>
                </select-field>
                <template v-if="form.asset.code">
                  <p class="app__form-field-description">
                    {{
                      'transfer-form.balance' | globalize({
                        amount: balance.balance,
                        available: balance.balance
                      })
                    }}
                  </p>
                </template>
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <amount-input-field
                  v-model="form.amount"
                  name="transfer-amount"
                  @change="former.setAttr('amount', form.amount)"
                  validation-type="outgoing"
                  :max="balance.balance"
                  :label="'transfer-form.amount-lbl' | globalize"
                  :asset="form.asset"
                  is-max-button-shown
                  :readonly="formMixin.isDisabled"
                />
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <input-field
                  name="transfer-recipient"
                  v-model.trim="form.recipient"
                  :label="'transfer-form.recipient-lbl' | globalize"
                  :error-message="getFieldErrorMessage('form.recipient')"
                  @blur="touchField('form.recipient')"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <textarea-field
                  name="transfer-description"
                  v-model="form.subject"
                  @input="former.setAttr('subject', form.subject)"
                  :label="'transfer-form.subject-lbl' | globalize({
                    length: MAX_SUBJECT_LENGTH
                  })"
                  :maxlength="MAX_SUBJECT_LENGTH"
                  :readonly="formMixin.isDisabled"
                />
              </div>
            </div>

            <div class="app__form-actions">
              <template v-if="formMixin.isConfirmationShown">
                <form-confirmation
                  message-id="transfer-form.approving-msg"
                  @ok="trySend"
                  @cancel="hideConfirmationForm"
                />
              </template>
              <button
                v-ripple
                v-else
                type="submit"
                class="app__form-submit-btn app__button-raised"
                :disabled="formMixin.isDisabled"
                form="transfer-form"
              >
                {{ 'transfer-form.submit-btn' | globalize }}
              </button>
            </div>
          </form>
        </template>

        <template v-else>
          <no-data-message
            class="mass-payment-form__no-data-message"
            icon-name="coins"
            :title="'transfer-form.no-assets-heading' | globalize"
            :message="'transfer-form.no-assets' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <transfer-form-skeleton-loader />
    </template>
  </div>
</template>

<script>
import TransferFormSkeletonLoader from './TransferFormSkeletonLoader'
import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import ErrorMessage from '@/vue/common/ErrorMessage'
import config from '@/config'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { TransferFormer } from '@/js/formers/TransferFormer'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { base } from '@tokend/js-sdk'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import {
  required,
  emailOrPhoneNumberOrTelegram,
  email,
  sendYourself,
} from '@validators'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

const MAX_SUBJECT_LENGTH = 1000

export default {
  name: 'transfers-form',
  components: {
    TransferFormSkeletonLoader,
    ErrorMessage,
    NoDataMessage,
  },
  mixins: [
    FormMixin,
    IdentityGetterMixin,
  ],
  props: {
    assetToTransfer: { type: String, default: '' },
    former: { type: TransferFormer, default: () => new TransferFormer() },
  },
  data: () => ({
    MAX_SUBJECT_LENGTH,
    recipientAccountId: '',
    isSendingOnNotExistAccount: false,
    form: {
      asset: {},
      amount: '',
      recipient: '',
      subject: '',
    },
    isLoaded: false,
    isLoadFailed: false,
    isFeesLoaded: false,
    vueRoutes,
    config,
  }),
  validations () {
    return {
      form: {
        recipient: this.isSendingOnNotExistAccount
          ? {
            required,
            email,
            sendYourself: sendYourself(this.form.recipient, this.walletEmail),
          }
          : {
            required,
            emailOrPhoneNumberOrTelegram,
            sendYourself: sendYourself(this.form.recipient, this.walletEmail),
          },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.transferableAssetsBalances,
      vuexTypes.accountBalanceByCode,
      vuexTypes.walletEmail,
    ]),
    balance () {
      const balance = this.accountBalanceByCode(this.form.asset.code)
      this.former.setAttr('sourceBalanceId', balance.id)
      return balance
    },
    assets () {
      return this.transferableAssetsBalances
        .filter(i => +i.balance > 0)
        .map(i => i.asset)
    },
  },
  async created () {
    try {
      await this.loadCurrentBalances()
      this.setAsset()
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
    this.isLoaded = true
  },
  methods: {
    globalize,
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.formMixin.isConfirmationShown = false
      try {
        const operation = this.former.buildOps()
        await api.postOperations(operation)

        Bus.success('transfer-form.payment-successful')
        this.$emit(EVENTS.operationSubmitted)

        await this.loadCurrentBalances()
        this.isFeesLoaded = false
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async trySend () {
      if (!this.isFormValid()) return

      this.disableForm()
      const recipientAccountId =
        await this.getCounterparty(this.form.recipient)

      if (recipientAccountId) {
        this.isSendingOnNotExistAccount = false
        this.recipientAccountId = recipientAccountId
        this.former.setAttr('destination', this.recipientAccountId)
        this.submit()
      } else {
        if (this.formMixin.isConfirmationShown) {
          this.sendOnNotExistAccount()
        } else {
          this.isSendingOnNotExistAccount = true
          this.formMixin.isConfirmationShown = true
        }
      }
    },
    async sendOnNotExistAccount () {
      if (this.isFormValid()) {
        try {
          this.formMixin.isConfirmationShown = false
          // eslint-disable-next-line max-len
          this.recipientAccountId = await this.createAccountAndGetAccountIdByEmail(this.form.recipient)
          this.former.setAttr('destination', this.recipientAccountId)
          this.submit()
        } catch (e) {
          ErrorHandler.process(e)
          this.enableForm()
        }
      } else {
        this.enableForm()
      }
    },
    async getCounterparty (recipient) {
      if (!base.Keypair.isValidPublicKey(recipient)) {
        return this.getAccountIdByIdentifier(recipient)
      } else {
        return recipient
      }
    },
    hideConfirmationForm () {
      this.hideConfirmation()
      this.isSendingOnNotExistAccount = false
    },
    setAsset (payload) {
      const assetCode = payload || this.assetToTransfer
      this.form.asset = this.assets
        .find(asset => asset.code === assetCode) ||
        this.assets[0] ||
        {}
      this.former.setAttr('assetCode', this.form.asset.code)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import '~@scss/variables';

.transfer__fee-box {
  padding-top: 4rem;
}

.transfer__fee-box-heading {
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 400;
  display: block;
  font-size: 1.6rem;
  color: $col-text-page-heading;
}

.transfer__fee-box-heading:not(:first-child) {
  margin-top: 2.5rem;
}

.transfer__fee {
  color: $col-details-value;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 0;
}

.transfer__no-fee-msg {
  color: $col-details-label;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 1rem 0;
}

.transfer__fee-type {
  color: $col-details-label;
}

.transfer-form__discover-asset-btn {
  margin-top: 2.5rem;
}
</style>
