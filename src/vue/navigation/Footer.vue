<template>
  <footer class="footer">
    <language-picker class="footer__language-picker" />
    <div>
      <router-link
        class="footer__link"
        :to="vueRoutes.terms"
        target="_blank"
      >
        {{ 'footer.terms' | globalize }}
      </router-link>

      <router-link
        class="footer__link"
        :to="vueRoutes.downloads"
        target="_blank"
      >
        {{ 'footer.download-apps' | globalize }}
      </router-link>

      <a
        class="footer__link"
        :href="config.SUPPORT_URL"
        target="_blank"
      >
        {{ 'footer.support-apps' | globalize }}
      </a>
    </div>
    <div>
      <span class="footer__text">
        {{ 'footer.copyright' | globalize({ year: currentYear }) }}
      </span>
    </div>
  </footer>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
import LanguagePicker from './footer/LanguagePicker'
import config from '@/config'

export default {
  name: 'app-footer',

  components: {
    LanguagePicker,
  },

  data: () => ({
    vueRoutes,
    config,
  }),

  computed: {
    currentYear () {
      return new Date().getFullYear()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.footer__text,
.footer__link {
  line-height: 2.5rem;
}

.footer__language-picker {
  display: inline-block;
}

.footer__text {
  color: $col-footer-text;
}

.footer__link {
  color: $col-footer-text;
  margin: 0 1rem;

  &:not(:first-child) {
    margin-left: 0;
  }
}
</style>
