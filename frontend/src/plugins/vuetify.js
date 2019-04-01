import Vue from 'vue'
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
