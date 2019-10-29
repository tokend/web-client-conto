<template>
  <div class="skeleton-loader-card">
    <div class="skeleton-loader-card__media">
      <skeleton-loader template="bigIcon" />
    </div>
    <div class="skeleton-loader-card__body">
      <div class="skeleton-loader-card__header">
        <skeleton-loader width="60%" template="smallString" />
      </div>
      <div class="skeleton-loader-card__subhead">
        <skeleton-loader width="45%" template="smallString" />
      </div>
      <div class="skeleton-loader-card__content">
        <p class="skeleton-loader-card__content-text">
          <skeleton-loader width="100%" template="smallString" />
          <skeleton-loader width="100%" template="smallString" />
        </p>
      </div>
    </div>
    <div class="skeleton-loader-card__actions">
      <skeleton-loader template="smallButton" />
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'skeleton-loader-card',

  components: {
    SkeletonLoader,
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  $content-line-height: 1.8rem;
  $content-number-text-lien: 2;
  $content-height: $content-line-height * $content-number-text-lien;

  .skeleton-loader-card {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    border-radius: 0.4rem;
    box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
    background-color: $col-sale-card-background;
    min-width: 0;
  }

  .skeleton-loader-card__media {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    padding: 2rem;
    background-color: $col-asset-card-header-background;
  }

  .skeleton-loader-card__body {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    padding: 1.6rem 2rem;
  }

  .skeleton-loader-card__header {
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

  .skeleton-loader-card__subhead {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.16rem;
    line-height: 1.65rem;
    color: $col-text;
    opacity: 0.54;
  }

  .skeleton-loader-card__content {
    margin-top: 1rem;
    height: $content-height;
    max-height: $content-height;
  }

  .skeleton-loader-card__content-text {
    @include multi-line-ellipsis(
        $content-line-height,
        $content-number-text-lien,
        falce,
        $col-sale-card-background,
        15ch
    );
  }

  .skeleton-loader-card__actions {
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
