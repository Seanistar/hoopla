import Vue from 'vue'
import Vuex from 'vuex'

import auth from './module/auth'
import admin from './module/admin'
import volunteer from './module/volunteer'
import code from './module/code'
import report from './module/report'
import stat from './module/stat'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    admin,
    volunteer,
    code,
    report,
    stat
  }
})
