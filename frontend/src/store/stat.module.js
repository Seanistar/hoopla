import { StatService } from '@/common/api.service'
import { FETCH_STAT_YEARLY, FETCH_STAT_CHURCH } from './actions.type'
import { FETCH_STAT_YEARLY_END, FETCH_STAT_CHURCH_END, FETCH_START } from './mutations.type'

const state = {
  isLoading: false,
  yearsList: [],
  churchList: []
}

const getters = {
  statYears: state => state.yearsList,
  statChurch: state => state.churchList
}

const actions = {
  [FETCH_STAT_YEARLY] (context) {
    context.commit(FETCH_START)
    return StatService.get_yearly()
      .then(({ data }) => {
        context.commit(FETCH_STAT_YEARLY_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_STAT_CHURCH] (context) {
    context.commit(FETCH_START)
    return StatService.get_church()
      .then(({ data }) => {
        context.commit(FETCH_STAT_CHURCH_END, data)
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
