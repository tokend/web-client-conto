<template>
  <div class="create-asset-form">
    <form-stepper
      :steps="getSteps"
      :current-step.sync="currentStep"
      :disabled="isDisabled"
    >
      <information-step-form
        v-show="currentStep === STEPS.information.number"
        :is-disabled.sync="isDisabled"
        @update-is-sellable="setIsSellableAsset"
        @submit="tryToSubmit"
        :former="formerForAsset"
      />

      <add-quote-assets-step-form
        v-show="currentStep === STEPS.advanced.number"
        :is-disabled.sync="isDisabled"
        @submit="submit"
        :former="formerForAtomicSwap"
      />
    </form-stepper>
  </div>
</template>

<script>
import InformationStepForm from './components/InformationStepForm'
import AddQuoteAssetsStepForm from './components/AddQuoteAssetsStepForm'
import FormStepper from '@/vue/common/FormStepper'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetFormer } from '@/js/formers/AssetFormer'
import { AtomicSwapFormer } from '@/js/formers/AtomicSwapFormer'
import { buildIssuanceCreationOperation } from '@/js/helpers/issuance-creation-helper'
import { api } from '@/api'
import config from '@/config'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  submitted: 'submitted',
}

const STEPS = {
  information: {
    number: 1,
  },
  advanced: {
    number: 2,
  },
}

export default {
  name: 'create-asset-form',
  components: {
    InformationStepForm,
    AddQuoteAssetsStepForm,
    FormStepper,
  },

  props: {
    formerForAsset: {
      type: AssetFormer,
      default: () => new AssetFormer(),
    },
    formerForAtomicSwap: {
      type: AtomicSwapFormer,
      default: () => new AtomicSwapFormer(),
    },
  },

  data: _ => ({
    isDisabled: false,
    currentStep: 1,
    isSellableAsset: false,
    STEPS,
  }),

  computed: {
    ...mapGetters({
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      statsQuoteAsset: vuexTypes.statsQuoteAsset,
    }),
    getSteps () {
      return {
        information: {
          number: 1,
          titleId: 'create-asset-form.information-step',
        },
        ...(this.isSellableAsset
          ? {
            advanced: {
              number: 2,
              titleId: 'create-asset-form.advanced-step',
            },
          }
          : {}
        ),
      }
    },
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    moveToNextStep () {
      this.currentStep++
      if (this.$el.parentElement) {
        this.$el.parentElement.scrollTop = 0
      }
    },

    tryToSubmit () {
      if (this.isSellableAsset) {
        this.moveToNextStep()
      } else {
        this.submit()
      }
    },

    async submit () {
      try {
        this.isDisabled = true

        const operations = await this.formerForAsset.buildOps()
        await api.postOperations(...operations)

        await this.loadBalances()

        const buildIssuance = await buildIssuanceCreationOperation({
          assetCode: this.formerForAsset.attrs.assetCode,
          amount: config.MAX_AMOUNT,
          receiver:
            this.accountBalanceByCode(this.formerForAsset.attrs.assetCode).id,
        })
        await api.postOperations(buildIssuance)

        if (this.isSellableAsset) {
          this.formerForAtomicSwap.setAttr('assetCode', this.formerForAsset.attrs.assetCode)
          this.formerForAtomicSwap.setAttr('price', this.formerForAsset.attrs.price)

          let operation = await this.formerForAtomicSwap.buildOp()
          await api.postWithSignature('/integrations/marketplace/offers', operation)
        }

        Bus.success('create-asset-form.request-submitted-msg')
        this.$emit(EVENTS.submitted)
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },

    setIsSellableAsset (value) {
      this.isSellableAsset = value
    },
  },
}
</script>
