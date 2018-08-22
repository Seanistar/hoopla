import Vue from 'vue'
import Vuex from 'vuex'

import topic from './topic.module'
import scrap from './scrap.module'
import author from './author.module'
import volunteer from './volunteer.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // auth,
    scrap,
    author,
    volunteer,
    topic
  }
})
