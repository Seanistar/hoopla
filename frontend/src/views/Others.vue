<template>
  <div>
    <v-container>
      <v-tabs left align-with-title fixed-tabs>
        <v-tab v-for="(item, idx) in title" :key="idx" @click="tabIdx = idx">
          <strong>{{ item }}</strong>
        </v-tab>
      </v-tabs>
      <v-divider class="ma-1"></v-divider>
      <area-code v-if="tabIdx === 0"/>
      <!--<volunteer-edus v-else-if="tabIdx === 1" :v_id="v_id"/>
      <volunteer-acts v-else-if="tabIdx === 2" :v_id="v_id"/>-->
    </v-container>
  </div>
</template>

<script>
import AreaCode from '@/components/AreaCode'

export default {
  name: 'ViewOthers',
  components: { AreaCode },
  data: () => ({
    tabIdx: 0,
    title: ['구역 코드', '교육 과목', '그룹공부 봉사', '보기 설정']
  })
}
</script>

<style scoped>
</style>
