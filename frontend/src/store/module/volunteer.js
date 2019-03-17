import { VolunteerService } from '@/common/api.service'
import {
  FETCH_VOLUNTEERS, CREATE_VOLUNTEER, UPDATE_VOLUNTEER, DELETE_VOLUNTEER, FETCH_VOLUNTEER_ITEM,
  QUERY_VOLUNTEERS, QUERY_VOLUNTEER_ITEM, GET_TOTAL_COUNT,
  FIND_VOLUNTEERS,
  FETCH_VOLUNTEER_EDUS, CREATE_VOLUNTEER_EDU, UPDATE_VOLUNTEER_EDU, DELETE_VOLUNTEER_EDU,
  FETCH_VOLUNTEER_ACTS, CREATE_VOLUNTEER_ACT, UPDATE_VOLUNTEER_ACT, DELETE_VOLUNTEER_ACT,
  FETCH_VOLUNTEER_LEADER, BEGIN_VOLUNTEER_LEADER, END_VOLUNTEER_LEADER,
  FETCH_VOLUNTEER_HISTORY, CREATE_VOLUNTEER_HISTORY
} from '../actions.type'
import {
  FETCH_START, SET_CHANGED_CODE, SET_TOTAL_COUNT,
  FETCH_VOLUNTEERS_END, ADD_VOLUNTEER, SET_VOLUNTEER, REMOVE_VOLUNTEER,
  START_QUERYING, QUERY_VOLUNTEERS_END, SET_QUERY_INFO, SET_QUERIED_VOLUNTEER_ITEM,
  START_FINDING, FIND_VOLUNTEERS_END, RESET_FIND_VOLUNTEERS,
  FETCH_VOLUNTEER_EDUS_END, SET_VOLUNTEER_EDU, ADD_VOLUNTEER_EDU, REMOVE_VOLUNTEER_EDU,
  FETCH_VOLUNTEER_ACTS_END, SET_VOLUNTEER_ACT, ADD_VOLUNTEER_ACT, REMOVE_VOLUNTEER_ACT,
  FETCH_VOLUNTEER_LEADER_END, YES_VOLUNTEER_LEADER, NO_VOLUNTEER_LEADER,
  FETCH_VOLUNTEER_HISTORY_END, ADD_VOLUNTEER_HISTORY
} from '../mutations.type'

import { orderBy } from 'lodash/collection'

const state = {
  volunteers: [],
  volunteerEdus: [],
  volunteerActs: [],
  volunteerHistory: [],
  volunteerLeader: [],
  changedCodes: {
    vl_ac: null, // volunteer list
    rl_ac: null // report list
  },
  isLoading: false,
  isFinding: false,
  isQuerying: false,
  volunteersCount: 0,
  queryCount: 0,
  queryInfo: {cond: {}, good: {}},
  queryResult: [],
  queriedVoltItems: [],
  foundCount: 0,
  foundResult: [],
  totalCount: 0
}

const getters = {
  volunteerInfo: (state) => (id) => {
    return state.volunteers.find((o) => o.id === id)
  },
  totalCount: state => state.totalCount,
  volunteers: state => state.volunteers,
  volunteerEdus: state => state.volunteerEdus,
  volunteerActs: state => state.volunteerActs,
  volunteerLeader: state => state.volunteerLeader,
  volunteerHistory: state => state.volunteerHistory,
  isVolunteersLoading: state => state.isLoading,
  isQuerying: state => state.isQuerying,
  isFinding: state => state.isFinding,
  volunteersCount: state => state.volunteersCount,
  queryVolunteers: state => state.queryResult,
  queryCount: state => state.queryCount,
  queryInfo: state => state.queryInfo,
  queriedVoltItems: state => state.queriedVoltItems,
  foundVolunteers: state => state.foundResult,
  foundCount: state => state.foundCount,
  changedCodes: state => state.changedCodes
}

