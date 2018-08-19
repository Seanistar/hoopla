import { ScrapService } from '@/common/api.service'
import {
  FETCH_SCRAPS,
  FETCH_SCRAP,
  CREATE_SCRAP,
  UPDATE_SCRAP,
  DELETE_SCRAP
} from './actions.type'
import {
  FETCH_START,
  FETCH_SCRAPS_END,
  ADD_SCRAP,
  SET_SCRAP,
  REMOVE_SCRAP
} from './mutations.type'
import DateFilter from '@/common/date.filter'

const state = {
  scraps: [],
  scrapItem: {},
  isLoading: false,
  scrapsCount: 0
}

const getters = {
  scrapsCount (state) {
    return state.scrapsCount
  },
  scrapItem (state) {
    return state.scrapItem
  },
  scraps (state) {
    return state.scraps
  },
  isScrapsLoading (state) {
    return state.isLoading
  }
}

const actions = {
  [FETCH_SCRAPS] (context, params) {
    context.commit(FETCH_START)
    return ScrapService.query(params)
      .then(({ data }) => {
        context.commit(FETCH_SCRAPS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_SCRAP] (context, plug) {
    return ScrapService.get(plug)
      .then(({ data }) => {
        context.commit(SET_SCRAP, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [CREATE_SCRAP] (context, scrap) {
    return ScrapService.create(scrap)
      .then(({ data }) => {
        scrap.id = data.lastId
        context.commit(ADD_SCRAP, scrap)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [UPDATE_SCRAP] (context, params) {
    context.commit(FETCH_START)
    return ScrapService.update(params.id, params.obj)
      .then(({ data }) => {
        context.commit(SET_SCRAP, params)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [DELETE_SCRAP] (context, plug) {
    return ScrapService.destroy(plug)
      .then(({ data }) => {
        context.commit(REMOVE_SCRAP, plug)
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
  [FETCH_SCRAPS_END] (state, scraps) {
    // console.log(scraps)
    state.scraps = scraps
    state.scrapsCount = scraps.length
    state.isLoading = false
  },
  [ADD_SCRAP] (state, scrap) {
    console.log(scrap)
    scrap.created = DateFilter()
    state.scraps.push(scrap)
  },
  [SET_SCRAP] (state, data) {
    const pos = state.scraps.findIndex((o) => o.id === data.id)
    if (pos > -1) {
      console.log('set position : ', pos)
      Object.assign(state.scraps[pos], data.obj)
    }
    state.scrapItem = data.obj
  },
  [REMOVE_SCRAP] (state, id) {
    const pos = state.scraps.findIndex((o) => o.id === id)
    if (pos > -1) {
      console.log('remove position : ', pos)
      state.scraps.splice(pos, 1)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
