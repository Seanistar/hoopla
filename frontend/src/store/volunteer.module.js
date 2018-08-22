import { VolunteerService } from '@/common/api.service'
import {
  FETCH_VOLUNTEERS,
  CREATE_VOLUNTEER,
  UPDATE_VOLUNTEER,
  DELETE_VOLUNTEER
} from './actions.type'
import {
  FETCH_START,
  FETCH_VOLUNTEERS_END,
  ADD_VOLUNTEER,
  SET_VOLUNTEER,
  REMOVE_VOLUNTEER
} from './mutations.type'
import DateFilter from '@/common/date.filter'

const state = {
  volunteers: [],
  isLoading: false,
  volunteersCount: 0
}

const getters = {
  volunteersCount (state) {
    return state.volunteersCount
  },
  volunteers (state) {
    return state.volunteers
  },
  isVolunteersLoading (state) {
    return state.isLoading
  }
}

const actions = {
  [FETCH_VOLUNTEERS] (context, params) {
    context.commit(FETCH_START)
    return VolunteerService.query(params)
      .then(({ data }) => {
        context.commit(FETCH_VOLUNTEERS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_VOLUNTEER] (context, scrap) {
    return VolunteerService.create(scrap)
      .then(({ data }) => {
        scrap.id = data.lastId
        context.commit(ADD_VOLUNTEER, scrap)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_VOLUNTEER] (context, params) {
    context.commit(FETCH_START)
    return VolunteerService.update(params.id, params.obj)
      .then(({ data }) => {
        context.commit(SET_VOLUNTEER, params)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_VOLUNTEER] (context, plug) {
    return VolunteerService.destroy(plug)
      .then(({ data }) => {
        context.commit(REMOVE_VOLUNTEER, plug)
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
  [FETCH_VOLUNTEERS_END] (state, volunteers) {
    state.volunteers = volunteers
    state.volunteersCount = volunteers.length
    state.isLoading = false
  },
  [ADD_VOLUNTEER] (state, scrap) {
    console.log(scrap)
    scrap.created = DateFilter()
    state.volunteers.push(scrap)
  },
  [SET_VOLUNTEER] (state, data) {
    const pos = state.volunteers.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.volunteers[pos], data.obj)
    }
  },
  [REMOVE_VOLUNTEER] (state, id) {
    const pos = state.volunteers.findIndex((o) => o.id === id)
    if (pos > -1) {
      console.log('remove position : ', pos)
      state.volunteers.splice(pos, 1)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
