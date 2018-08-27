import { VolunteerService } from '@/common/api.service'
import {
  FETCH_VOLUNTEERS,
  CREATE_VOLUNTEER,
  UPDATE_VOLUNTEER,
  DELETE_VOLUNTEER,
  FETCH_VOLUNTEER_ITEM,
  FETCH_VOLUNTEER_EDUS,
  DELETE_VOLUNTEER_ACT,
  CREATE_VOLUNTEER_ACT,
  UPDATE_VOLUNTEER_ACT,
  FETCH_VOLUNTEER_ACTS,
  DELETE_VOLUNTEER_EDU,
  CREATE_VOLUNTEER_EDU,
  UPDATE_VOLUNTEER_EDU
} from './actions.type'
import {
  FETCH_START,
  FETCH_VOLUNTEERS_END,
  ADD_VOLUNTEER,
  SET_VOLUNTEER,
  REMOVE_VOLUNTEER,
  FETCH_VOLUNTEER_EDUS_END,
  SET_VOLUNTEER_EDU,
  ADD_VOLUNTEER_EDU,
  REMOVE_VOLUNTEER_EDU,
  FETCH_VOLUNTEER_ACTS_END,
  SET_VOLUNTEER_ACT,
  ADD_VOLUNTEER_ACT,
  REMOVE_VOLUNTEER_ACT
} from './mutations.type'
import DateFilter from '@/common/date.filter'

const state = {
  volunteers: [],
  volunteerEdus: [],
  volunteerActs: [],
  isLoading: false,
  volunteersCount: 0
}

const getters = {
  volunteersCount (state) {
    return state.volunteersCount
  },
  volunteerInfo: (state) => (id) => {
    return state.volunteers.find((o) => o.id === id)
  },
  volunteers (state, param) {
    // console.log(param)
    return state.volunteers
  },
  volunteerEdus (state) {
    return state.volunteerEdus
  },
  volunteerActs (state) {
    return state.volunteerActs
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
  [FETCH_VOLUNTEER_ITEM] (context, id) {
    return VolunteerService.get(id)
      .then(({ data }) => {
        context.commit(SET_VOLUNTEER, data[0])
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_VOLUNTEER] (context, volunteer) {
    return VolunteerService.create(volunteer)
      .then(({ data }) => {
        volunteer.id = data.lastId
        context.commit(ADD_VOLUNTEER, volunteer)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_VOLUNTEER] (context, params) {
    return VolunteerService.update(params)
      .then(({ data }) => {
        context.commit(SET_VOLUNTEER, params)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_VOLUNTEER] (context, plug) {
    return VolunteerService.delete(plug)
      .then(({ data }) => {
        context.commit(REMOVE_VOLUNTEER, plug)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_VOLUNTEER_EDUS] (context, id) {
    context.commit(FETCH_START)
    return VolunteerService.get_edu(id)
      .then(({ data }) => {
        context.commit(FETCH_VOLUNTEER_EDUS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_VOLUNTEER_EDU] (context, edu) {
    return VolunteerService.create_edu(edu)
      .then(({ data }) => {
        edu.id = data.lastId
        context.commit(ADD_VOLUNTEER_EDU, edu)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_VOLUNTEER_EDU] (context, params) {
    return VolunteerService.update_edu(params)
      .then(({ data }) => {
        context.commit(SET_VOLUNTEER_EDU, params)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_VOLUNTEER_EDU] (context, plug) {
    return VolunteerService.delete_edu(plug)
      .then(({ data }) => {
        context.commit(REMOVE_VOLUNTEER_EDU, plug)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_VOLUNTEER_ACTS] (context, id) {
    context.commit(FETCH_START)
    return VolunteerService.get_act(id)
      .then(({ data }) => {
        context.commit(FETCH_VOLUNTEER_ACTS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_VOLUNTEER_ACT] (context, act) {
    return VolunteerService.create_act(act)
      .then(({ data }) => {
        act.id = data.lastId
        context.commit(ADD_VOLUNTEER_ACT, act)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_VOLUNTEER_ACT] (context, params) {
    return VolunteerService.update_act(params)
      .then(({ data }) => {
        context.commit(SET_VOLUNTEER_ACT, params)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_VOLUNTEER_ACT] (context, plug) {
    return VolunteerService.delete_act(plug)
      .then(({ data }) => {
        context.commit(REMOVE_VOLUNTEER_ACT, plug)
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
  [ADD_VOLUNTEER] (state, volunteer) {
    volunteer.registered = DateFilter()
    state.volunteers.push(volunteer)
  },
  [SET_VOLUNTEER] (state, data) {
    const pos = state.volunteers.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.volunteers[pos], data)
    } else {
      console.log('no pos and add position : ', pos)
      state.volunteers.push(data)
    }
  },
  [REMOVE_VOLUNTEER] (state, id) {
    const pos = state.volunteers.findIndex((o) => o.id === id)
    if (pos > -1) {
      console.log('remove position : ', pos)
      state.volunteers.splice(pos, 1)
    }
  },
  [FETCH_VOLUNTEER_EDUS_END] (state, edus) {
    state.volunteerEdus = edus
    state.isLoading = false
  },
  [ADD_VOLUNTEER_EDU] (state, edu) {
    // edu.created = DateFilter()
    state.volunteerEdus.push(edu)
  },
  [SET_VOLUNTEER_EDU] (state, data) {
    const pos = state.volunteerEdus.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.volunteerEdus[pos], data)
    } else {
      console.log('no pos and add position : ', pos)
      state.volunteerEdus.push(data)
    }
  },
  [REMOVE_VOLUNTEER_EDU] (state, id) {
    const pos = state.volunteerEdus.findIndex((o) => o.id === id)
    if (pos > -1) {
      console.log('remove position : ', pos)
      state.volunteerEdus.splice(pos, 1)
    }
  },
  [FETCH_VOLUNTEER_ACTS_END] (state, acts) {
    state.volunteerActs = acts
    state.isLoading = false
  },
  [ADD_VOLUNTEER_ACT] (state, act) {
    // act.created = DateFilter()
    state.volunteerActs.push(act)
  },
  [SET_VOLUNTEER_ACT] (state, data) {
    const pos = state.volunteerEdus.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.volunteerActs[pos], data)
    } else {
      console.log('no pos and add position : ', pos)
      state.volunteerActs.push(data)
    }
  },
  [REMOVE_VOLUNTEER_ACT] (state, id) {
    const pos = state.volunteerActs.findIndex((o) => o.id === id)
    if (pos > -1) {
      console.log('remove position : ', pos)
      state.volunteerActs.splice(pos, 1)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}