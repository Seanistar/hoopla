import { AuthService } from '@/common/api.service'
import { CHECK_AUTH } from './actions.type'
import { SET_AUTH, INIT_AUTH, REMOVE_AUTH } from './mutations.type'
import JwtService from '@/common/jwt.service'

const state = {
  isAuth: false,
  authInfo: null
}

const getters = {
  isAuth: state => state.isAuth,
  authInfo: state => state.authInfo
}

const actions = {
  [CHECK_AUTH] (context) {
    return AuthService.check_auth()
      .then(({data}) => {
        context.commit(SET_AUTH, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

const mutations = {
  [SET_AUTH] (state, data) {
    state.isAuth = data.success
    if (data.success) {
      state.authInfo = data.info
    }
  },
  [INIT_AUTH] (state, data) {
    state.isAuth = true
    state.authInfo = data
  },
  [REMOVE_AUTH] (state) {
    state.isAuth = false
    state.authInfo = null
    JwtService.destroyToken()
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
