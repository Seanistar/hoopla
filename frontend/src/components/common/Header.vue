<template>
  <md-tabs md-sync-route class="header">
    <md-tab id="tab-home" md-label="Home" to="/components/tabs/home"></md-tab>
    <md-tab id="tab-pages" md-label="Topics" to="/topics"></md-tab>
    <md-tab id="tab-posts" md-label="Authors" to="/authors"></md-tab>
    <md-tab id="tab-settings" md-label="Settings" to="/components/tabs/settings"></md-tab>
    <!--<md-tab id="tab-disabled" md-label="Disabled" md-disabled></md-tab>-->
  </md-tabs>
</template>

<script>
import Vue from 'vue'
import { MdTabs, MdButton } from 'vue-material/dist/components'

Vue.use(MdTabs)
Vue.use(MdButton)

export default {
  name: 'Header'
}
</script>

<style scoped>
  .header {
    padding: 15px 0;
  }
</style>
