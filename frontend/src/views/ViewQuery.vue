<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4"
    >
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout mt-4 pt-0 class="elevation-3">
      <component :is="targetComponents[tabIdx]" :r_id="id"/>
    </v-layout>
    <float-button/>
  </v-container>
</template>

<script>
import QueryEdus from '@/components/QueryEdus'
import QueryBibles from '@/components/QueryBibles'
import QueryActs from '@/components/QueryActs'
import QueryNotes from '@/components/QueryNotes'
import FloatButton from '@/components/control/FloatButton'

export default {
  name: 'PartQuery',
  components: { QueryEdus, QueryNotes, QueryBibles, QueryActs, FloatButton },
  props: { id: null },
  computed: {
    targetComponents () {
      return ['QueryEdus', 'QueryBibles', 'QueryNotes', 'QueryActs']
    }
  },
  watch: {
    tabIdx (idx) {
    }
  },
  data: () => ({
    tabIdx: 0,
    titles: ['기본 교육 현황', '성서 연수 현황', '노트 검사 현황', '그룹 봉사 현황']
  })
}
</script>

<style scoped>
</style>
