<template>
  <div class="tp-10">
    <v-container>
      <v-tabs left>
        <v-tab v-for="(item, idx) in title" :key="idx" @click="tabIdx = idx"><strong>{{ item.text }}</strong></v-tab>
      </v-tabs>
      <v-divider class="bm-10 tm-10"></v-divider>
      <volunteer-item v-if="tabIdx === 0"/>
      <volunteer-edus v-else-if="tabIdx === 1"/>
      <volunteer-acts v-else/>
    </v-container>
  </div>
</template>

<script>
import VolunteerItem from '@/components/VolunteerItem'
import VolunteerEdus from '@/components/VolunteerEdus'
import VolunteerActs from '@/components/VolunteerActs'

export default {
  name: 'NewVolts',
  components: { VolunteerItem, VolunteerEdus, VolunteerActs },
  data: () => ({
    tabIdx: 0,
    title: [
      { text: '봉사자 기본 정보', link: '' },
      { text: '봉사자 교육 현황', link: '' },
      { text: '봉사자 활동 내역', link: '' }
    ]
  })
}
</script>

<style>
</style>
