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
    Vue.axios.defaults.headers['x-access-token'] = JwtService.getToken()
  },
  query (resource, params) {
    return Vue.axios
      .get(resource, params)
      .catch((error) => {
        throw new Error(`ApiService query ${error}`)
      })
  },
  get (resource, plug) {
    return Vue.axios
      .get(plug ? `${resource}/${plug}` : resource)
      .catch((error) => {
        throw new Error(`ApiService get ${error}`)
      })
  },
  create (resource, params) {
    return Vue.axios
      .put(`${resource}`, params)
      .catch((error) => {
        throw new Error(`ApiService create ${error}`)
      })
  },
  update (resource, params) {
    return Vue.axios
      .post(`${resource}`, params)
      .catch((error) => {
        throw new Error(`ApiService update ${error}`)
      })
  },
  delete (resource) {
    return Vue.axios
      .delete(resource)
      .catch((error) => {
        throw new Error(`ApiService ${error}`)
      })
  }
}

export default ApiService

export const AuthService = {
  check_auth () {
    ApiService.setHeader()
    return ApiService.query('auth/check')
  }
}

export const AdminService = {
  fetch () {
    return ApiService.query('admin')
  },
  create (data) {
    return ApiService.create('admin/register', data)
  },
  update (id, data) {
    return ApiService.update(`admin/${id}`, data)
  },
  delete (id) {
    return ApiService.delete(`admin/${id}`)
  },
  login (params) {
    return ApiService.update('admin/login', params)
  },
  getHelper () {
    return ApiService.query('admin/helper/guide')
  },
  updateHelper (data) {
    return ApiService.update('admin/helper/guide', data)
  }
}

export const UtilityService = {
  getImage (imageID) {
    return ApiService.get(`photos/upload/${imageID}`)
  },
  uploadImage (formData) {
    return ApiService.update('photos/upload', formData)
  },
  uploadHelperImage (formData) {
    return ApiService.update('photos/helper', formData)
  }
}

export const StatService = {
  get_yearly (params) {
    return ApiService.query('stats/yearly', params)
  },
  get_church (params) {
    return ApiService.query('stats/church', params)
  },
  get_area (params) {
    return ApiService.query('stats/area', params)
  },
  get_volt (params) {
    return ApiService.query('stats/volts', params)
  },
  get_acts (params) {
    return ApiService.query('stats/acts', params)
  },
  get_others (params) {
    return ApiService.query('stats/others', params)
  },
  get_leaders (params) {
    return ApiService.query('stats/leaders', params)
  },
  get_district (params) {
    return ApiService.query('stats/district', params)
  }
}

export const VolunteerService = {
  fetch (params) {
    return ApiService.query('volts', params)
  },
  get (id) {
    return ApiService.get('volts/page', id)
  },
  total () {
    return ApiService.get('volts/total')
  },
  create (params) {
    return ApiService.create('volts', params)
  },
  update (params) {
    return ApiService.update(`volts/page/${params.id}`, params)
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
  },
  query (data) {
    return ApiService.query('volts/query', {params: data})
  },
  query_volt (data) {
    return ApiService.query('volts/queried', {params: data})
  },
  find (data) {
    return ApiService.query('volts/find', {params: data})
  },
  get_leader (id) {
    return ApiService.get(`volts/leader`, id)
  },
  create_leader (data) {
    return ApiService.create('volts/leader', data)
  },
  update_leader (data) {
    return ApiService.update(`volts/leader/${data.id}`, data)
  },
  get_history (id) {
    return ApiService.get(`volts/history`, id)
  },
  create_history (data) {
    return ApiService.create('volts/history', data)
  },
  update_automation (data) {
    return ApiService.update('volts/automation', data)
  },
  get_automation () {
    return ApiService.get('volts/automation')
  }
}

export const ReportService = {
  query (data) {
    return ApiService.query('reports', {params: data})
  },
  query_acts (data) {
    return ApiService.query('reports/acts', {params: data})
  },
  query_group_acts (data) {
    return ApiService.query('reports/group-acts', {params: data})
  },
  query_volts (data) {
    return ApiService.query('reports/volts', {params: data})
  },
  query_dynamic (data) {
    return ApiService.query('reports/dynamic', {params: data})
  },
  get (id) {
    return ApiService.get('reports/page', id)
  },
  create (data) {
    return ApiService.create('reports', {data})
  },
  update (id, data) {
    return ApiService.update(`reports/${id}`, {data})
  },
  delete (id) {
    return ApiService.delete(`reports/${id}`)
  },
  get_leader (code) {
    return ApiService.get('reports/leader', code)
  }
}

export const CodeService = {
  query_edu (params = {}) {
    return ApiService.query('codes/edu', params)
  },
  query_area (params = {}) {
    return ApiService.query('codes/area', params)
  },
  update_area (params) {
    return ApiService.update('codes/area', params)
  },
  delete_area (code) {
    return ApiService.delete(`codes/area/${code}`)
  },
  update_edus (params) {
    return ApiService.update('codes/edu', params)
  },
  test (testCode) {
    return ApiService.query(`codes/test`, { params: { code: testCode } })
  }
}
