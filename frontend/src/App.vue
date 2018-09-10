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
    </v-app>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import {FETCH_EDU_CODES, FETCH_AREA_CODES} from '@/store/actions.type'

export default {
  name: 'App',
  components: { AppHeader, AppFooter },
  created () {
    this.fetchCodes()
  },
  methods: {
    async fetchCodes () {
      await this.$store.dispatch(FETCH_EDU_CODES)
      await this.$store.dispatch(FETCH_AREA_CODES)
    }
  }
}
</script>

<style>
#app {
  margin: 0px 2px;
}
</style>
