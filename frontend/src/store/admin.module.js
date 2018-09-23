import { AdminService } from '@/common/api.service'
import {
  LOGIN_ADMIN
} from './actions.type'
import {
  SET_ADMIN
} from './mutations.type'

const state = {
  isLogin: false,
  adminInfo: { area_code: '01-01-01' }
}

const getters = {
  adminInfo (state) {
    return state.adminInfo
  },
  isLogin (state) {
    return state.isLogin
  }
}

const actions = {
  [LOGIN_ADMIN] (context, params) {
    return AdminService.login(params)
      .then(({data}) => {
        // console.log(res)
        context.commit(SET_ADMIN, data === 'OK')
        // return Promise.resolve(data === 'OK')
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_ADMIN] (state, is) {
    state.isLogin = is
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
