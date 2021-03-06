import { vuexTypes, rootModule } from './index'

import account from './account.module'
import assets from './assets.module'
import factors from './factors.module'
import kyc from './kyc.module'
import wallet from './wallet.module'
import idleHandler from './idle-handler.module'
import identities from './identities.module'
import businesses from './businesses.module'
import movementsHistory from './movements-history.module'
import sponsorshipRequests from './sponsorship-requests.module'
import kycRecovery from './kyc-recovery.module'

describe('vuex types unit tests', () => {
  const getModuleKeys = (module) => {
    return Object.keys({
      ...module.actions,
      ...module.mutations,
      ...module.getters,
    })
  }

  it('every entity in modules should be mentioned in vuex-types', () => {
    for (const key of getModuleKeys(rootModule)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(account)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(assets)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(kyc)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(factors)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(wallet)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(identities)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(idleHandler)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(movementsHistory)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(sponsorshipRequests)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(businesses)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(kycRecovery)) {
      expect(vuexTypes).to.have.property(key)
    }
  })

  it('every key described in vuex-types should be a real vuex-entity', () => {
    const moduleKeys = [
      ...getModuleKeys(rootModule),
      ...getModuleKeys(account),
      ...getModuleKeys(assets),
      ...getModuleKeys(kyc),
      ...getModuleKeys(factors),
      ...getModuleKeys(wallet),
      ...getModuleKeys(identities),
      ...getModuleKeys(idleHandler),
      ...getModuleKeys(movementsHistory),
      ...getModuleKeys(sponsorshipRequests),
      ...getModuleKeys(businesses),
      ...getModuleKeys(kycRecovery),
    ]

    for (const key of Object.keys(vuexTypes)) {
      expect(moduleKeys).to.include(key)
    }
  })

  it('every key described in vuex-types should be equal to it\'s value', () => {
    for (const [key, value] of Object.entries(vuexTypes)) {
      expect(key).to.equal(value)
    }
  })
})
