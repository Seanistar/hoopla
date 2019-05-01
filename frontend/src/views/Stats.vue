<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout :class="[window.width <= 600 ? 'mt-2' : 'mt-4']" pt-0 class="elevation-3">
      <component :is="targetComponents[tabIdx]" />
    </v-layout>
    <!--<float-button path="stats"/>-->
  </v-container>
</template>

<script>
import StatYearly from '@/components/StatYearly'
import StatChurch from '@/components/StatChurch'
import StatArea from '@/components/StatArea'
import StatVolt from '@/components/StatVolts'
import StatActs from '@/components/StatActs'
import StatOthers from '@/components/StatOthers'
import StatLeaders from '@/components/StatLeaders'
import FloatButton from '@/components/control/FloatButton'

export default {
  name: 'Stats',
  components: { StatYearly, StatChurch, StatArea, StatVolt, StatActs, StatOthers, StatLeaders, FloatButton },
  computed: {
    targetComponents () {
      return ['StatArea', 'StatYearly', 'StatChurch', 'StatVolt', 'StatActs', 'StatOthers', 'StatLeaders']
    }
  },
  data: () => ({
    tabIdx: 0,
    window: {
      width: 0,
      height: 0
    },
    titles: ['교구별 현황', '연도별 현황', '본당별 현황',
      '전체 봉사자 현황', '봉사 활동 현황', '타 본당 봉사 현황', '대표 봉사자 현황']
  }),
  created () {
    this.window.width = window.innerWidth
    this.window.height = window.innerHeight
  }
}
</script>

<style scoped>
</style>

<style>
  @media screen and (max-width: 600px) {
    .data-column th {
      width: 80px !important;
    }
    .main-table .v-table__overflow table.v-table {
      width: 1600px !important;
      overflow-x: auto;
    }
    .w-5 { width: 5% !important; }
  }
</style>
