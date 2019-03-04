import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
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
