<template>
  <div
    class="skeleton-loader"
    :class="`skeleton-loader--${TEMPLATES[template]}`"
  >
    <div
      class="skeleton-loader__stub"
      :class="`skeleton-loader__stub--${TEMPLATES[template]}`"
      :style="{
        ...(width ? { width: '100%', maxWidth: width} : {}),
      }"
    />
  </div>
</template>

<script>
const TEMPLATES = {
  bigIcon: 'big-icon',
  smallIcon: 'small-icon',
  bigString: 'big-string',
  smallString: 'small-string',
  xSmallString: 'x-small-string',
  saleViewer: 'sale-viewer',
  imageViewer: 'image-viewer',
  fieldViewer: 'field-viewer',
  mediumButton: 'medium-button',
  smallButton: 'small-button',
  fillMode: 'fill-mode',
}

export default {
  name: 'skeleton-loader',
  props: {
    template: {
      type: String,
      required: true,
      validator (value) {
        return Object.keys(TEMPLATES).includes(value)
      },
    },
    width: {
      type: [String],
      default: '',
      required: false,
    },
  },
  data: _ => ({
    TEMPLATES,
  }),
}
</script>

<style scoped lang="scss">
@import '~@scss/variables.scss';

.skeleton-loader {
  z-index: $z-skeleton-loader;

  &--big-icon {
    display: flex;
    justify-content: center;
  }

  &--sale-viewer {
    margin: 1rem;
  }

  &--medium-button {
    max-width: 18rem;
    width: 100%;
  }

  &--small-button {
    max-width: 9rem;
    width: 100%;
  }

  &--fill-mode {
    width: 100%;
    height: 100%;
  }
}

.skeleton-loader__stub {
  position: relative;
  background-color: $col-background-skeleton-loader;
  border-radius: 5rem;

  &:after {
    content: '';
    width: 45%;
    height: 100%;
    position: absolute;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
    );
    left: 0;
    top: 0;
    animation: skeleton-loader__gradient-animation 0.8s linear infinite;
  }

  &--big-string {
    display: inline-block;
    height: 1.8rem;
    width: 100%;
    max-width: 15rem;
  }

  &--small-string {
    display: inline-block;
    height: 1.4rem;
    width: 100%;
    max-width: 10rem;
  }

  &--x-small-string {
    display: inline-block;
    height: 1rem;
    width: 100%;
    max-width: 8rem;
  }

  &--big-icon {
    height: 5.5rem;
    width: 5.5rem;
  }

  &--small-icon {
    height: 3.7rem;
    width: 3.7rem;
    border-radius: 0.4rem;
  }

  &--sale-viewer {
    border-radius: 0.4rem;
    height: 40rem;
  }

  &--image-viewer {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  &--field-viewer {
    width: 100%;
    height: 1.4rem;
  }

  &--medium-button {
    height: 2.2rem;
  }

  &--small-button {
    height: 2.2rem;
  }

  &--fill-mode {
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;
  }
}

@keyframes skeleton-loader__gradient-animation {
  from {
    left: -50%;
  }

  to {
    left: 100%;
  }
}
</style>
