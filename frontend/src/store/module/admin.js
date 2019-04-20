import JwtService from '@/common/jwt.service'
import { AdminService } from '@/common/api.service'
import {
  LOGIN_ADMIN,
  FETCH_ADMINS,
  REGISTER_ADMIN,
  UPDATE_ADMIN,
  DELETE_ADMIN
} from '../actions.type'
import {
  INIT_AUTH,
  SET_LOGIN,
  FETCH_START,
  FETCH_ADMINS_END,
  SET_ADMIN,
  REMOVE_ADMIN
} from '../mutations.type'

const state = {
  isLogin: false,
  isLoading: false,
  admins: [],
  adminInfo: { area_code: '01-01-01' }
}

const getters = {
  adminInfo: state => state.adminInfo,
  isLogin: state => state.isLogin,
  admins: state => state.admins,
  isAdminLoading: state => state.isLoading
}

const actions = {
  [LOGIN_ADMIN] (context, params) {
    return AdminService.login(params)
      .then(({data}) => {
        // console.log(data)
        context.commit(SET_LOGIN, data)
        context.commit(INIT_AUTH, data.admin)
      })
      .catch(error => {
        throw new Error(error)
      })
  },
  [FETCH_ADMINS] (context) {
    context.commit(FETCH_START)
    return AdminService.fetch()
      .then(({ data }) => {
        context.commit(FETCH_ADMINS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [REGISTER_ADMIN] (context, admin) {
    return AdminService.create(admin)
      .then(({ data }) => {
        admin.id = data.newID
        admin.reg_date = new Date().toISOString().substr(0, 10)
        context.commit(SET_ADMIN, admin)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_ADMIN] (context, params) {
    const id = params['id']
    return AdminService.update(id, params)
      .then(() => {
        context.commit(SET_ADMIN, params)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_ADMIN] (context, id) {
    return AdminService.delete(id)
      .then(() => {
        context.commit(REMOVE_ADMIN, id)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_START] (state) {
    state.isLoading = true
  },
  [SET_LOGIN] (state, data) {
    state.isLogin = data.success
    if (data.success) {
      state.adminInfo = data.admin
      JwtService.saveToken(data.token)
    }
  },
  [SET_ADMIN] (state, data) {
    const pos = state.admins.findIndex((o) => o.admin_id === data.admin_id)
    if (pos > -1) {
      // console.log('set position : ', pos, data)
      Object.assign(state.admins[pos], data)
    } else {
      // console.log('no pos and add position : ', pos)
      state.admins.push(data)
    }
  },
  [REMOVE_ADMIN] (state, id) {
    const pos = state.admins.findIndex((o) => o.id === id)
    if (pos > -1) {
      // console.log('remove position : ', pos)
      state.admins.splice(pos, 1)
    }
  },
  [FETCH_ADMINS_END] (state, admins) {
    for (let i = 0; i < admins.length; i++) {
      admins[i].idx = i + 1
    }
    state.admins = admins
    state.isLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
