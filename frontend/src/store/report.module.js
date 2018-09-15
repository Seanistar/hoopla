import { ReportService } from '@/common/api.service'
import {
  FETCH_REPORTS,
  FETCH_REPORT_STATE,
  CREATE_REPORT,
  UPDATE_REPORT,
  DELETE_REPORT
} from './actions.type'
import {
  FETCH_START,
  FETCH_REPORTS_END,
  ADD_REPORT,
  SET_REPORT,
  REMOVE_REPORT
} from './mutations.type'
import DateFilter from '@/common/date.filter'

const state = {
  reports: [],
  reportCode: '',
  reportInfo: {},
  isLoading: false,
  reportCount: 0
}

const getters = {
  reportCount: state => state.reportCount,
  reportInfo: state => state.reportInfo,
  reports: state => state.reports,
  isReportsLoading: state => state.isLoading,
  reportCode: state => state.reportCode
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
  [CREATE_REPORT] (context, report) {
    return ReportService.create(report)
      .then(({ data }) => {
        report.id = data.lastId
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
  [ADD_REPORT] (state, report) {
    console.log(report)
    report.created = DateFilter()
    state.reports.push(report)
  },
  [SET_REPORT] (state, data) {
    state.reportInfo = data
  },
  [REMOVE_REPORT] (state, id) {
    const pos = state.reports.findIndex((o) => o.id === id)
    if (pos > -1) {
      console.log('remove position : ', pos)
      state.reports.splice(pos, 1)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
