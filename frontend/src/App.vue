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
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import {FETCH_EDU_CODES, FETCH_AREA_CODES} from '@/store/actions.type'

export default {
  name: 'App',
  components: { AppSnackBar, AppHeader, AppFooter },
  created () {
    this.fetchCodes()

    Vue.prototype.$showSnackBar = this.showSnackBar
  },
  methods: {
    async fetchCodes () {
      await this.$store.dispatch(FETCH_EDU_CODES)
      await this.$store.dispatch(FETCH_AREA_CODES)
    },
    showSnackBar (msg) {
      this.$refs['bar'].show(msg)
    }
  }
}
</script>

<style>
#app {
  margin: 0px 2px;
}
</style>
