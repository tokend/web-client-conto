<template>
  <div class="poll-card">
    <card>
      <template slot="header">
        {{ 'poll-card.id-prefix' | globalize({ id: poll.id }) }}
      </template>
      <template slot="content">
        {{ poll.question }}
      </template>
      <template slot="subhead">
        <template v-if="poll.isOpen && !poll.isEnded">
          {{ 'poll-card.ends-at-row'|globalize({ time: poll.endsAt }) }}
        </template>

        <template v-else>
          {{ 'poll-card.ended-at-row' | globalize({
            time: poll.endsAt,
            state: translatePollStateInline(poll),
          }) }}
        </template>
      </template>

      <template slot="accent-title">
        {{ 'poll-card.author-prefix' | globalize }}
        <email-getter
          is-titled
          :account-id="poll.ownerId"
          :is-copy-button="false"
        />
      </template>
      <template slot="actions">
        <button
          v-ripple
          class="app__button-flat"
          @click="$emit(EVENTS.vote)"
        >
          {{ 'poll-card.vote-lbl' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import Card from '@/vue/common/Card'
import { PollRecord } from '@/js/records/entities/poll.record'

const EVENTS = {
  vote: 'vote',
}

export default {
  name: 'poll-card',

  components: {
    EmailGetter,
    Card,
  },

  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },

  data () {
    return {
      EVENTS,
    }
  },

  methods: {
    translatePollStateInline (poll) {
      let translationId

      if (poll.isOpen) {
        translationId = 'poll-card.state-inline-open'
      } else if (poll.isPassed) {
        translationId = 'poll-card.state-inline-passed'
      } else if (poll.isFailed) {
        translationId = 'poll-card.state-inline-failed'
      } else if (poll.isCanceled) {
        translationId = 'poll-card.state-inline-canceled'
      }

      return this.$options.filters.globalize(translationId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

</style>
