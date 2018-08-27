<template>
  <div id="app">
    <v-app>
      <app-header/>
      <router-view/>
      <!--<app-footer/>-->
    </v-app>
  </div>
</template>

<script>
import Vue from 'vue'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import {FETCH_EDU_CODES, FETCH_AREA_CODES} from '@/store/actions.type'

export default {
  name: 'App',
  components: { AppHeader, AppFooter },
  created () {
    this.fetchCodes()

    Vue.prototype.$isLogin = this.isLogin()
  },
  methods: {
    async fetchCodes () {
      await this.$store.dispatch(FETCH_EDU_CODES)
      await this.$store.dispatch(FETCH_AREA_CODES)
    },
    isLogin () {
      return true
    }
  }
}
</script>

<style>
#app {
  margin: 2px 2px;
}
</style>
