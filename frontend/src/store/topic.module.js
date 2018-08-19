import { TopicService } from '@/common/api.service'
import { FETCH_TOPICS } from './actions.type'
import { FETCH_START, FETCH_TOPICS_END } from './mutations.type'

const state = {
  topics: [],
  isLoading: true,
  topicsCount: 0
}

const getters = {
  topicsCount (state) {
    return state.topicsCount
  },
  topics (state) {
    return state.topics
  },
  isTopicsLoading (state) {
    return state.isLoading
  }
}

const actions = {
  [FETCH_TOPICS] (context, params) {
    context.commit(FETCH_START)
    return TopicService.query(params.type, params.filters)
      .then(({ data }) => {
        context.commit(FETCH_TOPICS_END, data)
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
  [FETCH_TOPICS_END] (state, topics) {
    // console.log(topics)
    state.topics = topics
    state.topicsCount = topics.length
    state.isLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
