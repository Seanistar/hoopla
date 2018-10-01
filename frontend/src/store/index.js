import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth.module'
import admin from './admin.module'
import volunteer from './volunteer.module'
import code from './code.module'
import report from './report.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    admin,
    volunteer,
    code,
    report
  }
})
