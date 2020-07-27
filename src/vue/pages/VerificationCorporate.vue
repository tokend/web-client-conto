<template>
  <div class="verification-corporate">
    <p class="verification-corporate__account-info-title">
      {{ 'verification-corporate.account-information-lbl' | globalize }}
    </p>

    <kyc-corporate-form
      class="verification-corporate__tag"
      :former="former"
      @submitted="onFormSubmit"
    />
  </div>
</template>

<script>
import KycCorporateForm from '@/vue/forms/KycCorporateForm'
import { scrollToTop } from '@/js/helpers/scroll-helpers'
import { KycCorporateFormer } from '@/js/formers/KycCorporateFormer'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'verification-corporate',
  components: {
    KycCorporateForm,
  },

  computed: {
    ...mapGetters({ kycRequest: vuexTypes.kycRequest }),

    former () {
      return new KycCorporateFormer(this.kycRequest)
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

.verification-corporate {
  margin-top: 4rem;
}

.verification-corporate__account-info-title {
  color: $col-text;
  font-size: 1.3rem;
}

.verification-corporate__tag {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}
</style>
