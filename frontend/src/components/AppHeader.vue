<template>
  <div>
    <v-toolbar color="brown lighten-4" light tabs>
      <v-icon>account_balance</v-icon>
      <v-toolbar-title class="headline font-weight-medium">카톨릭 성서모임</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--<v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>-->
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-tabs slot="extension" v-model="tabIdx" color="brown lighten-3" grow>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="(item, index) in items" :key="index" ripple
               @click="onSelect(item.link)">
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </div>
</template>

<script>
import {trimStart} from 'lodash/string'

export default {
  name: 'Header',
  data () {
    return {
      title: '',
      tabIdx: null,
      items: [
        {text: '성서와 함께', link: 'home'},
        {text: '봉사자 관리', link: 'volunteers'},
        {text: '봉사자 조회', link: 'query'},
        {text: '관리자 설정', link: 'admins'},
        {text: '알림 사항', link: 'notices'}
      ]
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters.isLogin
    }
  },
  methods: {
    onSelect (link) {
      if (!this.isLogin && link !== 'home') {
        alert('로그인이 필요합니다.')
        return setTimeout(() => { this.tabIdx = 0 }, 10)
      }
      // console.log('select ' + link)
      this.$router.push({name: link})
    }
  },
  mounted () {
    const name = trimStart(location.pathname, '/')
    const pos = this.items.findIndex(o => o.link.indexOf(name) > -1)
    this.tabIdx = pos
  }
}
</script>

<style scoped>
  .header {
    padding: 15px 0;
  }
</style>
