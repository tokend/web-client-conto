<template>
  <p
    class="text-logo"
  >
    {{ getFirstLetterOfName }}
  </p>
</template>

<script>

export default {
  name: 'text-logo',
  props: {
    text: { type: String, required: true },
  },

  computed: {
    getFirstLetterOfName () {
      return this.text.substr(0, 1).toUpperCase()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.text-logo {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-text-logo-background;
  color: $col-text-logo-text;
}
</style>
