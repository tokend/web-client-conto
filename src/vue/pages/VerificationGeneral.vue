<template>
  <div class="verification-general">
    <p class="verification-general__account-info-title">
      {{ 'verification-general.account-information-lbl' | globalize }}
    </p>

    <kyc-general-form
      class="verification-general__tag"
      :former="former"
      @submitted="onFormSubmit"
    />
  </div>
</template>

<script>
import KycGeneralForm from '@/vue/forms/KycGeneralForm'
import { scrollToTop } from '@/js/helpers/scroll-helpers'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'

export default {
  name: 'verification-general',
  components: {
    KycGeneralForm,
  },

  computed: {
    ...mapGetters([
      vuexTypes.kycRequest,
    ]),

    former () {
      return new KycGeneralFormer(this.kycRequest)
    },
  },

  methods: {
    async onFormSubmit () {
      scrollToTop()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';

.verification-general {
  margin-top: 4rem;
}

.verification-general__account-info-title {
  color: $col-text;
  font-size: 1.3rem;
}

.verification-general__tag {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}

</style>
