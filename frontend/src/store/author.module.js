import { AuthorService } from '@/common/api.service'
import { FETCH_AUTHORS } from './actions.type'
import { FETCH_START, FETCH_AUTHORS_END } from './mutations.type'

const state = {
  authors: [],
  isLoading: true,
  authorsCount: 0
}

const getters = {
  authorsCount (state) {
    return state.authorsCount
  },
  authors (state) {
    return state.authors
  },
  isAuthorsLoading (state) {
    return state.isLoading
  }
}

const actions = {
  [FETCH_AUTHORS] (context, params) {
    context.commit(FETCH_START)
    return AuthorService.get()
      .then(({ data }) => {
        context.commit(FETCH_AUTHORS_END, data)
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
  [FETCH_AUTHORS_END] (state, authors) {
    state.authors = authors
    state.authorsCount = authors.length
    state.isLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
