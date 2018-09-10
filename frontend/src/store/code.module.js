import { CodeService } from '@/common/api.service'
import { FETCH_EDU_CODES, FETCH_AREA_CODES, UPDATE_AREA_CODE, DELETE_AREA_CODE } from './actions.type'
import { FETCH_START, FETCH_EDU_CODES_END, FETCH_AREA_CODES_END, SET_AREA_CODE, REMOVE_AREA_CODE } from './mutations.type'
import { filter } from 'lodash/collection'

const state = {
  eduCodes: [],
  areaCodes: [],
  isLoading: true
}

const getters = {
  eduCodes (state) {
    return filter(state.eduCodes, o => o.type === 'E')
  },
  actCodes (state) {
    return filter(state.eduCodes, o => o.type === 'A')
  },
  trnCodes (state) {
    return filter(state.eduCodes, o => o.type === 'T')
  },
  areaCodes (state) {
    return state.areaCodes
  },
  isCodesLoading (state) {
    return state.isLoading
  },
  smallCodes (state) { // 본당 코드
    return filter(state.areaCodes, o => o.s_code !== null)
  }
}

const actions = {
  [FETCH_EDU_CODES] (context, params) {
    context.commit(FETCH_START)
    return CodeService.query_edu(params)
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
  },
  [UPDATE_AREA_CODE] (context, params) {
    return CodeService.update_area(params)
      .then(({ data }) => {
        context.commit(SET_AREA_CODE, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_AREA_CODE] (context, code) {
    return CodeService.delete_area(code)
      .then(() => {
        context.commit(REMOVE_AREA_CODE, code)
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
  },
  [SET_AREA_CODE] (state, obj) {
    const pos = state.areaCodes.findIndex((o) => o.a_code === obj.a_code)
    if (pos > -1) {
      state.areaCodes.splice(pos, 1)
    }
    state.areaCodes.push(obj)
  },
  [REMOVE_AREA_CODE] (state, code) {
    const pos = state.areaCodes.findIndex((o) => o.a_code === code)
    if (pos > -1) {
      state.areaCodes.splice(pos, 1)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
