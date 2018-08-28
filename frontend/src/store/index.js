import Vue from 'vue'
import Vuex from 'vuex'

import scrap from './scrap.module'
import admin from './admin.module'
import volunteer from './volunteer.module'
import code from './code.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // auth,
    scrap,
    admin,
    volunteer,
    code
  }
})
