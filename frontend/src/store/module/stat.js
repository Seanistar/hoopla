import { StatService } from '@/common/api.service'
import {
  FETCH_STAT_YEARLY,
  FETCH_STAT_CHURCH,
  FETCH_STAT_VOLT,
  FETCH_STAT_AREA
} from '../actions.type'
import {
  FETCH_STAT_YEARLY_END,
  FETCH_STAT_CHURCH_END,
  FETCH_STAT_AREA_END,
  FETCH_STAT_VOLT_END,
  FETCH_START
} from '../mutations.type'

const state = {
  isLoading: false,
  yearsList: [],
  churchList: [],
  areaList: [],
  voltList: []
}

const getters = {
  statYears: state => state.yearsList,
  statChurch: state => state.churchList,
  statArea: state => state.areaList,
  statVolts: state => state.voltList
}

const actions = {
  [FETCH_STAT_YEARLY] (context, params) {
    context.commit(FETCH_START)
    return StatService.get_yearly(params)
      .then(({ data }) => {
        context.commit(FETCH_STAT_YEARLY_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_STAT_CHURCH] (context, params) {
    context.commit(FETCH_START)
    return StatService.get_church(params)
      .then(({ data }) => {
        context.commit(FETCH_STAT_CHURCH_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_STAT_AREA] (context) {
    context.commit(FETCH_START)
    return StatService.get_area()
      .then(({ data }) => {
        context.commit(FETCH_STAT_AREA_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_STAT_VOLT] (context) {
    context.commit(FETCH_START)
    return StatService.get_volt()
      .then(({ data }) => {
        context.commit(FETCH_STAT_VOLT_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

const mutations = {
  [FETCH_START] (state) {
    state.isLoading = true
  },
  [FETCH_STAT_YEARLY_END] (state, data) {
    state.yearsList = data
  },
  [FETCH_STAT_CHURCH_END] (state, data) {
    state.churchList = data
  },
  [FETCH_STAT_AREA_END] (state, data) {
    state.areaList = data
  },
  [FETCH_STAT_VOLT_END] (state, data) {
    state.voltList = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
