<template>
  <div id="app">
    <v-app>
      <app-header/>
      <v-content>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-content>
      <app-footer/>
      <app-snack-bar ref="bar"/>
    </v-app>
  </div>
</template>

<script>
import Vue from 'vue'
import AppSnackBar from '@/components/control/AppSnackBar'
import AppConfirm from '@/components/control/AppConfirm'
import AppHeader from '@/components/app/Header'
import AppFooter from '@/components/app/Footer'
import {FETCH_EDU_CODES, FETCH_AREA_CODES} from '@/store/actions.type'

export default {
  name: 'App',
  components: { AppSnackBar, AppConfirm, AppHeader, AppFooter },
  async created () {
    await this.$store.dispatch(FETCH_EDU_CODES)
    await this.$store.dispatch(FETCH_AREA_CODES)

    Vue.prototype.$showSnackBar = this.showSnackBar
    Vue.prototype.$showConfirm = this.showConfirm
  },
  methods: {
    showSnackBar (msg) {
      this.$refs.bar.show(msg)
    },
    showConfirm (title, msg, cb) {
    },
    checkPerm () {

    }
  }
}
</script>

<style>
  #app {
    margin: 0px 2px;
  }
  .theme--light.v-table thead th {
    background-color: lightgrey;
  }
  @media screen and (max-width: 900px) {
    .container {
      padding: 1px !important;
    }
  }
</style>
