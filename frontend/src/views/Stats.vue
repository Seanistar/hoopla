<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout mt-4 pt-0 class="elevation-3">
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
import FloatButton from '@/components/control/FloatButton'

export default {
  name: 'Stats',
  components: { StatYearly, StatChurch, StatArea, StatVolt, StatActs, FloatButton },
  computed: {
    targetComponents () {
      return ['StatArea', 'StatYearly', 'StatChurch', 'StatVolt', 'StatActs']
    }
  },
  data: () => ({
    tabIdx: 0,
    titles: ['교구별 현황', '연도별 현황', '본당별 현황', '전체 봉사자 현황', '봉사 활동 현황']
  })
}
</script>

<style scoped>
</style>
