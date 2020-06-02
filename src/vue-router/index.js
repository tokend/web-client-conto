import Vue from 'vue'
import Router from 'vue-router'
import _get from 'lodash/get'
import { store, vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { resolveRedirect } from '@/vue-router/redirect'

import AppContent from '@/vue/AppContent'

import Pay from '@/vue/pages/Pay'
import Business from '@/vue/pages/Business'

import Customers from '@/vue/pages/Customers'
import CustomersList from '@/vue/pages/CustomersList'
import Businesses from '@/vue/pages/Businesses'
import BusinessesMy from '@/vue/pages/BusinessesMy'
import BusinessesAll from '@/vue/pages/BusinessesAll'
import BusinessViewer from '@/vue/pages/BusinessViewer'

import Polls from '@/vue/pages/Polls'
import PollsAll from '@/vue/pages/PollsAll'
import PollRequestsModule from '@/vue/modules/requests/poll-requests'

import Assets from '@/vue/pages/Assets'
import AssetExplorer from '@modules/assets/asset-explorer'
import AtomicSwaps from '@/vue/pages/AtomicSwaps'
import AtomicSwapsExplore from '@/vue/pages/atomic-swaps/AtomicSwapsExplore'
import Movements from '@/vue/pages/Movements'
import AssetsMovements from '@/vue/pages/AssetsMovements'
import Sponsorship from '@/vue/pages/Sponsorship'
import SponsorshipIncomingRequestsPage from '@/vue/pages/SponsorshipIncomingRequestsPage'
import SponsorshipOutgoingRequestsPage from '@/vue/pages/SponsorshipOutgoingRequestsPage'
import Settings from '@/vue/pages/Settings'
import Security from '@/vue/pages/Security'
import Verification from '@/vue/pages/Verification'
import VerificationCorporate from '@/vue/pages/VerificationCorporate'
import VerificationGeneral from '@/vue/pages/VerificationGeneral'
import PromoCodes from '@/vue/pages/PromoCodes'
import PromoCodesList from '@/vue/pages/PromoCodesList'
import Statistics from '@/vue/pages/Statistics'
import StatisticsSalesHistory from '@/vue/pages/StatisticsSalesHistory'
import StatisticsGeneral from '@/vue/pages/StatisticsGeneral'
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
      path: '/business/:id',
      name: vueRoutes.business.name,
      component: Business,
      props: true,
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
          path: '/customers',
          name: vueRoutes.customers.name,
          meta: {
            pageNameTranslationId: 'pages-names.customers',
          },
          component: Customers,
          redirect: vueRoutes.customersList,
          children: [
            {
              path: '/customers/list',
              name: vueRoutes.customersList.name,
              component: CustomersList,
              beforeEnter: inAppRouteGuard,
              meta: {
                isCorporateOnly: true,
              },
            },
          ],
        },
        {
          path: '/businesses',
          name: vueRoutes.businesses.name,
          meta: {
            pageNameTranslationId: 'pages-names.businesses',
          },
          component: Businesses,
          redirect: vueRoutes.myBusinesses,
          children: [
            {
              path: '/businesses/my',
              name: vueRoutes.myBusinesses.name,
              component: BusinessesMy,
              beforeEnter: inAppRouteGuard,
              props: true,
            },
            {
              path: '/businesses/all',
              name: vueRoutes.allBusinesses.name,
              component: BusinessesAll,
              beforeEnter: inAppRouteGuard,
              props: true,
            },
            {
              path: '/businesses/:id',
              name: vueRoutes.currentBusiness.name,
              component: BusinessViewer,
              props: true,
              beforeEnter: inAppRouteGuard,
            },
          ],
        },
        {
          path: '/assets',
          name: vueRoutes.assets.name,
          meta: {
            pageNameTranslationId: 'pages-names.assets',
          },
          component: Assets,
          redirect: vueRoutes.assetsExplore,
          children: [
            {
              path: '/assets/explore',
              name: vueRoutes.assetsExplore.name,
              component: AssetExplorer,
              beforeEnter: inAppRouteGuard,
            },
          ],
        },
        {
          path: '/promo-codes',
          name: vueRoutes.promoCodes.name,
          meta: {
            pageNameTranslationId: 'pages-names.promo-codes',
          },
          component: PromoCodes,
          redirect: vueRoutes.promoCodesList,
          children: [
            {
              path: '/promo-codes/list',
              name: vueRoutes.promoCodesList.name,
              component: PromoCodesList,
              beforeEnter: inAppRouteGuard,
              meta: {
                isCorporateOnly: true,
              },
            },
          ],
        },
        {
          path: '/statistics',
          name: vueRoutes.statistics.name,
          meta: {
            pageNameTranslationId: 'pages-names.statistics',
          },
          component: Statistics,
          redirect: vueRoutes.statisticsSalesHistory,
          children: [
            {
              path: '/statistics/sales-history',
              name: vueRoutes.statisticsSalesHistory.name,
              component: StatisticsSalesHistory,
              beforeEnter: inAppRouteGuard,
              meta: {
                isCorporateOnly: true,
              },
            },
            {
              path: '/statistics/general',
              name: vueRoutes.statisticsGeneral.name,
              component: StatisticsGeneral,
              beforeEnter: inAppRouteGuard,
              meta: {
                isCorporateOnly: true,
              },
            },
          ],
        },
        {
          path: '/atomic-swaps',
          name: vueRoutes.atomicSwaps.name,
          meta: {
            pageNameTranslationId: 'pages-names.atomic-swaps',
          },
          component: AtomicSwaps,
          redirect: vueRoutes.atomicSwapsExplore,
          children: [
            {
              path: '/atomic-swaps/explore',
              name: vueRoutes.atomicSwapsExplore.name,
              component: AtomicSwapsExplore,
              beforeEnter: inAppRouteGuard,
              meta: {
                isCorporateOnly: true,
              },
            },
          ],
        },
        {
          path: '/movements',
          name: vueRoutes.movements.name,
          meta: {
            pageNameTranslationId: 'pages-names.movements',
          },
          component: Movements,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/assets-movements',
          name: vueRoutes.assetsMovements.name,
          meta: {
            pageNameTranslationId: 'pages-names.assets-movements',
            isCorporateOnly: true,
          },
          component: AssetsMovements,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/sponsorship',
          name: vueRoutes.sponsorship.name,
          meta: {
            pageNameTranslationId: 'pages-names.sponsorship',
          },
          component: Sponsorship,
          redirect: vueRoutes.sponsorshipAllBusinesses,
          children: [
            {
              path: '/sponsorship/all',
              name: vueRoutes.sponsorshipAllBusinesses.name,
              component: BusinessesAll,
              beforeEnter: inAppRouteGuard,
              props: true,
              meta: {
                isCorporateOnly: true,
              },
            },
            {
              path: '/sponsorship/incoming-requests',
              name: vueRoutes.sponsorshipIncomingRequests.name,
              component: SponsorshipIncomingRequestsPage,
              beforeEnter: inAppRouteGuard,
              meta: {
                isCorporateOnly: true,
              },
            },
            {
              path: '/sponsorship/outgoing-requests',
              name: vueRoutes.sponsorshipOutgoingRequests.name,
              component: SponsorshipOutgoingRequestsPage,
              beforeEnter: inAppRouteGuard,
              meta: {
                isCorporateOnly: true,
              },
            },
          ],
        },
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
          meta: {
            pageNameTranslationId: 'pages-names.polls',
            isDisabled: true,
          },
          component: Polls,
          beforeEnter: inAppRouteGuard,
          redirect: vueRoutes.allPolls,
          children: [
            {
              path: '/polls/all',
              name: vueRoutes.allPolls.name,
              props: true,
              meta: {
                isDisabled: true,
              },
              component: PollsAll,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/polls/poll-requests',
              name: vueRoutes.pollRequests.name,
              props: true,
              component: PollRequestsModule,
              meta: {
                isDisabled: true,
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
        next(vueRoutes.customers)
      } else {
        next(vueRoutes.assetsExplore)
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
