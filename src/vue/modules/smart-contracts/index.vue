<template>
  <div class="smart-contracts">
    <smart-contract-form />
    <accrual-table
      class="smart-contracts__accrual-table"
    />
  </div>
</template>

<script>
import SmartContractForm from './components/smart-contract-form'
import AccrualTable from './components/accrual-table'
export default {
  name: 'smart-contracts',
  components: {
    SmartContractForm,
    AccrualTable,
  },
}
</script>

<style lang="scss" scoped>
  .smart-contracts__accrual-table {
    padding-top: 5rem;
  }
</style>
