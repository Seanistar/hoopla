<template>
  <div id="app">
    <app-header/>
    <!--<img src="./assets/logo.png">-->
    <router-view/>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '@/components/common/Header'
import AppFooter from '@/components/common/Footer'

export default {
  name: 'App',
  components: { AppHeader, AppFooter }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 15px 10px 15px;
}
</style>
