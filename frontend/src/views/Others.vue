<template>
  <v-container pt-0>
    <v-tabs left align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(item, idx) in title" :key="idx" @click="tabIdx = idx">
        <strong>{{ item }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-1>
      <component :is="targetComponents[tabIdx]"/>
    </v-layout>
  </v-container>
</template>

<script>
import AreaCode from '@/components/AreaCode'
import EdusCode from '@/components/EdusCode'

export default {
  name: 'ViewOthers',
  components: { AreaCode, EdusCode },
  computed: {
    targetComponents () {
      return ['AreaCode', 'EdusCode']
    }
  },
  data: () => ({
    tabIdx: 0,
    title: ['구역 코드', '교육 및 봉사', '관리자 설정']
  })
}
</script>

<style scoped>
</style>
