import { ReportService, VolunteerService } from '@/common/api.service'
import {
  FETCH_REPORTS,
  FETCH_REPORT_STATE,
  FETCH_REPORT_ACTS,
  FETCH_SMALL_LEADER,
  CREATE_REPORT, UPDATE_REPORT, DELETE_REPORT,
  CREATE_REPORT_ACT, UPDATE_REPORT_ACT, DELETE_REPORT_ACT
} from './actions.type'
import {
  FETCH_START,
  FETCH_REPORTS_END,
  FETCH_REPORT_ACTS_END,
  SET_SMALL_LEADER,
  ADD_REPORT, SET_REPORT, REMOVE_REPORT,
  SET_REPORT_ACT, ADD_REPORT_ACT, REMOVE_REPORT_ACT
} from './mutations.type'
import DateFilter from '@/common/date.filter'

const state = {
  reports: [],
  reportCode: '',
  reportInfo: {},
  isLoading: false,
  smallLeader: {},
  reportCount: 0,
  reportActs: []
}

const getters = {
  reportCount: state => state.reportCount,
  reportInfo: state => state.reportInfo,
  reports: state => state.reports,
  isReportsLoading: state => state.isLoading,
  smallLeader: state => state.smallLeader,
  reportCode: state => state.reportCode,
  reportActs: state => state.reportActs
}

const actions = {
  [FETCH_REPORTS] (context, code) {
    context.commit(FETCH_START, code)
    return ReportService.query(code)
      .then(({ data }) => {
        context.commit(FETCH_REPORTS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_REPORT_STATE] (context, plug) {
    return ReportService.get(plug)
      .then(({ data }) => {
        context.commit(SET_REPORT, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_REPORT_ACTS] (context, code) {
    context.commit(FETCH_START, code)
    return ReportService.query_acts(code)
      .then(({ data }) => {
        context.commit(FETCH_REPORT_ACTS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_REPORT] (context, report) {
    return ReportService.create(report)
      .then(({ data }) => {
        report.id = data[0].newID
        context.commit(ADD_REPORT, report)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_REPORT] (context, params) {
    context.commit(FETCH_START)
    return ReportService.update(params.id, params.obj)
      .then(({ data }) => {
        context.commit(SET_REPORT, params)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_REPORT] (context, plug) {
    return ReportService.delete(plug)
      .then(({ data }) => {
        context.commit(REMOVE_REPORT, plug)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_REPORT_ACT] (context, act) {
    return VolunteerService.create_act(act)
      .then(({ data }) => {
        act.id = data.lastId
        context.commit(ADD_REPORT_ACT, act)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_REPORT_ACT] (context, params) {
    return VolunteerService.update_act(params)
      .then(({ data }) => {
        context.commit(SET_REPORT_ACT, params)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_REPORT_ACT] (context, plug) {
    return VolunteerService.delete_act(plug)
      .then(({ data }) => {
        context.commit(REMOVE_REPORT_ACT, plug)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_SMALL_LEADER] (context, code) {
    return ReportService.get_leader(code)
      .then(({ data }) => {
        context.commit(SET_SMALL_LEADER, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_START] (state, code) {
    state.isLoading = true
    state.reportCode = code
  },
  [FETCH_REPORTS_END] (state, reports) {
    state.reports = reports
    state.reportsCount = reports.length
    state.isLoading = false
  },
  [FETCH_REPORT_ACTS_END] (state, acts) {
    for (let i = 0; i < acts.length; i++) {
      acts[i].idx = i + 1
    }
    state.reportActs = acts
    state.isLoading = false
  },
  [ADD_REPORT] (state, report) {
    console.log(report)
    report.created = DateFilter()
    state.reports.push(report)
  },
  [SET_REPORT] (state, data) {
    state.reportInfo = data
    const pos = state.reports.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.reports[pos], data)
    } else {
      console.log('no pos and add position : ', pos)
      state.reports.push(data)
    }
  },
  [REMOVE_REPORT] (state, id) {
    const pos = state.reports.findIndex((o) => o.id === id)
    if (pos > -1) {
      console.log('remove position : ', pos)
      state.reports.splice(pos, 1)
    }
  },
  [ADD_REPORT_ACT] (state, act) {
    state.reportActs.push(act)
  },
  [SET_REPORT_ACT] (state, data) {
    const pos = state.reportActs.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.reportActs[pos], data)
    } else {
      console.log('no pos and add position : ', pos)
      state.reportActs.push(data)
    }
  },
  [REMOVE_REPORT_ACT] (state, id) {
    const pos = state.reportActs.findIndex((o) => o.id === id)
    if (pos > -1) {
      console.log('remove position : ', pos)
      state.reportActs.splice(pos, 1)
    }
  },
  [SET_SMALL_LEADER] (state, ldr) {
    state.smallLeader = ldr
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
