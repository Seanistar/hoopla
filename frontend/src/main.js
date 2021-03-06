// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'
import ApiService from '@/common/api.service'
import '@/assets/base.css'
import '@/common/date.filter'
import '@/plugins/vuetify'

Vue.config.productionTip = false
Vue.prototype.$eventBus = new Vue()

ApiService.init()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
