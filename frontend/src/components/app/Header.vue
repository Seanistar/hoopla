<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-toolbar color="blue lighten-4" light tabs app>
      <!--<v-img src="../static/logo.png" width="100" height="50"></v-img>-->
      <div class="logo" @click="onSelect('queries')"></div>
      <v-toolbar-title class="headline font-weight-medium">가톨릭성서모임</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in ['인쇄 모드','도움말 보기']" :key="i" @click="selectMenu(i)">
            <v-list-tile-title>{{ item }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-tabs slot="extension" v-model="tabIdx" color="blue lighten-2" grow>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="(item, index) in items" :key="index" ripple class="subheading"
               :disabled="index !== 0 && !isAuth" @click="onSelect(item.link)" >
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="blue lighten-1">
          <v-btn icon dark @click.native="dialog = false"><v-icon>close</v-icon></v-btn>
          <v-toolbar-title>IXTUS 시스템 사용 도움말</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="editable = true" v-if="authInfo && authInfo.level === 'L4'">편집</v-btn>
            <v-btn dark flat @click.native="dialog = false; editable = false">닫기</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <app-helper :editable="editable"></app-helper>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { trimStart } from 'lodash/string'
import { mapGetters } from 'vuex'
import AppHelper from './Helper'

export default {
  name: 'Header',
  components: { AppHelper },
  data () {
    return {
      editable: false,
      tabIdx: null,
      dialog: false,
      alert: {show: false, message: '로그인이 필요합니다.'},
      items: [
        {text: '익투스 안내', link: 'home'},
        {text: '봉사자 정보 입력', link: 'volunteers'},
        {text: '봉사자 조회', link: 'queries'},
        {text: '교육 출석 관리', link: 'attenders'},
        {text: '본당 현황 보고', link: 'reports'},
        {text: '현황 집계', link: 'stats'},
        {text: '기타 관리', link: 'others'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'isAuth', 'authInfo'
    ])
  },
  methods: {
    onSelect (link) {
      if (!this.isAuth && link !== 'home') {
        alert('로그인이 필요합니다!')
        return setTimeout(() => { this.tabIdx = 0 }, 10)
      }
      // console.log('select ' + link)
      this.$router.push({name: link})
      const pos = this.items.findIndex(o => o.link.indexOf(link) > -1)
      this.tabIdx = pos
    },
    selectMenu (index) {
      if (index === 0) setTimeout(() => window.print(), 200)
      else if (index === 1) this.dialog = true // this.$showSnackBar('도움말 준비중입니다!')
      // else if (index === 2) window.open('https://www.google.com/intl/ko_ALL/chrome/')
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
  .v-toolbar {
    z-index: 10;
  }
  .header {
    padding: 15px 0;
  }
  .logo {
    height:50px;
    width:100px;
    background: url('/static/logo.png') no-repeat;
    background-size: cover;
    cursor: pointer;
  }
</style>
<style>
  @media only screen and (max-width: 900px) {
    .v-toolbar__content, .v-toolbar__extension {
      padding: 0 3px !important;
    }
  }
</style>