const actions = {
  [FETCH_VOLUNTEERS] (context, params) {
    context.commit(FETCH_START)
    return VolunteerService.fetch(params)
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
        data.length && context.commit(SET_VOLUNTEER, data[0])
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [GET_TOTAL_COUNT] (context) {
    return VolunteerService.total()
      .then(({ data }) => {
        context.commit(SET_TOTAL_COUNT, data.TOT)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_VOLUNTEER] (context, volunteer) {
    return VolunteerService.create(volunteer)
      .then(({ data }) => {
        if (data.newID < 0) return -1
        volunteer.id = data.newID
        context.commit(ADD_VOLUNTEER, volunteer)
        return data.newID
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_VOLUNTEER] (context, params) {
    return VolunteerService.update(params)
      .then(({ data }) => {
        // if (!data.success) return false
        context.commit(SET_VOLUNTEER, params)
        // return true
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
        edu.id = data.newID
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
        act.id = data.newID
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
  },
  [QUERY_VOLUNTEERS] (context, params) {
    context.commit(START_QUERYING)
    return VolunteerService.query(params)
      .then(({ data }) => {
        context.commit(QUERY_VOLUNTEERS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [QUERY_VOLUNTEER_ITEM] (context, params) {
    context.commit(START_QUERYING)
    return VolunteerService.query_volt(params)
      .then(({ data }) => {
        context.commit(SET_QUERIED_VOLUNTEER_ITEM, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FIND_VOLUNTEERS] (context, params) {
    context.commit(START_FINDING)
    return VolunteerService.find(params)
      .then(({ data }) => {
        context.commit(FIND_VOLUNTEERS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_VOLUNTEER_LEADER] (context, id) {
    context.commit(FETCH_START)
    return VolunteerService.get_leader(id)
      .then(({ data }) => {
        context.commit(FETCH_VOLUNTEER_LEADER_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [BEGIN_VOLUNTEER_LEADER] (context, ldr) {
    return VolunteerService.create_leader(ldr)
      .then(() => {
        context.commit(YES_VOLUNTEER_LEADER, ldr)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [END_VOLUNTEER_LEADER] (context, ldr) {
    return VolunteerService.update_leader(ldr)
      .then(() => {
        context.commit(NO_VOLUNTEER_LEADER, ldr)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_VOLUNTEER_HISTORY] (context, id) {
    context.commit(FETCH_START)
    return VolunteerService.get_history(id)
      .then(({ data }) => {
        context.commit(FETCH_VOLUNTEER_HISTORY_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_VOLUNTEER_HISTORY] (context, hst) {
    return VolunteerService.create_history(hst)
      .then(() => {
        context.commit(ADD_VOLUNTEER_HISTORY, hst)
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
  [START_FINDING] (state) {
    state.isFinding = true
  },
  [START_QUERYING] (state) {
    state.isQuerying = true
  },
  [SET_TOTAL_COUNT] (state, count) {
    state.totalCount = count
  },
  [FETCH_VOLUNTEERS_END] (state, volunteers) {
    state.volunteers = volunteers
    state.volunteersCount = volunteers.length
    state.isLoading = false
  },
  [ADD_VOLUNTEER] (state, volunteer) {
    state.volunteers.push(volunteer)
  },
  [SET_VOLUNTEER] (state, data) {
    const pos = state.volunteers.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      // console.log('set position : ', pos, data)
      Object.assign(state.volunteers[pos], data)
    } else {
      // console.log('no pos and add position : ', pos)
      state.volunteers.push(data)
    }
  },
  [REMOVE_VOLUNTEER] (state, id) {
    const pos = state.volunteers.findIndex((o) => o.id === id)
    if (pos > -1) {
      // console.log('remove position : ', pos)
      state.volunteers.splice(pos, 1)
    }
  },
  [FETCH_VOLUNTEER_EDUS_END] (state, edus) {
    for (let i = 0; i < edus.length; i++) {
      edus[i].idx = i + 1
    }
    state.volunteerEdus = edus
    state.isLoading = false
  },
  [ADD_VOLUNTEER_EDU] (state, edu) {
    // edu.created = Moment().format('YYYY-MM-DD HH:mm:ss')()
    edu.idx = state.volunteerEdus.length + 1
    state.volunteerEdus.push(edu)
  },
  [SET_VOLUNTEER_EDU] (state, data) {
    const pos = state.volunteerEdus.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      // console.log('set position : ', pos)
      Object.assign(state.volunteerEdus[pos], data)
    } else {
      // console.log('no pos and add position : ', pos)
      state.volunteerEdus.push(data)
    }
  },
  [REMOVE_VOLUNTEER_EDU] (state, id) {
    const pos = state.volunteerEdus.findIndex((o) => o.id === id)
    if (pos > -1) {
      // console.log('remove position : ', pos)
      state.volunteerEdus.splice(pos, 1)
    }
  },
  [FETCH_VOLUNTEER_ACTS_END] (state, acts) {
    for (let i = 0; i < acts.length; i++) {
      acts[i].idx = i + 1
    }
    state.volunteerActs = acts
    state.isLoading = false
  },
  [ADD_VOLUNTEER_ACT] (state, act) {
    act.idx = state.volunteerActs.length + 1
    state.volunteerActs.push(act)
  },
  [SET_VOLUNTEER_ACT] (state, data) {
    const pos = state.volunteerActs.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      // console.log('set position : ', pos)
      Object.assign(state.volunteerActs[pos], data)
    } else {
      // console.log('no pos and add position : ', pos)
      state.volunteerActs.push(data)
    }
  },
  [REMOVE_VOLUNTEER_ACT] (state, id) {
    const pos = state.volunteerActs.findIndex((o) => o.id === id)
    if (pos > -1) {
      // console.log('remove position : ', pos)
      state.volunteerActs.splice(pos, 1)
    }
  },
  [QUERY_VOLUNTEERS_END] (state, results) {
    // console.log(results)
    state.queryResult = orderBy(results, ['au_date', 'sa_name'], ['desc', 'asc'])
    state.queryCount = results.length
    state.isQuerying = false
  },
  [SET_QUERIED_VOLUNTEER_ITEM] (state, results) {
    state.queriedVoltItems = results
    state.isQuerying = false
  },
  [SET_QUERY_INFO] (state, data) {
    state.queryInfo.cond = data.cond
    state.queryInfo.good = data.good
  },
  [FIND_VOLUNTEERS_END] (state, results) {
    // console.log(results)
    state.foundResult = results
    state.foundCount = results.length
    state.isFinding = false
  },
  [RESET_FIND_VOLUNTEERS] (state) {
    state.foundResult = []
    state.foundCount = 0
  },
  [FETCH_VOLUNTEER_LEADER_END] (state, ldr) {
    for (let i = 0; i < ldr.length; i++) {
      ldr[i].idx = i + 1
    }
    state.volunteerLeader = ldr
    state.isLoading = false
  },
  [YES_VOLUNTEER_LEADER] (state, ldr) {
    const pos = state.volunteers.findIndex((o) => o.id === ldr.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.volunteers[pos], {l_work: 'Y', ls_date: ldr.ls_date})
    }
  },
  [NO_VOLUNTEER_LEADER] (state, ldr) {
    const pos = state.volunteers.findIndex((o) => o.id === ldr.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.volunteers[pos], {l_work: 'N', ls_date: null, le_date: null})
    }
  },
  [FETCH_VOLUNTEER_HISTORY_END] (state, hst) {
    for (let i = 0; i < hst.length; i++) {
      hst[i].idx = i + 1
    }
    state.volunteerHistory = hst
    state.isLoading = false
  },
  [ADD_VOLUNTEER_HISTORY] (state, hst) {
    state.volunteerHistory.push(hst)
  },
  [SET_CHANGED_CODE] (state, param) {
    state.changedCodes[param.type] = param.code
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
