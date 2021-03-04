import { base } from '@tokend/js-sdk'

// eslint-disable-next-line max-len
export async function buildIssuanceCreationOperation ({ assetCode, amount, receiver }) {
  const operation = base.CreateIssuanceRequestBuilder
    .createIssuanceRequest({
      asset: assetCode,
      amount: amount,
      receiver: receiver,
      reference: btoa(Math.random()),
      creatorDetails: {},
    })

  return operation
}
