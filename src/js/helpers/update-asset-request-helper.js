import { api } from '@/api'
import { REQUEST_STATES } from '@/js/const/request-states.const'
import {
  UpdateAssetRequest,
} from '@/js/records/entities/update-asset-request.record'

export async function getUpdateAssetRequestById (id, accountId) {
  const endpoint = `/v3/update_asset_requests/${id}`
  const { data: record } = await api.getWithSignature(endpoint, {
    filter: {
      requestor: accountId,
    },
    include: ['request_details'],
  })

  return new UpdateAssetRequest(record)
}

export async function getUpdatableRequest (assetCode, accountId) {
  const pendingRequest = await _getLatestUpdateAssetRequest(
    REQUEST_STATES.pending,
    accountId,
    assetCode
  )
  const rejectedRequest = await _getLatestUpdateAssetRequest(
    REQUEST_STATES.rejected,
    accountId,
    assetCode
  )

  return pendingRequest || rejectedRequest
}

// eslint-disable-next-line max-len
async function _getLatestUpdateAssetRequest (requestState, accountId, assetCode) {
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
}
