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
      path: '/volunteer',
      name: 'volunteers',
      component: () => import('@/views/Volunteers')
    },
    {
      path: '/volunteer/new',
      name: 'new-volunteer',
      component: () => import('@/views/NewVolunteer')
    },
    {
      path: '/volunteer/edit/:id?',
      name: 'edit-volunteer',
      props: true,
      component: () => import('@/views/EditVolunteer')
    },
    {
      path: '/scrap',
      name: 'scraps',
      component: () => import('@/views/Scraps')
    },
    {
      path: '/author',
      name: 'authors',
      component: () => import('@/views/Authors')
    },
    {
      path: '/topic',
      name: 'topics',
      component: () => import('@/views/Topics')
    }
  ]
})
