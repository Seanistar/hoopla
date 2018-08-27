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
      path: '/volunteers/edit/:id?',
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
      path: '/authors',
      name: 'authors',
      component: () => import('@/views/Authors')
    },
    {
      path: '/notices',
      name: 'notices',
      component: () => import('@/views/Notices')
    }
  ]
})
