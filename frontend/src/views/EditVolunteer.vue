<template>
  <v-container>
    <v-tabs left align-with-title fixed-tabs>
      <v-tab v-for="(item, idx) in title" :key="idx" @click="tabIdx = idx">
        <strong>{{ item }}</strong>
      </v-tab>
    </v-tabs>
    <v-divider class="ma-1"></v-divider>
    <volunteer-item v-if="tabIdx === 0" :v_id="id"/>
    <volunteer-edus v-else-if="tabIdx === 1" :v_id="id"/>
    <volunteer-acts v-else-if="tabIdx === 2" :v_id="id"/>
  </v-container>
</template>

<script>
import VolunteerItem from '@/components/VolunteerItem'
import VolunteerEdus from '@/components/VolunteerEdus'
import VolunteerActs from '@/components/VolunteerActs'

export default {
  name: 'EditVolunteer',
  components: { VolunteerItem, VolunteerEdus, VolunteerActs },
  props: { id: null },
  watch: {
    tabIdx (idx) {
      if (idx === 1 || idx === 2) {

      }
    }
  },
  data: () => ({
    tabIdx: 0,
    title: ['기본 정보', '교육 현황', '그룹공부 봉사', '대표 이력', '전출입 이력']
  })
}
</script>

<style>
</style>
