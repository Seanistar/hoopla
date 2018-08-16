import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history', // connect-history-api-fallback
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/HelloWorld')
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('@/components/Movies')
    },
    {
      path: '/movies/page/:id',
      name: 'movie-page',
      component: () => import('@/components/MoviePage')
    },
    {
      path: '/topics',
      name: 'topics',
      component: () => import('@/components/Topics')
    },
    {
      path: '/topics/page/:id',
      name: 'topic-page',
      props: true,
      component: () => import('@/components/TopicPage')
    },
    {
      path: '/topics/add',
      name: 'add-topic',
      component: () => import('@/components/AddTopic')
    },
    {
      path: '/topics/edit/:id',
      name: 'edit-topic',
      props: true,
      component: () => import('@/components/EditTopic')
    },
    {
      path: '/authors',
      name: 'authors',
      component: () => import('@/components/Authors')
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/components/Posts')
    },
    {
      path: '/posts/add',
      name: 'add-post',
      component: () => import('@/components/AddPost')
    }
  ]
})
