<template>
  <p
    class="promo-code-logo"
  >
    {{ getFirstLetterOfName }}
  </p>
</template>

<script>

export default {
  name: 'promo-code-logo',
  props: {
    name: { type: String, required: true },
  },

  computed: {
    getFirstLetterOfName () {
      return this.name.substr(0, 1).toUpperCase()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.promo-code-logo {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-promo-code-logo-background;
  color: $col-promo-code-logo-text;
}
</style>
