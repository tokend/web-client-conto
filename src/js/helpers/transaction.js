import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { store, vuexTypes } from '@/vuex/index'

export async function signAndSendTx (tx) {
  const secretSeed = await store.dispatch(vuexTypes.DECRYPT_SECRET_SEED)
  const keypair = base.Keypair.fromSecret(secretSeed)
  const transaction = new base.Transaction(tx)
  transaction.sign(keypair)
  const envelopeTx = getEnvelopeTx(transaction)
  await api.postTxEnvelope(envelopeTx)
}

function getEnvelopeTx (tx) {
  return tx.toEnvelope().toXDR().toString('base64')
}
