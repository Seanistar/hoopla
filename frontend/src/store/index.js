import Vue from 'vue'
import Vuex from 'vuex'

import topic from './topic.module'
import scrap from './scrap.module'
import author from './author.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // auth,
    scrap,
    author,
    topic
  }
})
