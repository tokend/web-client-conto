<template>
  <tbody class="movements-table-row">
    <tr
      class="movements-table-row__brief"
      :class="isCustomerMovements
        ? 'movements-table-row__brief-customer'
        : 'movements-table-row__brief--with-shadow'
      ">
      <td
        class="movements-table-row__cell
               movements-table-row__cell--bold
               movements-table-row__cell--iconed"
        :title="movement.effect | effectTypeTranslationId | globalize"
      >
        <movement-direction-mark :movement="movement" />
        {{ movement.effect | effectTypeTranslationId | globalize }}
      </td>
      <td
        v-if="!isCustomerMovements"
        class="movements-table-row__cell"
        :title="movement.operationDetails
          | operationTypeTranslationId
          | globalize
        "
      >
        {{ movement.operationDetails | operationTypeTranslationId | globalize }}
      </td>
      <td
        class="movements-table-row__cell"
        :title="movement.appliedAt | formatCalendar"
      >
        {{ movement.appliedAt | formatCalendar }}
      </td>
      <td
        class="movements-table-row__cell"
        :title="movement | movementAmount | formatMoney"
      >
        {{ movement | movementAmount | formatBalance }}
      </td>

      <td
        class="movements-table-row__cell
               movements-table-row__cell--expand-btn-wrp"
      >
        <button
          class="movements-table-row__btn"
          :class="{'movements-table-row__btn--small': isCustomerMovements}"
          @click="isAttributesViewerShown = !isAttributesViewerShown"
        >
          <i
            class="mdi mdi-chevron-down movements-table-row__toggle-icon"
            :class="{ 'mdi-rotate-180': isAttributesViewerShown }"
          />
        </button>
      </td>
    </tr>

    <tr
      v-if="isAttributesViewerShown"
      class="movements-table-row__attributes"
    >
      <td :colspan="isCustomerMovements ? 4 : 5">
        <!-- eslint-disable max-len -->
        <div
          class="movements-table-row__attributes-viewer-wrp"
          :class="{'movements-table-row__attributes-viewer-wrp--with-shadow': !isCustomerMovements}">
          <movement-attributes-viewer :movement="movement" />
        </div>
        <!-- eslint-enable max-len -->
      </td>
    </tr>
  </tbody>
</template>

<script>
import { Movement } from '../wrappers/movement'

import TranslationFiltersMixin from '../mixins/translation-filters.mixin'

import MovementAttributesViewer from './movement-attributes-viewer'
import MovementDirectionMark from './movement-direction-mark'
import { MathUtil } from '@/js/utils'

export default {
  name: 'movement-table-row',
  components: {
    MovementAttributesViewer,
    MovementDirectionMark,
  },
  filters: {
    movementAmount (movement) {
      let currency = movement.assetCode
      let value
      if (movement.effect.calculatedPercentFee > 0 ||
          movement.effect.fixedFee > 0) {
        const fee = MathUtil.add(
          movement.effect.calculatedPercentFee,
          movement.effect.fixedFee
        )
        value = MathUtil.add(movement.effect.amount, fee)
      } else {
        value = movement.effect.amount
      }

      if (movement.isOutgoing || movement.isLocked) {
        value = -value
      }

      return { currency, value }
    },
  },
  mixins: [TranslationFiltersMixin],

  props: {
    movement: { type: Movement, required: true },
    isCustomerMovements: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isAttributesViewerShown: false,
  }),
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';
@import '../scss/variables';

.movements-table-row__brief {
  background-color: $col-block-bg;

  &--with-shadow {
    @include box-shadow;
  }
}

.movements-table-row__cell {
  padding: 0.7rem $movements-table-cell-side-padding;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: none;
  color: $col-text;

  &--bold {
    font-weight: 600;
  }

  &--iconed {
    position: relative;
    padding-left: $movements-table-cell-side-padding + 3rem;

    /* stylelint-disable selector-nested-pattern */
    i {
      left: $movements-table-cell-side-padding + 1rem;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    /* stylelint-enable selector-nested-pattern */
  }

  &--direction {
    padding-right: 0;
    min-width: $movements-table-cell-width-direction;
    width: $movements-table-cell-width-direction;
  }

  &--expand-btn-wrp {
    text-align: right;
    width: $movements-table-cell-width-expand-btn-wrp;
  }
}

.movements-table-row__btn {
  width: 3.7rem;
  height: 3.7rem;
  border-radius: 0.4rem;
  background-color: $col-app-content-background;
  outline: none;
  border: 0;
  box-shadow: none;

  &:hover {
    background-color: $movements-table-row-btn-hover-bg;
  }

  &:active {
    background-color: $movements-table-row-btn-active-bg;
  }

  &--small {
    width: 2rem;
    height: 2.2rem;
  }
}

.movements-table-row__toggle-icon {
  font-size: 1.6rem;

  &:before {
    transition: transform 0.2s ease-out;
  }
}

.movements-table-row__attributes-viewer-wrp {
  background: $col-block-bg;
  padding:
    0.75rem $movements-table-cell-side-padding
    0.7rem $movements-table-cell-side-padding;
  margin-top: -0.6rem;
  position: relative;

  &--with-shadow {
    @include box-shadow();
  }

  &:before {
    // HACK: to cover sticking out shadow at the top
    content: '';
    display: block;
    position: absolute;
    background: $col-block-bg;
    height: 1rem;
    top: 0;
    left: 0;
    right: 0;
    transform: translateY(-50%);
  }
}

.movements-table-row__brief-customer {
  .movements-table-row__cell {
    border-top: 0.1rem solid darken($col-button-flat-disabled-txt, 5%);
    padding: 1.4rem $movements-table-cell-side-padding
      0.7rem $movements-table-cell-side-padding;

    &--iconed {
      padding-left: $movements-table-cell-icon-padding;
    }
  }
}
</style>
