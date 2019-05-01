<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx"
            :disabled="idx !== 0 && r_id === undefined">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-0 mt-4 class="elevation-3">
      <component :is="targetComponents[tabIdx]" :r_id.sync="r_id"/>
    </v-layout>
    <float-button path="reports"/>
  </v-container>
</template>

<script>
// import ReportStates from '@/components/ReportStates'
import ReportVolunteers from '@/components/ReportVolunteers'
import ReportActs from '@/components/ReportActs'
import ReportDirect from '@/components/ReportActsDirect'
import ReportGroupActs from '@/components/ReportGroupActs'
import FloatButton from '@/components/control/FloatButton'
import { mapGetters } from 'vuex'

export default {
  name: 'EditReport',
  components: { ReportVolunteers, ReportDirect, ReportActs, ReportGroupActs, FloatButton },
  props: { id: undefined, rObj: Object },
  computed: {
    ...mapGetters([
      'smallCodes',
      'changedChurchCode',
      'authInfo'
    ]),
    targetComponents () {
      return ['ReportGroupActs', 'ReportVolunteers', 'ReportDirect', 'ReportActs']
    },
    RID: {
      get () { return this.r_id },
      set (id) { if (this.r_id === undefined) this.r_id = id }
    },
    S_DATE: {
      get () { return this.s_date },
      set (date) { if (this.s_date === undefined) this.s_date = date }
    },
    E_DATE: {
      get () { return this.e_date },
      set (date) { if (this.e_date === undefined) this.e_date = date }
    },
    S_CODE: {
      get () { return this.s_code },
      set (code) { this.s_code = code }
    },
    S_NAME: {
      get () { return this.s_name },
      set (name) { this.s_name = name }
    }
  },
  data: () => ({
    r_id: undefined,
    s_code: undefined, // 현재 조회 중인 본당 코드
    s_name: undefined, // 현재 조회 중인 본당 이름
    e_date: undefined,
    s_date: undefined,
    tabIdx: 0,
    winWidth: 0,
    titles: ['본당 그룹 현황', '활동 봉사자 명단', '그룹 봉사 (전체입력)', '그룹 봉사 (개별입력)']
  }),
  created () {
    this.r_id = this.id
    this.winWidth = window.innerWidth
  },
  methods: { // 신규 생성 시 무조건 지정해서 들어온다. (s_code, s_name, r_year, r_half)
    getReportInfo () {
      return this.rObj
    },
    getSmall () { // 신규 생성에서 접근할 때
      if (this.S_CODE && this.S_NAME) return { s_code: this.S_CODE, s_name: this.S_NAME }
      let sc = this.changedChurchCode
      if (!sc) sc = this.authInfo.area_code
      return this.smallCodes(this.authInfo).find(o => o.s_code === sc)
    },
    isAccessible () {
      if (!this.$parent.S_CODE) return true // 신규인 경우는 가능
      if (!this.authInfo || !this.authInfo.area_code) return false
      else if (this.authInfo.level === 'L4') return true
      return this.S_CODE.substr(0, 2) === this.authInfo.area_code.substr(0, 2)
    }
  }
}
</script>

<style>
</style>
