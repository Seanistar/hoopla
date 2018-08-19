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
      path: '/scrap',
      name: 'scraps',
      component: () => import('@/views/Scraps')
    },
    {
      path: '/topic',
      name: 'home-topic',
      component: () => import('@/views/HomeTopic')
    }
    /* {
      path: '/movies',
      name: 'movies',
      component: () => import('@/views/Movies')
    },
    {
      path: '/movies/page/:id',
      name: 'movie-page',
      component: () => import('@/views/MoviePage')
    },
    {
      path: '/topics',
      name: 'topics',
      component: () => import('@/views/Topics')
    },
    {
      path: '/topics/page/:id',
      name: 'topic-page',
      props: true,
      component: () => import('@/views/TopicPage')
    },
    {
      path: '/topics/add',
      name: 'add-topic',
      component: () => import('@/views/AddTopic')
    },
    {
      path: '/topics/edit/:id',
      name: 'edit-topic',
      props: true,
      component: () => import('@/views/EditTopic')
    },
    {
      path: '/authors',
      name: 'authors',
      component: () => import('@/views/Authors')
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/Posts')
    },
    {
      path: '/posts/add',
      name: 'add-post',
      component: () => import('@/views/AddPost')
    } */
  ]
})
