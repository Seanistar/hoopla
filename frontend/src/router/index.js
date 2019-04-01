import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import JwtService from '@/common/jwt.service'
import { CHECK_AUTH } from '@/store/actions.type'
import { REMOVE_AUTH } from '@/store/mutations.type'

Vue.use(Router)

const router = new Router({
  mode: 'history', // connect-history-api-fallback
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HelloHome')
    },
    {
      path: '/volunteers',
      name: 'volunteers',
      component: () => import('@/views/Volunteers')
    },
    {
      path: '/volunteers/new',
      name: 'new-volunteer',
      props: true,
      component: () => import('@/views/NewVolunteer')
    },
    {
      path: '/volunteers/edit/:id?/:menu?',
      name: 'edit-volunteer',
      props: true,
      component: () => import('@/views/EditVolunteer')
    },
    {
      path: '/admins',
      name: 'admins',
      component: () => import('@/views/Admins')
    },
    {
      path: '/others',
      name: 'others',
      component: () => import('@/views/Others')
    },
    {
      path: '/queries',
      name: 'queries',
      component: () => import('@/views/Queries')
    },
    {
      path: '/queries/view/:id?/:menu?',
      name: 'view-query',
      props: true,
      component: () => import('@/views/ViewQuery')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/Reports')
    },
    {
      path: '/reports/item/:id?',
      name: 'edit-report',
      props: true,
      component: () => import('@/views/EditReport')
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/Stats')
    },
    {
      path: '/notices',
      name: 'notices',
      component: () => import('@/views/Notices')
    },
    { path: '*', redirect: '/' }
  ]
})

export default router

// Ensure we checked auth before each page load.
router.beforeEach(
  (to, from, next) => {
    if (to.name === 'home' && !JwtService.getToken()) return next()

    return Promise
      .all([store.dispatch(CHECK_AUTH)])
      .then(next)
      .catch(err => {
        console.warn(err.message)
        store.commit(REMOVE_AUTH)
        location.replace('/')
      })
  }
)
