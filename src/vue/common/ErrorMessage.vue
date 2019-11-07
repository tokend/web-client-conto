<template>
  <div class="error-message">
    <i
      :class="`mdi mdi-${iconName}`"
      class="error-message__icon"
    />
    <h2 class="error-message__title" v-if="title">
      {{ title }}
    </h2>
    <p class="error-message__message" v-if="message">
      {{ message }}
    </p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'error-message',
  props: {
    iconName: { type: String, default: 'alert-outline' },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';

  .error-message {
    text-align: center;
    max-width: 52rem;
    margin: 0 auto;
    padding: 0 0.8rem;
  }

  .error-message__title {
    margin-bottom: 0.8rem;
    color: $col-error-message-text;
  }

  .error-message__message {
    color: $col-error-message-description;
  }

  .error-message__icon {
    color: $col-error-message-icon-color;
    font-size: 7.4rem;
  }
</style>
