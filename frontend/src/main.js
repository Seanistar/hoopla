// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'
import SweetAlert from 'vue-sweetalert2'
import ApiService from '@/common/api.service'
import '@/assets/base.css'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import {
  Vuetify, // required
  VApp, // required
  VGrid,
  VMenu,
  VResponsive,
  VSubheader,
  VCard,
  VTabs,
  VIcon,
  VImg,
  VDivider,
  VBtn,
  VBadge,
  VList,
  VForm,
  VDialog,
  VAlert,
  VTextField,
  VTextarea,
  VSelect,
  VCombobox,
  VCheckbox,
  VDataTable,
  VPagination,
  VProgressLinear,
  VFooter,
  VToolbar,
  VTooltip,
  VRadioGroup,
  VDatePicker,
  VSnackbar,
  VExpansionPanel,
  VProgressCircular,
  transitions
} from 'vuetify'
import { Ripple } from 'vuetify/es5/directives'
import DateFilter from '@/common/date.filter'

Vue.config.productionTip = false

Vue.use(SweetAlert)
Vue.use(Vuetify, {
  components: {
    VApp,
    VMenu,
    VGrid,
    VResponsive,
    VSubheader,
    VCard,
    VTabs,
    VIcon,
    VImg,
    VDivider,
    VBtn,
    VBadge,
    VList,
    VForm,
    VDialog,
    VAlert,
    VTextField,
    VTextarea,
    VSelect,
    VCombobox,
    VCheckbox,
    VDataTable,
    VPagination,
    VProgressLinear,
    VFooter,
    VToolbar,
    VTooltip,
    VRadioGroup,
    VDatePicker,
    VSnackbar,
    VExpansionPanel,
    VProgressCircular,
    transitions
  },
  directives: {
    Ripple
  }
})
Vue.filter('timestamp', DateFilter['timestamp'])
Vue.filter('datestamp', DateFilter['datestamp'])
Vue.filter('monthstamp', DateFilter['monthstamp'])
Vue.filter('yearstamp', DateFilter['yearstamp'])
Vue.prototype.$eventBus = new Vue()

ApiService.init()

// Ensure we checked auth before each page load.
/* router.beforeEach(
  (to, from, next) => {
    return Promise
      .all([store.dispatch(CHECK_AUTH)])
      .then(next)
  }
) */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
