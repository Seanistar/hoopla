import { CodeService } from '@/common/api.service'
import {
  FETCH_EDU_CODES, UPDATE_EDUS_CODE,
  FETCH_AREA_CODES, UPDATE_AREA_CODE, DELETE_AREA_CODE } from '../actions.type'
import {
  FETCH_START,
  FETCH_EDU_CODES_END, SET_EDUS_CODE,
  FETCH_AREA_CODES_END,
  SET_AREA_CODE, REMOVE_AREA_CODE } from '../mutations.type'
import { filter } from 'lodash/collection'

const state = {
  eduCodes: [],
  areaCodes: [],
  isLoading: true
}

const getters = {
  eduCodes (state) {
    return filter(state.eduCodes, o => o.code > 50)
  },
  actCodes (state) {
    return filter(state.eduCodes, o => o.type === 'A')
  },
  ebsCodes (state) {
    return filter(state.eduCodes, o => o.type === 'E')
  },
  essCodes (state) {
    return filter(state.eduCodes, o => o.code === 51 || o.code === 53 || o.code === 54)
  },
  trnCodes (state) {
    return filter(state.eduCodes, o => o.type === 'T')
  },
  stdCodes (state) {
    return filter(state.eduCodes, o => o.type === 'N')
  },
  grpCodes (state) {
    return filter(state.eduCodes, o => o.type === 'G')
  },
  maoCodes (state) {
    return filter(state.eduCodes, o => o.type === 'M')
  },
  areaCodes (state) {
    return state.areaCodes
  },
  isCodesLoading (state) {
    return state.isLoading
  },
  smallCodes: (state) => (info) => {
    // 최고 관리자는 모든 본당 접근 가능, 일반 관리자는 자신의 교구내 본당만 접근 가능
    if (!info || info.level === 'L4') {
      return filter(state.areaCodes, o => o.s_code !== null)
    }
    const large = info.area_code.substring(0, 2)
    return filter(state.areaCodes, (ac) => ac.l_code === large && ac.s_code !== null)
  },
  largeCodes (state) {
    return filter(state.areaCodes, (ac) => ac.a_code.length === 2)
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
  },
  [UPDATE_EDUS_CODE] (context, params) {
    return CodeService.update_edus(params)
      .then(({ data }) => {
        context.commit(SET_EDUS_CODE, data)
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
      state.areaCodes[pos] = obj
    } else {
      state.areaCodes.push(obj)
    }
  },
  [REMOVE_AREA_CODE] (state, code) {
    const pos = state.areaCodes.findIndex((o) => o.a_code === code)
    if (pos > -1) {
      state.areaCodes.splice(pos, 1)
    }
  },
  [SET_EDUS_CODE] (state, obj) {
    const pos = state.eduCodes.findIndex((o) => o.code === obj.code)
    if (pos > -1) {
      state.eduCodes[pos] = obj
    } else {
      state.eduCodes.push(obj)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
