<template>
  <div id="card-list" class="card-list">
    <div
      class="card-list__item"
      :style="styleObject"
      v-for="item in list"
      :key="item.id"
    >
      <slot :item="item" />
    </div>
  </div>
</template>

<script>
const CARD_MARGIN = '2rem'
const NUMBER_OF_CARDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
}
const CONTENT_DISPLAY_WIDTH = {
  sixCards: 3000,
  fiveCards: 1678,
  fourCards: 1100,
  threeCards: 800,
  twoCards: 500,
}

export default {
  name: 'card-list',
  props: {
    list: {
      type: [Array, Number],
      required: true,
    },
  },
  data () {
    return {
      styleObject: {},
    }
  },
  mounted () {
    this.setCardWidth()
    window.addEventListener('resize', this.setCardWidth)
  },
  destroyed () {
    window.addEventListener('resize', this.setCardWidth)
  },
  methods: {
    setCardWidth () {
      const numberOfCards = this.getNumberOfCards()

      this.styleObject = {
        'max-width': `calc(100% / ${numberOfCards} - (${CARD_MARGIN}))`,
        'flex': `0 1 calc(100% / ${numberOfCards} - (${CARD_MARGIN}))`,
      }
    },

    getNumberOfCards () {
      const cardListWidth = document.getElementById('card-list').clientWidth
      let numberOfCards = NUMBER_OF_CARDS.one

      if (cardListWidth > CONTENT_DISPLAY_WIDTH.sixCards) {
        numberOfCards = NUMBER_OF_CARDS.six
      } else if (cardListWidth > CONTENT_DISPLAY_WIDTH.fiveCards) {
        numberOfCards = NUMBER_OF_CARDS.five
      } else if (cardListWidth > CONTENT_DISPLAY_WIDTH.fourCards) {
        numberOfCards = NUMBER_OF_CARDS.four
      } else if (cardListWidth > CONTENT_DISPLAY_WIDTH.threeCards) {
        numberOfCards = NUMBER_OF_CARDS.three
      } else if (cardListWidth > CONTENT_DISPLAY_WIDTH.twoCards) {
        numberOfCards = NUMBER_OF_CARDS.two
      }
      return numberOfCards
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables.scss';

.card-list {
  display: flex;
  flex-wrap: wrap;
  margin: -$list-item-margin 0 0 (-$list-item-margin);
}

.card-list__item {
  width: calc(100% + #{$list-item-margin});
  margin: $list-item-margin 0 0 $list-item-margin;
}
</style>
