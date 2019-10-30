<template>
  <div class="card">
    <div v-if="isMediaDisplay" class="card__media">
      <slot :name="SLOT_NAMES.media" />
    </div>
    <div class="card__body">
      <div v-if="isHeaderDisplay" class="card__header">
        <slot :name="SLOT_NAMES.header" />
      </div>
      <div v-if="isSubheadDisplay" class="card__subhead">
        <slot :name="SLOT_NAMES.subhead" />
      </div>
      <div
        class="card__content"
        v-if="isContentDisplay"
      >
        <p class="card__content-text">
          <slot :name="SLOT_NAMES.content" />
        </p>
      </div>
    </div>
    <div v-if="isActionsDisplay" class="card__actions">
      <slot :name="SLOT_NAMES.actions" />
    </div>
  </div>
</template>

<script>
const SLOT_NAMES = {
  media: 'media',
  header: 'header',
  subhead: 'subhead',
  content: 'content',
  actions: 'actions',
}
export default {
  name: 'card',
  data: _ => ({
    SLOT_NAMES,
  }),
  computed: {
    isMediaDisplay () {
      return Boolean(this.$slots[SLOT_NAMES.media])
    },
    isHeaderDisplay () {
      return Boolean(this.$slots[SLOT_NAMES.header])
    },
    isSubheadDisplay () {
      return Boolean(this.$slots[SLOT_NAMES.subhead])
    },
    isContentDisplay () {
      return Boolean(this.$slots[SLOT_NAMES.content])
    },
    isActionsDisplay () {
      return Boolean(this.$slots[SLOT_NAMES.actions])
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  $content-line-height: 1.8rem;
  $content-number-text-lien: 2;
  $content-height: $content-line-height * $content-number-text-lien;

  .card {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    border-radius: 0.4rem;
    box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
    background-color: $col-sale-card-background;
    min-width: 0;
  }

  .card__media {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .card__body {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    padding: 1.6rem 2rem;
  }

  .card__header {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 2rem;
    line-height: 2.66rem;
    font-weight: 500;
    color: $col-text;
  }

  .card__subhead {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.16rem;
    line-height: 1.65rem;
    color: $col-text;
    opacity: 0.54;

    span {
      font-size: 1.16rem;
    }
  }

  .card__content {
    margin-top: 1rem;
    height: $content-height;
    max-height: $content-height;
  }

  .card__content-text {
    @include multi-line-ellipsis(
        $content-line-height,
        $content-number-text-lien,
        falce,
        $col-sale-card-background,
        15ch
    );
  }

  .card__actions {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
  }

</style>
