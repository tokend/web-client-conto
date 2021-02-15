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
          :record="request || asset"
          :former="former"
          :is-disabled.sync="isDisabled"
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
import {
  getUpdateAssetRequestById,
  getUpdatableRequest,
} from '@/js/helpers/update-asset-request-helper'
import SkeletonLoaderStepForm from './components/SkeletonLoaderStepForm'
import InformationStepForm from './components/InformationStepForm'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { UpdateAssetFormer } from '@/js/formers/UpdateAssetFormer'
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
    requestId: {
      type: String,
      default: '',
    },
    assetCode: {
      type: String,
      default: '',
    },
    former: {
      type: UpdateAssetFormer,
      default: () => new UpdateAssetFormer(),
    },
  },

  data: _ => ({
    request: null,
    asset: null,
    informationStepForm: {},
    isLoaded: false,
    isLoadFailed: false,
    isDisabled: false,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      getAssetByCode: vuexTypes.assetByCode,
    }),
  },

  async created () {
    await this.init()
    this.isLoaded = true
  },

  methods: {
    async init () {
      try {
        await this.loadUpdateAssetRecord()
        this.former.populate(this.request || this.asset)
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async loadUpdateAssetRecord () {
      const request = await this.getUpdateRequest()

      if (request) {
        this.request = request
      } else {
        this.asset = this.getAssetByCode(this.assetCode)
      }
    },

    async getUpdateRequest () {
      let request

      if (this.requestId) {
        request = await getUpdateAssetRequestById(
          this.requestId,
          this.accountId
        )
      } else if (this.assetCode) {
        request = await getUpdatableRequest(this.assetCode, this.accountId)
      }

      return request
    },

    async submit () {
      this.isDisabled = true
      try {
        const operation = await this.former.buildOp()
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
