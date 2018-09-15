<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4"
    >
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-0 mt-4 class="elevation-3">
      <report-states v-if="tabIdx === 0" :r_id="id"/>
      <report-volunteers v-else-if="tabIdx === 1" :r_id="id"/>
      <report-acts v-else-if="tabIdx === 2" :r_id="id"/>
    </v-layout>
    <float-button/>
  </v-container>
</template>

<script>
import ReportStates from '@/components/ReportStates'
import ReportVolunteers from '@/components/ReportVolunteers'
import ReportActs from '@/components/ReportActs'
import FloatButton from '@/components/control/FloatButton'

export default {
  name: 'EditReport',
  components: { ReportStates, ReportVolunteers, ReportActs, FloatButton },
  props: { id: null },
  watch: {
    tabIdx (idx) {
    }
  },
  data: () => ({
    tabIdx: 0,
    titles: ['현황 내역', '봉사자 명단', '그룹 봉사 내역']
  }),
  methods: {
  }
}
</script>

<style>
</style>
