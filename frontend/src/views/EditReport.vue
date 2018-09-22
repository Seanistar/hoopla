<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4"
    >
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx"
            :disabled="idx !== 0 && r_id === undefined">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-0 mt-4 class="elevation-3">
      <component :is="targetComponents[tabIdx]" :r_id.sync="r_id"/>
    </v-layout>
    <float-button/>
  </v-container>
</template>

<script>
import ReportStates from '@/components/ReportStates'
import ReportVolunteers from '@/components/ReportVolunteers'
import ReportActs from '@/components/ReportActs'
import FloatButton from '@/components/control/FloatButton'
import { mapGetters } from 'vuex'

export default {
  name: 'EditReport',
  components: { ReportStates, ReportVolunteers, ReportActs, FloatButton },
  props: { id: undefined },
  computed: {
    ...mapGetters([
      'smallCodes',
      'changedCodes',
      'adminInfo'
    ]),
    targetComponents () {
      return ['ReportStates', 'ReportVolunteers', 'ReportActs']
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
    }
  },
  data: () => ({
    r_id: undefined,
    e_date: undefined,
    s_date: undefined,
    tabIdx: 0,
    titles: ['현황 내역', '봉사자 명단', '그룹 봉사 내역']
  }),
  created () {
    this.r_id = this.id
  },
  methods: {
    getSmall () {
      let sc = this.changedCodes.rl_ac
      if (!sc) sc = this.adminInfo.area_code
      return this.smallCodes.find(o => o.s_code === sc)
    }
  }
}
</script>

<style>
</style>
