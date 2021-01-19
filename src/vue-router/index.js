import Vue from 'vue'
import Router from 'vue-router'
import _get from 'lodash/get'
import { store, vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { resolveRedirect } from '@/vue-router/redirect'

import AppContent from '@/vue/AppContent'

import Pay from '@/vue/pages/Pay'

import Polls from '@/vue/pages/Polls'
import PollsAll from '@/vue/pages/PollsAll'
import PollRequestsModule from '@/vue/modules/requests/poll-requests'
import Settings from '@/vue/pages/Settings'
import Security from '@/vue/pages/Security'
import Verification from '@/vue/pages/Verification'
import VerificationCorporate from '@/vue/pages/VerificationCorporate'
import VerificationGeneral from '@/vue/pages/VerificationGeneral'
import SuccessfulPayment from '@/vue/pages/SuccessfulPayment'
import FailedPayment from '@/vue/pages/FailedPayment'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/r/*',
      name: 'horizon-redirect',
      beforeEnter: resolveRedirect,
    },
    {
      path: '/terms',
      name: vueRoutes.terms.name,
      component: resolve => require(['@/vue/pages/Terms'], resolve),
    },
    {
      path: '/downloads',
      name: vueRoutes.downloads.name,
      component: resolve => require(['@/vue/pages/Downloads'], resolve),
    },
    {
      path: '/pay',
      name: vueRoutes.pay.name,
      component: Pay,
    },
    {
      path: '/successful-payment',
      name: vueRoutes.successfulPayment.name,
      component: SuccessfulPayment,
    },
    {
      path: '/failed-payment',
      name: vueRoutes.failedPayment.name,
      component: FailedPayment,
    },
    {
      path: '/auth',
      name: vueRoutes.auth.name,
      component: resolve => require(['@/vue/pages/Auth'], resolve),
      redirect: vueRoutes.login,
      children: [
        {
          path: '/sign-in',
          name: vueRoutes.login.name,
          component: resolve => require(['@/vue/pages/Login'], resolve),
          beforeEnter: authPageGuard,
        },
        {
          path: '/sign-up',
          name: vueRoutes.signup.name,
          component: resolve => require(['@/vue/pages/Signup'], resolve),
          beforeEnter: authPageGuard,
        },
        {
          path: '/verify/:paramsBase64',
          name: vueRoutes.verify.name,
          component: resolve => require(['@/vue/pages/Verify'], resolve),
          beforeEnter: authPageGuard,
          props: true,
        },
        {
          path: '/kyc-recovery-init',
          name: vueRoutes.kycRecoveryInit.name,
          component: resolve => require(['@/vue/pages/KycRecovery'], resolve),
          beforeEnter: authPageGuard,
        },
        {
          path: '/sign-up-general-verification',
          name: vueRoutes.signupKyc.name,
          component: resolve => require(['@/vue/pages/SignupGeneralKyc'], resolve),
          beforeEnter: signupKycPageGuard,
        },
      ],
    },
    {
      path: '/',
      name: vueRoutes.app.name,
      meta: { isNavigationRendered: true },
      component: AppContent,
      beforeEnter: redirectRouteGuard,
      children: [
        {
          path: '/settings',
          name: vueRoutes.settings.name,
          meta: {
            pageNameTranslationId: 'pages-names.settings',
          },
          component: Settings,
          redirect: vueRoutes.security,
          children: [
            {
              path: '/settings/security',
              name: vueRoutes.security.name,
              component: Security,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/settings/verification',
              name: vueRoutes.verification.name,
              component: Verification,
              beforeEnter: inAppRouteGuard,
              children: [
                {
                  path: '/settings/verification/corporate',
                  name: vueRoutes.verificationCorporate.name,
                  component: VerificationCorporate,
                  beforeEnter: inAppRouteGuard,
                },
                {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                  component: VerificationGeneral,
                  beforeEnter: inAppRouteGuard,
                },
              ],
            },
          ],
        },
        {
          path: '/polls',
          name: vueRoutes.polls.name,
          meta: { pageNameTranslationId: 'pages-names.polls' },
          component: Polls,
          beforeEnter: inAppRouteGuard,
          redirect: vueRoutes.allPolls,
          children: [
            {
              path: '/polls/all',
              name: vueRoutes.allPolls.name,
              props: true,
              component: PollsAll,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/polls/poll-requests',
              name: vueRoutes.pollRequests.name,
              props: true,
              component: PollRequestsModule,
              meta: {
                isCorporateOnly: true,
              },
              beforeEnter: inAppRouteGuard,
            },
          ],
        },
      ],
    },
  ],
  scrollBehavior: _ => ({ x: 0, y: 0 }),
})

export default router

// doesn't allow to visit signup kyc page if user's is logged out
function signupKycPageGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
  const isAccountUnverified = store.getters[vuexTypes.isAccountUnverified]

  isLoggedIn && isAccountUnverified
    ? next()
    : next(vueRoutes.app)
}

function authPageGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
  isLoggedIn ? next(vueRoutes.app) : next()
}

function redirectRouteGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
  const isAccountUnverified = store.getters[vuexTypes.isAccountUnverified]

  if (isLoggedIn && !isAccountUnverified) {
    if (to.name === vueRoutes.app.name) {
      const isAccountCorporate = store.getters[vuexTypes.isAccountCorporate]
      if (isAccountCorporate) {
        next(vueRoutes.settings)
      } else {
        next(vueRoutes.polls)
      }
    } else {
      next()
    }
  } else if (isLoggedIn && isAccountUnverified) {
    next(vueRoutes.signupKyc)
  } else {
    next(vueRoutes.login)
  }
}

function inAppRouteGuard (to, from, next) {
  const isAccountCorporate = store.getters[vuexTypes.isAccountCorporate]
  const isAccountGeneral = store.getters[vuexTypes.isAccountGeneral]
  const isCorporateRouter = _get(to, 'meta.isCorporateOnly')
  const isGeneralRouter = _get(to, 'meta.isGeneralOnly')
  const isDisabled = _get(to, 'meta.isDisabled')
  if (isDisabled) {
    next(vueRoutes.app)
  } else if (isAccountCorporate && isCorporateRouter) {
    next()
  } else if (isAccountGeneral && isGeneralRouter) {
    next()
  } else if (!isCorporateRouter && !isGeneralRouter) {
    next()
  } else {
    next(vueRoutes.app)
  }
}
