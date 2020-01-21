<template>
  <div class="poll-participants-viewer app__table">
    <table v-if="poll.participants.length">
      <thead>
        <tr>
          <th>
            {{ 'poll-participants.email-lbl' | globalize }}
          </th>
          <th>
            {{ 'poll-participants.choice-lbl' | globalize }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(participant, id) in poll.participants"
          :key="id"
        >
          <td>
            <email-getter :account-id="participant.id" />
          </td>
          <td>{{ getChoiceDescription(participant.choice) }}</td>
        </tr>
      </tbody>
    </table>
    <no-data-message
      v-else
      class="statistics-sales-history__no-assets-msg"
      icon-name="chart-areaspline"
      :title="'statistics-sales-history.no-assets-title' | globalize"
      :message="'poll-participants.no-request-history-desc' | globalize"
    />
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { PollRecord } from '@/js/records/entities/poll.record'

export default {
  name: 'poll-participants',
  components: {
    EmailGetter,
    NoDataMessage,
  },
  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },
  methods: {
    getChoiceDescription (value) {
      const choice = this.poll.choices.find(item => {
        return item.number === value
      })
      return choice.description
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
