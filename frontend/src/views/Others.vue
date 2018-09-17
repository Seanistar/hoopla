<template>
  <v-container pt-0>
    <v-tabs left align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(item, idx) in title" :key="idx" @click="tabIdx = idx">
        <strong>{{ item }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-1>
      <area-code v-if="tabIdx === 0"/>
    </v-layout>
  </v-container>
</template>

<script>
import AreaCode from '@/components/AreaCode'

export default {
  name: 'ViewOthers',
  components: { AreaCode },
  data: () => ({
    tabIdx: 0,
    title: ['구역 코드', '교육 과목', '그룹 공부 봉사', '보기 설정']
  })
}
</script>

<style scoped>
</style>
