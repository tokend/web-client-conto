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
      />

      <add-quote-assets-step-form
        v-show="currentStep === STEPS.advanced.number"
        :is-disabled.sync="isDisabled"
        @submit="submit"
      />
    </form-stepper>
  </div>
</template>

<script>
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'

import InformationStepForm from './components/information-step-form'
import AddQuoteAssetsStepForm from './components/add-quote-assets-step-form'
import FormStepper from '@/vue/common/FormStepper'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
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
  name: 'create-asset-form-simplified-module',
  components: {
    InformationStepForm,
    AddQuoteAssetsStepForm,
    FormStepper,
  },
  mixins: [ManageAssetRequestMixin],

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

        await this.submitCreateAssetRequest(this.requestId)
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
