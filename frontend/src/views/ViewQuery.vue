<template>
  <v-container pt-3>
    <v-tabs align-with-title fixed-tabs class="elevation-4"
    >
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-1>
      <query-edus v-if="tabIdx === 0" :r_id="id"/>
      <query-acts v-else-if="tabIdx === 1" :r_id="id"/>
    </v-layout>
  </v-container>
</template>

<script>
import QueryEdus from '@/components/QueryEdus'
import QueryActs from '@/components/QueryActs'

export default {
  name: 'PartQuery',
  components: { QueryEdus, QueryActs },
  props: { id: null },
  watch: {
    tabIdx (idx) {
    }
  },
  data: () => ({
    tabIdx: 0,
    titles: ['봉사자 교육 현황', '그룹공부 봉사 현황']
  })
}
</script>

<style>
</style>
