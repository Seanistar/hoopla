import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history', // connect-history-api-fallback
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/components/IndexPage')
    },
    {
      path: '/show/page/:id',
      name: 'show',
      component: () => import('@/components/ShowPage')
    },
    {
      path: '/topics/page/:id',
      name: 'topic-page',
      props: true,
      component: () => import('@/components/TopicPage')
    },
    {
      path: '/topics',
      name: 'topics',
      component: () => import('@/components/Topics')
    },
    {
      path: '/topics/add',
      name: 'add-topic',
      component: () => import('@/components/AddTopic')
    }
  ]
})
