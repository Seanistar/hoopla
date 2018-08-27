import {CodeService} from '@/common/api.service'
import {FETCH_EDU_CODES, FETCH_AREA_CODES} from './actions.type'
import {FETCH_START, FETCH_EDU_CODES_END, FETCH_AREA_CODES_END} from './mutations.type'

const state = {
  eduCodes: [],
  areaCodes: [],
  isLoading: true
}

const getters = {
  eduCodes (state) {
    return state.eduCodes
  },
  areaCodes (state) {
    return state.areaCodes
  },
  isCodesLoading (state) {
    return state.isLoading
  }
}

const actions = {
  [FETCH_EDU_CODES] (context, params) {
    context.commit(FETCH_START)
    return CodeService.query(params)
      .then(({ data }) => {
        context.commit(FETCH_EDU_CODES_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_AREA_CODES] (context, params) {
    context.commit(FETCH_START)
    return CodeService.query_area(params)
      .then(({ data }) => {
        context.commit(FETCH_AREA_CODES_END, data)
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
  [FETCH_EDU_CODES_END] (state, codes) {
    state.eduCodes = codes
    state.isLoading = false
  },
  [FETCH_AREA_CODES_END] (state, codes) {
    state.areaCodes = codes
    state.isLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
