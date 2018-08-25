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
  get (resource, plug) {
    return Vue.axios
      .get(`${resource}/${plug}`)
      .catch((error) => {
        throw new Error(`[scrapbook] ApiService ${error}`)
      })
  },
  create (resource, params) {
    return Vue.axios.put(`${resource}`, params)
  },
  update (resource, params) {
    return Vue.axios.post(`${resource}`, params)
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
    return ApiService.create('scraps', { scrap: params })
  },
  update (plug, params) {
    return ApiService.update(`scraps/${plug}`, params)
  },
  upload (forms) {
    return ApiService.update('scraps/upload', forms)
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
    return ApiService.create('topics/add', params)
  },
  editTopicInfo (id, params) {
    return ApiService.update(`topics/edit/${id}`, params)
  },
  deleteTopic (id) {
    return ApiService.delete(`topics/${id}`)
  }
}

export const VolunteerService = {
  query (params = {}) {
    return ApiService.query('volts', params)
  },
  get (id) {
    return ApiService.get('volts', id)
  },
  create (params) {
    return ApiService.create('volts', { volts: params })
  },
  update (params) {
    return ApiService.update(`volts/${params.id}`, params)
  },
  delete (id) {
    return ApiService.delete(`volts/${id}`)
  },
  test (testCode) {
    return ApiService.query(`volts/code/1`, { params: { code: testCode } })
  }
}
