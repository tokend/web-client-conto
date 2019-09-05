import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { SmartContractsModule } from '@/vue/modules/smart-contracts/module'
import { CustomersListPageModule } from './customers-list-page-module'

export class CustomersPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Customers'),
      allowedSubmodules: [
        CustomersListPageModule,
        SmartContractsModule,
      ],
    })
  }
}
