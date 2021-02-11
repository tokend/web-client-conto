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
        @submit="submit"
        @update-is-sellable="setIsSellableAsset"
        :former="former"
      />

      <add-quote-assets-step-form
        v-show="currentStep === STEPS.advanced.number"
        :is-disabled.sync="isDisabled"
        @submit="submit"
        :former="former"
      />
    </form-stepper>
  </div>
</template>

<script>
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'

import InformationStepForm from './components/InformationStepForm'
import AddQuoteAssetsStepForm from './components/AddQuoteAssetsStepForm'
import FormStepper from '@/vue/common/FormStepper'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { CreateAssetFormer } from '@/js/formers/CreateAssetFormer'
import AtomicSwapAskMixin from '@/vue/mixins/atomic-swap-ask.mixin'
import { buildIssuanceCreationOperation } from '@/js/helpers/issuance-creation'
import { buildPairCreationRequestOperation } from '@/js/helpers/pair-creation'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'

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
  name: 'create-asset-form-simplified',
  components: {
    InformationStepForm,
    AddQuoteAssetsStepForm,
    FormStepper,
  },

  mixins: [ManageAssetRequestMixin, AtomicSwapAskMixin],

  props: {
    former: {
      type: CreateAssetFormer,
      default: () => new CreateAssetFormer(),
    },
  },

  data: _ => ({
    isDisabled: false,
    currentStep: 1,
    isSellableAsset: false,
    STEPS,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.businessStatsQuoteAsset,
      vuexTypes.accountBalanceId,
      vuexTypes.accountBalanceByCode,
    ]),

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
    moveToNextStep () {
      this.currentStep++
      if (this.$el.parentElement) {
        this.$el.parentElement.scrollTop = 0
      }
    },

    async submit (form) {
      try {
        this.collectAssetAttributes(form)
        if (form.isSellable) {
          this.moveToNextStep()
          return
        }
        this.isDisabled = true

        let operation = await this.former.buildOps()
        await api.postOperations(operation)
        await api.postOperations(
          await buildIssuanceCreationOperation(this.former.attrs.assetCode)
        )
        buildPairCreationRequestOperation(
          this.former.attrs.assetCode,
          this.former.attrs.price
        )

        if (this.former.attrs.isSellable) {
          await this.createAtomicSwapAsk({
            baseAssetCode: this.former.attrs.assetCode,
            amount: this.former.attrs.amountToSell,
            price: this.former.attrs.price,
            quoteAssets: this.former.attrs.quoteAssets,
          })
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
