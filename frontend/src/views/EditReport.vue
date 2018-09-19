<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4"
    >
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-0 mt-4 class="elevation-3">
      <component :is="targetComponents[tabIdx]" :r_id.sync="id"/>
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
  props: { id: null },
  computed: {
    ...mapGetters([
      'smallCodes',
      'adminInfo'
    ]),
    targetComponents () {
      return ['ReportStates', 'ReportVolunteers', 'ReportActs']
    }
  },
  data: () => ({
    tabIdx: 0,
    titles: ['현황 내역', '봉사자 명단', '그룹 봉사 내역']
  }),
  methods: {
    getSmall () {
      let sc = sessionStorage.getItem('SMALL-CODE')
      if (!sc) sc = this.adminInfo.area_code
      return this.smallCodes.find(o => o.s_code === sc)
    }
  }
}
</script>

<style>
</style>
