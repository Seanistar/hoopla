<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4"
    >
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout mt-4 pt-0 class="elevation-3">
      <component :is="targetComponents[tabIdx]" />
    </v-layout>
    <float-button/>
  </v-container>
</template>

<script>
import StatYearly from '@/components/StatYearly'
import StatChurch from '@/components/StatChurch'
import FloatButton from '@/components/control/FloatButton'

export default {
  name: 'Stats',
  components: { StatYearly, StatChurch, FloatButton },
  computed: {
    targetComponents () {
      return ['StatYearly', 'StatChurch']
    }
  },
  data: () => ({
    tabIdx: 0,
    titles: ['연도별 봉사현황', '본당별 봉사현황']
  })
}
</script>

<style scoped>
</style>
