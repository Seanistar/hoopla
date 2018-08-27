import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from '@/common/jwt.service'
import {API_URL} from '@/common/config'

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

export const AuthorService = {
  get () {
    return ApiService.query('authors')
  }
}

export const VolunteerService = {
  query (params = {}) {
    return ApiService.query('volts', params)
  },
  get (id) {
    return ApiService.get('volts/page', id)
  },
  create (params) {
    return ApiService.create('volts', params)
  },
  update (params) {
    return ApiService.update(`volts/${params.id}`, params)
  },
  delete (id) {
    return ApiService.delete(`volts/${id}`)
  },
  get_edu (id) {
    return ApiService.get(`volts/edu`, id)
  },
  create_edu (params) {
    return ApiService.create('volts/edu', params)
  },
  update_edu (params) {
    return ApiService.update(`volts/edu/${params.id}`, params)
  },
  delete_edu (id) {
    return ApiService.delete(`volts/edu/${id}`)
  },
  get_act (id) {
    return ApiService.get(`volts/act`, id)
  },
  create_act (params) {
    return ApiService.create('volts/act', params)
  },
  update_act (params) {
    return ApiService.update(`volts/act/${params.id}`, params)
  },
  delete_act (id) {
    return ApiService.delete(`volts/act/${id}`)
  }
}

export const CodeService = {
  query (params = {}) {
    return ApiService.query('codes', params)
  },
  query_area (params = {}) {
    return ApiService.query('codes/area', params)
  },
  test (testCode) {
    return ApiService.query(`codes/test`, { params: { code: testCode } })
  }
}

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