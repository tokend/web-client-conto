import { base, Document } from '@tokend/js-sdk'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import { api } from '@/api'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/index'
import { DateUtil } from '@/js/utils'

const NEW_UPDATE_ASSET_REQUEST_ID = '0'

export default {
  data () {
    return {
      collectedAttributes: {},
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.statsQuoteAsset,
    ]),
  },

  methods: {
    async getUpdateAssetRequestById (id, accountId) {
      const endpoint = `/v3/update_asset_requests/${id}`
      const { data: record } = await api.getWithSignature(endpoint, {
        filter: {
          requestor: accountId,
        },
        include: ['request_details'],
      })

      return new UpdateAssetRequest(record)
    },

    async getUpdatableRequest (assetCode, accountId) {
      const pendingRequest = await this.getLatestUpdateAssetRequest(
        REQUEST_STATES.pending,
        accountId,
        assetCode
      )
      const rejectedRequest = await this.getLatestUpdateAssetRequest(
        REQUEST_STATES.rejected,
        accountId,
        assetCode
      )

      return pendingRequest || rejectedRequest
    },

    async getLatestUpdateAssetRequest (requestState, accountId, assetCode) {
      const endpoint = '/v3/update_asset_requests'
      const { data: requests } = await api.getWithSignature(endpoint, {
        page: {
          limit: 1,
          order: 'desc',
        },
        filter: {
          requestor: accountId,
          state: requestState,
          'request_details.asset': assetCode,
        },
        include: ['request_details'],
      })

      return requests.length ? new UpdateAssetRequest(requests[0]) : null
    },

    async submitUpdateAssetRequest (requestId) {
      const assetDocuments = [
        this.collectedAttributes.logo,
        this.collectedAttributes.terms,
      ]
      await Document.uploadDocumentsDeep(assetDocuments)

      await api.postOperations(
        this.$buildAssetUpdateRequestOperation(requestId),
      )
    },

    $buildAssetUpdateRequestOperation (requestId) {
      const logo = this.collectedAttributes.logo
      const terms = this.collectedAttributes.terms

      const opts = {
        requestID: requestId ? String(requestId) : NEW_UPDATE_ASSET_REQUEST_ID,
        code: this.collectedAttributes.code,
        policies: this.collectedAttributes.policies,
        creatorDetails: {
          name: this.collectedAttributes.name,
          logo: logo,
          terms: terms,
          description: this.collectedAttributes.description,
          stellar: {},
          ...(this.collectedAttributes.expirationDate
            ? { 'expires_at': DateUtil.toTimestamp(this.collectedAttributes.expirationDate) }
            : {}
          ),
        },
      }

      return base.ManageAssetBuilder.assetUpdateRequest(opts)
    },

    collectAssetAttributes (newAttributes) {
      Object.assign(this.collectedAttributes, newAttributes)
    },
  },
}
