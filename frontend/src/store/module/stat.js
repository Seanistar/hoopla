import { StatService } from '@/common/api.service'
import {
  FETCH_STAT_YEARLY,
  FETCH_STAT_CHURCH,
  FETCH_STAT_VOLT,
  FETCH_STAT_AREA,
  FETCH_STAT_ACTS
} from '../actions.type'
import {
  FETCH_STAT_YEARLY_END,
  FETCH_STAT_CHURCH_END,
  FETCH_STAT_AREA_END,
  FETCH_STAT_VOLT_END,
  FETCH_STAT_ACTS_END,
  FETCH_START
} from '../mutations.type'

const state = {
  isLoading: false,
  yearsList: [],
  churchList: [],
  areaList: [],
  voltList: [],
  actsList: []
}

const getters = {
  statYears: state => state.yearsList,
  statChurch: state => state.churchList,
  statArea: state => state.areaList,
  statVolts: state => state.voltList,
  statActs: state => state.actsList
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
  [FETCH_STAT_AREA] (context, params) {
    context.commit(FETCH_START)
    return StatService.get_area(params)
      .then(({ data }) => {
        context.commit(FETCH_STAT_AREA_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_STAT_VOLT] (context, params) {
    context.commit(FETCH_START)
    return StatService.get_volt(params)
      .then(({ data }) => {
        context.commit(FETCH_STAT_VOLT_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_STAT_ACTS] (context, params) {
    context.commit(FETCH_START)
    return StatService.get_acts(params)
      .then(({ data }) => {
        context.commit(FETCH_STAT_ACTS_END, data)
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
  },
  [FETCH_STAT_ACTS_END] (state, data) {
    state.actsList = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
