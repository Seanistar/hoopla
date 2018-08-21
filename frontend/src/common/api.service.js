import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from '@/common/jwt.service'
import { API_URL } from '@/common/config'

const ApiService = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = API_URL
  },
  setHeader () {
    Vue.axios.defaults.headers.common['Authorization'] = `Token ${JwtService.getToken()}`
  },
  query (resource, params) {
    return Vue.axios
      .get(resource, params)
      .catch((error) => {
        throw new Error(`[scrapbook] ApiService ${error}`)
      })
  },
  get (resource, plug = '') {
    return Vue.axios
      .get(`${resource}/${plug}`)
      .catch((error) => {
        throw new Error(`[scrapbook] ApiService ${error}`)
      })
  },
  post (resource, params) {
    return Vue.axios.post(`${resource}`, params)
  },
  update (resource, plug, params) {
    return Vue.axios.put(`${resource}/${plug}`, params)
  },
  put (resource, params) {
    return Vue.axios.put(`${resource}`, params)
  },
  delete (resource) {
    return Vue.axios
      .delete(resource)
      .catch((error) => {
        throw new Error(`[scrapbook] ApiService ${error}`)
      })
  }
}

export default ApiService

export const ScrapService = {
  query (params) {
    return ApiService.query('scraps', { params: params })
  },
  get (plug) {
    return ApiService.get('scraps', plug)
  },
  create (params) {
    return ApiService.post('scraps', { scrap: params })
  },
  update (plug, params) {
    return ApiService.update(`scraps`, plug, params)
  },
  destroy (plug) {
    return ApiService.delete(`scraps/${plug}`)
  }
}

export const AuthorService = {
  get () {
    return ApiService.query('authors')
  }
}

export const TopicService = {
  query (type, params) {
    return ApiService.query('topics', { params: params })
  },
  get (plug) {
    return ApiService.get('topics', plug)
  },
  getTopics () {
    return ApiService.get('topics')
  },
  getTopicPage (id) {
    return ApiService.get(`topics/page/${id}`)
  },
  addTopicInfo (params) {
    return ApiService.put('topics/add', params)
  },
  editTopicInfo (id, params) {
    return ApiService.put(`topics/edit/${id}`, params)
  },
  deleteTopic (id) {
    return ApiService.delete(`topics/${id}`)
  }
}

export const PostService = {
  fetchPosts () {
    return ApiService.get('posts')
  },
  addPost (params) {
    return ApiService.post('posts/add', params)
  },
  updatePost (params) {
    return ApiService.put(`posts/update/${params.id}`, params)
  },
  getPost (params) {
    return ApiService.get('posts/page/' + params.id)
  },
  deletePost (id) {
    return ApiService.delete('posts/delete/' + id)
  },
  uploadFile (forms) {
    return ApiService.post('posts/upload', forms)
  }
}
