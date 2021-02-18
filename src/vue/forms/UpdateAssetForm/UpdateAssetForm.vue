<template>
  <div class="update-asset-form-simplified">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'update-asset-form-simplified.load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <information-step-form
          :is-disabled.sync="isDisabled"
          :former="former"
          @submit="submit"
        />
      </template>
    </template>

    <template v-else>
      <skeleton-loader-step-form />
    </template>
  </div>
</template>

<script>
import SkeletonLoaderStepForm from './components/SkeletonLoaderStepForm'
import InformationStepForm from './components/InformationStepForm'
import ErrorMessage from '@/vue/common/ErrorMessage'
import { AssetFormer } from '@/js/formers/AssetFormer'

import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'update-asset-form',
  components: {
    InformationStepForm,
    SkeletonLoaderStepForm,
    ErrorMessage,
  },
  props: {
    assetCode: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    former: new AssetFormer(),
    informationStepForm: {},
    isLoaded: false,
    isLoadFailed: false,
    isDisabled: false,
  }),

  computed: {
    ...mapGetters({
      getAssetByCode: vuexTypes.assetByCode,
    }),
  },

  async created () {
    this.isLoaded = true
    let asset = this.getAssetByCode(this.assetCode)
    this.former.populate(asset)
  },

  methods: {
    async submit () {
      this.isDisabled = true
      try {
        const operation = await this.former.buildOps()
        await api.postOperations(operation)
        Bus.success('update-asset-form-simplified.request-submitted-msg')
        this.$emit(EVENTS.submitted)
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
