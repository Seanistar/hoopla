// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2'
import CommonPlugin from './lib/common.plugin'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueSweetalert2)
Vue.use(CommonPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
