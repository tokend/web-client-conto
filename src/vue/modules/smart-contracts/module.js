import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SmartContractsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/smart-contracts'),
      ...opts,
    })
  }
}
