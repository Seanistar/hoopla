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
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

export default {
  name: 'App',
  components: { AppHeader, AppFooter }
}
</script>

<style>
#app {
  margin: 2px 2px;
}
</style>
